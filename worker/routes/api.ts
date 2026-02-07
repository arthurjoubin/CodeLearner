import type { Env, UserProgress } from '../types';
import { json, error, getAuthenticatedUserId, toUserFormat } from '../utils';

export async function handleApi(path: string, method: string, request: Request, url: URL, origin: string | null, env: Env): Promise<Response | null> {

  // GET /api/user/:id
  if (path.match(/^\/api\/user\/[\w-]+$/) && method === 'GET') {
    const userId = path.split('/').pop()!;

    const user = await env.DB.prepare(
      'SELECT u.id, u.email, u.name, u.avatar_url, p.* FROM users u LEFT JOIN user_progress p ON u.id = p.user_id WHERE u.id = ?'
    ).bind(userId).first<{ id: string; email: string; name: string; avatar_url: string } & UserProgress>();

    if (!user) {
      return error('User not found', origin, env, 404);
    }

    return json(toUserFormat(user.id, user.email, user.name, user.avatar_url, user), origin, env);
  }

  // POST /api/user — update user progress (requires auth)
  if (path === '/api/user' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Unauthorized', origin, env, 401);
    }

    const body = await request.json() as {
      name?: string;
      xp?: number;
      level?: number;
      streak?: number;
      lastActiveDate?: string;
      completedLessons?: string[];
      completedExercises?: string[];
      moduleProgress?: Record<string, number>;
      labProgress?: Record<string, unknown>;
    };

    await env.DB.prepare(`
      UPDATE user_progress SET
        xp = ?,
        level = ?,
        streak = ?,
        last_active_date = ?,
        completed_lessons = ?,
        completed_exercises = ?,
        module_progress = ?,
        lab_progress = ?
      WHERE user_id = ?
    `).bind(
      body.xp ?? 0,
      body.level ?? 1,
      body.streak ?? 0,
      body.lastActiveDate ?? null,
      JSON.stringify(body.completedLessons ?? []),
      JSON.stringify(body.completedExercises ?? []),
      JSON.stringify(body.moduleProgress ?? {}),
      JSON.stringify(body.labProgress ?? {}),
      userId
    ).run();

    return json({ success: true }, origin, env);
  }

  // GET /api/leaderboard — FIXED: parameterized query
  if (path === '/api/leaderboard' && method === 'GET') {
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '10') || 10, 1), 100);
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0') || 0, 0);

    const result = await env.DB.prepare(`
      SELECT u.id, u.name, u.avatar_url, p.xp, p.level, p.streak
      FROM users u
      LEFT JOIN user_progress p ON u.id = p.user_id
      WHERE u.name != 'Learner' OR u.avatar_url IS NOT NULL
      ORDER BY p.xp DESC, u.name ASC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    const users = result.results as Array<{ id: string; name: string; avatar_url: string | null; xp: number; level: number; streak: number }>;
    const total = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();

    return json({ users, total: total?.count || 0 }, origin, env);
  }

  return null;
}
