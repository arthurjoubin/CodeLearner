import type { Env, UserProgress } from '../types';
import {
  json, error, generateSessionId, getSessionFromCookie,
  getAuthenticatedUserId, hashPassword, verifyPassword, toUserFormat,
} from '../utils';

export async function handleAuth(path: string, method: string, request: Request, origin: string | null, env: Env): Promise<Response | null> {

  // GET /auth/me
  if (path === '/auth/me' && method === 'GET') {
    const sessionId = getSessionFromCookie(request);
    if (!sessionId) {
      return json({ user: null }, origin, env);
    }

    const session = await env.DB.prepare(
      `SELECT s.*, u.id, u.email, u.name, u.avatar_url, p.*
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN user_progress p ON u.id = p.user_id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    ).bind(sessionId).first<{ id: string; email: string; name: string; avatar_url: string } & UserProgress>();

    if (!session) {
      return json({ user: null }, origin, env, 200, {
        'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0',
      });
    }

    return json({ user: toUserFormat(session.id, session.email, session.name, session.avatar_url, session) }, origin, env);
  }

  // POST /auth/logout
  if (path === '/auth/logout' && method === 'POST') {
    const sessionId = getSessionFromCookie(request);
    if (sessionId) {
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    }

    return json({ success: true }, origin, env, 200, {
      'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0',
    });
  }

  // POST /auth/register
  if (path === '/auth/register' && method === 'POST') {
    const body = await request.json() as { email?: string; password?: string; name?: string };
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return error('Email, password and name are required', origin, env, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error('Invalid email format', origin, env, 400);
    }

    if (password.length < 6) {
      return error('Password must be at least 6 characters', origin, env, 400);
    }

    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first<{ id: string }>();

    if (existingUser) {
      return error('Email already registered', origin, env, 409);
    }

    const passwordHash = await hashPassword(password);
    const userId = `local_${crypto.randomUUID()}`;

    await env.DB.prepare(
      'INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)'
    ).bind(userId, email, name, passwordHash).run();

    await env.DB.prepare(
      'INSERT OR IGNORE INTO user_progress (user_id) VALUES (?)'
    ).bind(userId).run();

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(sessionId, userId, expiresAt).run();

    return json({ success: true, user: { id: userId, email, name } }, origin, env, 201, {
      'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${30 * 24 * 60 * 60}`,
    });
  }

  // POST /auth/login
  if (path === '/auth/login' && method === 'POST') {
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return error('Email and password are required', origin, env, 400);
    }

    const user = await env.DB.prepare(
      'SELECT id, email, name, avatar_url, password_hash FROM users WHERE email = ?'
    ).bind(email).first<{ id: string; email: string; name: string; avatar_url: string | null; password_hash: string | null }>();

    if (!user || !user.password_hash) {
      return error('Invalid email or password', origin, env, 401);
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return error('Invalid email or password', origin, env, 401);
    }

    const progress = await env.DB.prepare(
      'SELECT * FROM user_progress WHERE user_id = ?'
    ).bind(user.id).first<UserProgress>();

    if (!progress) {
      await env.DB.prepare(
        'INSERT OR IGNORE INTO user_progress (user_id) VALUES (?)'
      ).bind(user.id).run();
    }

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(sessionId, user.id, expiresAt).run();

    return json({
      success: true,
      user: toUserFormat(user.id, user.email, user.name, user.avatar_url, progress)
    }, origin, env, 200, {
      'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${30 * 24 * 60 * 60}`,
    });
  }

  // POST /auth/reset-password — SECURED: requires active session
  if (path === '/auth/reset-password' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Authentication required', origin, env, 401);
    }

    const body = await request.json() as { currentPassword?: string; newPassword?: string };
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return error('Current password and new password are required', origin, env, 400);
    }

    if (newPassword.length < 6) {
      return error('Password must be at least 6 characters', origin, env, 400);
    }

    // Verify current password first
    const user = await env.DB.prepare(
      'SELECT password_hash FROM users WHERE id = ?'
    ).bind(userId).first<{ password_hash: string | null }>();

    if (!user || !user.password_hash) {
      return error('User not found', origin, env, 404);
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return error('Current password is incorrect', origin, env, 401);
    }

    const passwordHash = await hashPassword(newPassword);
    await env.DB.prepare(
      'UPDATE users SET password_hash = ? WHERE id = ?'
    ).bind(passwordHash, userId).run();

    return json({ success: true, message: 'Password updated successfully' }, origin, env);
  }

  return null; // Not an auth route
}
