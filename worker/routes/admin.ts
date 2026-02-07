import type { Env } from '../types';
import { json, error, isAdmin } from '../utils';

export async function handleAdmin(path: string, method: string, request: Request, origin: string | null, env: Env): Promise<Response | null> {

  // All admin routes require admin auth
  if (!path.startsWith('/api/admin/')) return null;

  const authorized = await isAdmin(request, env);
  if (!authorized) {
    return error('Admin access required', origin, env, 403);
  }

  // POST /api/admin/cleanup-guests
  if (path === '/api/admin/cleanup-guests' && method === 'POST') {
    const result = await env.DB.prepare(
      "DELETE FROM users WHERE name = 'Learner' AND avatar_url IS NULL"
    ).run();

    return json({ success: true, message: 'Guest users removed', deleted: result.meta.changes }, origin, env);
  }

  // POST /api/admin/cleanup-sessions — remove expired sessions
  if (path === '/api/admin/cleanup-sessions' && method === 'POST') {
    const result = await env.DB.prepare(
      "DELETE FROM sessions WHERE expires_at < datetime('now')"
    ).run();

    return json({ success: true, message: 'Expired sessions cleaned', deleted: result.meta.changes }, origin, env);
  }

  // GET /api/admin/export — export all data as JSON (for backups)
  if (path === '/api/admin/export' && method === 'GET') {
    const users = await env.DB.prepare(
      'SELECT id, email, name, avatar_url, is_admin, created_at FROM users'
    ).all();

    const progress = await env.DB.prepare(
      'SELECT * FROM user_progress'
    ).all();

    const sessions = await env.DB.prepare(
      'SELECT id, user_id, expires_at, created_at FROM sessions'
    ).all();

    const exportData = {
      exported_at: new Date().toISOString(),
      users: users.results,
      user_progress: progress.results,
      active_sessions: sessions.results.length,
    };

    return json(exportData, origin, env);
  }

  // GET /api/admin/stats — basic dashboard stats
  if (path === '/api/admin/stats' && method === 'GET') {
    const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();
    const activeSessions = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM sessions WHERE expires_at > datetime('now')"
    ).first<{ count: number }>();
    const totalXp = await env.DB.prepare('SELECT SUM(xp) as total FROM user_progress').first<{ total: number }>();

    return json({
      total_users: totalUsers?.count || 0,
      active_sessions: activeSessions?.count || 0,
      total_xp_awarded: totalXp?.total || 0,
    }, origin, env);
  }

  return error('Admin endpoint not found', origin, env, 404);
}
