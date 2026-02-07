import type { Env, UserProgress } from './types';

// CORS headers
export function getCorsHeaders(origin: string | null, env: Env) {
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:4321'];
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : env.FRONTEND_URL;
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function json(data: unknown, origin: string | null, env: Env, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin, env), ...headers },
  });
}

export function error(message: string, origin: string | null, env: Env, status = 500) {
  return json({ error: message }, origin, env, status);
}

export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function getSessionFromCookie(request: Request): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
}

// Get authenticated user_id from session cookie, or null
export async function getAuthenticatedUserId(request: Request, env: Env): Promise<string | null> {
  const sessionId = getSessionFromCookie(request);
  if (!sessionId) return null;

  const session = await env.DB.prepare(
    "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')"
  ).bind(sessionId).first<{ user_id: string }>();

  return session?.user_id ?? null;
}

// Check if the authenticated user is an admin
export async function isAdmin(request: Request, env: Env): Promise<boolean> {
  const userId = await getAuthenticatedUserId(request, env);
  if (!userId) return false;

  const user = await env.DB.prepare(
    'SELECT is_admin FROM users WHERE id = ?'
  ).bind(userId).first<{ is_admin: number }>();

  return user?.is_admin === 1;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordData = encoder.encode(password);

  const combined = new Uint8Array(salt.length + passwordData.length);
  combined.set(salt);
  combined.set(passwordData, salt.length);

  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, hashHex] = hash.split(':');
  if (!saltHex || !hashHex) return false;

  const encoder = new TextEncoder();
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const passwordData = encoder.encode(password);

  const combined = new Uint8Array(salt.length + passwordData.length);
  combined.set(salt);
  combined.set(passwordData, salt.length);

  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return computedHashHex === hashHex;
}

// Convert DB row to frontend User format
export function toUserFormat(userId: string, email: string, name: string, avatarUrl: string | null, progress: UserProgress | null) {
  const base = {
    id: userId,
    email,
    name,
    avatarUrl,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null as string | null,
    completedLessons: [] as string[],
    completedExercises: [] as string[],
    moduleProgress: {} as Record<string, number>,
    labProgress: {} as Record<string, unknown>,
  };

  if (!progress) return base;

  return {
    ...base,
    xp: progress.xp,
    level: progress.level,
    streak: progress.streak,
    lastActiveDate: progress.last_active_date,
    completedLessons: JSON.parse(progress.completed_lessons || '[]'),
    completedExercises: JSON.parse(progress.completed_exercises || '[]'),
    moduleProgress: JSON.parse(progress.module_progress || '{}'),
    labProgress: JSON.parse(progress.lab_progress || '{}'),
  };
}
