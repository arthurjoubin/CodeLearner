interface Env {
  DB: D1Database;
  DEEPSEEK_API_KEY: string;
  FRONTEND_URL: string;
}

interface UserProgress {
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  completed_lessons: string;
  completed_exercises: string;
  module_progress: string;
  lab_progress: string;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// CORS headers - allow both prod and localhost
function getCorsHeaders(origin: string | null, env: Env) {
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:4321'];
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : env.FRONTEND_URL;
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function json(data: unknown, origin: string | null, env: Env, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin, env), ...headers },
  });
}

function error(message: string, origin: string | null, env: Env, status = 500) {
  return json({ error: message }, origin, env, status);
}

// Generate a random session ID
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Get session from cookie
function getSessionFromCookie(request: Request): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
}

// Hash password using bcrypt-like approach with Web Crypto
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordData = encoder.encode(password);
  
  // Combine salt + password
  const combined = new Uint8Array(salt.length + passwordData.length);
  combined.set(salt);
  combined.set(passwordData, salt.length);
  
  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return salt:hash format
  return `${saltHex}:${hashHex}`;
}

// Verify password against hash
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, hashHex] = hash.split(':');
  if (!saltHex || !hashHex) return false;
  
  const encoder = new TextEncoder();
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const passwordData = encoder.encode(password);
  
  // Combine salt + password
  const combined = new Uint8Array(salt.length + passwordData.length);
  combined.set(salt);
  combined.set(passwordData, salt.length);
  
  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return computedHashHex === hashHex;
}

async function callDeepSeek(apiKey: string, messages: Array<{ role: string; content: string }>, maxTokens = 500) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${err}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content;
}

// Convert DB row to frontend User format
function toUserFormat(userId: string, email: string, name: string, avatarUrl: string | null, progress: UserProgress | null) {
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin, env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ==================== AUTH ROUTES ====================

      // GET /auth/me - Get current user from session
      if (path === '/auth/me' && request.method === 'GET') {
        const sessionId = getSessionFromCookie(request);
        if (!sessionId) {
          return json({ user: null }, origin, env);
        }

        // Get session and user
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

      // POST /auth/logout - Clear session
      if (path === '/auth/logout' && request.method === 'POST') {
        const sessionId = getSessionFromCookie(request);
        if (sessionId) {
          await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
        }

        return json({ success: true }, origin, env, 200, {
          'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0',
        });
      }

      // POST /auth/register - Register with email/password
      if (path === '/auth/register' && request.method === 'POST') {
        const body = await request.json() as { email?: string; password?: string; name?: string };
        const { email, password, name } = body;

        if (!email || !password || !name) {
          return error('Email, password and name are required', origin, env, 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return error('Invalid email format', origin, env, 400);
        }

        // Validate password length
        if (password.length < 6) {
          return error('Password must be at least 6 characters', origin, env, 400);
        }

        // Check if email already exists
        const existingUser = await env.DB.prepare(
          'SELECT id FROM users WHERE email = ?'
        ).bind(email).first<{ id: string }>();

        if (existingUser) {
          return error('Email already registered', origin, env, 409);
        }

        // Hash password
        const passwordHash = await hashPassword(password);
        const userId = `local_${crypto.randomUUID()}`;

        // Create user
        await env.DB.prepare(
          'INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)'
        ).bind(userId, email, name, passwordHash).run();

        // Create user_progress
        await env.DB.prepare(
          'INSERT OR IGNORE INTO user_progress (user_id) VALUES (?)'
        ).bind(userId).run();

        // Create session
        const sessionId = generateSessionId();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await env.DB.prepare(
          'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
        ).bind(sessionId, userId, expiresAt).run();

        return json({ success: true, user: { id: userId, email, name } }, origin, env, 201, {
          'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${30 * 24 * 60 * 60}`,
        });
      }

      // POST /auth/login - Login with email/password
      if (path === '/auth/login' && request.method === 'POST') {
        const body = await request.json() as { email?: string; password?: string };
        const { email, password } = body;

        if (!email || !password) {
          return error('Email and password are required', origin, env, 400);
        }

        // Get user by email
        const user = await env.DB.prepare(
          'SELECT id, email, name, avatar_url, password_hash FROM users WHERE email = ?'
        ).bind(email).first<{ id: string; email: string; name: string; avatar_url: string | null; password_hash: string | null }>();

        if (!user || !user.password_hash) {
          return error('Invalid email or password', origin, env, 401);
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) {
          return error('Invalid email or password', origin, env, 401);
        }

        // Get or create user progress
        const progress = await env.DB.prepare(
          'SELECT * FROM user_progress WHERE user_id = ?'
        ).bind(user.id).first<UserProgress>();

        if (!progress) {
          await env.DB.prepare(
            'INSERT OR IGNORE INTO user_progress (user_id) VALUES (?)'
          ).bind(user.id).run();
        }

        // Create session
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

      // POST /auth/reset-password - Reset password (requires session/auth)
      if (path === '/auth/reset-password' && request.method === 'POST') {
        const body = await request.json() as { email?: string; newPassword?: string };
        const { email, newPassword } = body;

        if (!email || !newPassword) {
          return error('Email and new password are required', origin, env, 400);
        }

        if (newPassword.length < 6) {
          return error('Password must be at least 6 characters', origin, env, 400);
        }

        // Check if user exists
        const user = await env.DB.prepare(
          'SELECT id FROM users WHERE email = ?'
        ).bind(email).first<{ id: string }>();

        if (!user) {
          return error('User not found', origin, env, 404);
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update password
        await env.DB.prepare(
          'UPDATE users SET password_hash = ? WHERE id = ?'
        ).bind(passwordHash, user.id).run();

        return json({ success: true, message: 'Password reset successfully' }, origin, env);
      }

      // ==================== API ROUTES ====================

      // GET /api/user/:id
      if (path.match(/^\/api\/user\/[\w-]+$/) && request.method === 'GET') {
        const userId = path.split('/').pop()!;

        const user = await env.DB.prepare(
          'SELECT u.id, u.email, u.name, u.avatar_url, p.* FROM users u LEFT JOIN user_progress p ON u.id = p.user_id WHERE u.id = ?'
        ).bind(userId).first<{ id: string; email: string; name: string; avatar_url: string } & UserProgress>();

        if (!user) {
          return error('User not found', origin, env, 404);
        }

        return json(toUserFormat(user.id, user.email, user.name, user.avatar_url, user), origin, env);
      }

      // POST /api/user - Create or update user (requires auth)
      if (path === '/api/user' && request.method === 'POST') {
        const sessionId = getSessionFromCookie(request);
        if (!sessionId) {
          return error('Unauthorized', origin, env, 401);
        }

        // Verify session
        const session = await env.DB.prepare(
          "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')"
        ).bind(sessionId).first<{ user_id: string }>();

        if (!session) {
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

        // Update progress
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
          session.user_id
        ).run();

        return json({ success: true }, origin, env);
      }

      // POST /api/validate - Validate exercise code (requires auth)
      if (path === '/api/validate' && request.method === 'POST') {
        const sessionId = getSessionFromCookie(request);
        if (!sessionId) {
          return error('Connecte-toi pour valider tes exercices', origin, env, 401);
        }

        const session = await env.DB.prepare(
          "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')"
        ).bind(sessionId).first();

        if (!session) {
          return error('Connecte-toi pour valider tes exercices', origin, env, 401);
        }

        const { code, exercise } = await request.json() as { code: string; exercise: { instructions: string; validationPrompt: string } };

        const systemPrompt = `You are a React/TypeScript code validator for a learning app. Your job is to check if the student's code correctly solves the exercise.

Exercise instructions: ${exercise.instructions}
Validation criteria: ${exercise.validationPrompt}

Respond in JSON format only:
{
  "isCorrect": boolean,
  "feedback": "Brief, encouraging feedback (1-2 sentences)",
  "hints": ["optional hint if wrong"]
}

Be encouraging but accurate. If mostly correct with minor issues, still mark as correct but mention improvements.`;

        const response = await callDeepSeek(env.DEEPSEEK_API_KEY, [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Student's code:\n\`\`\`jsx\n${code}\n\`\`\`` },
        ]);

        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return json(result, origin, env);
          }
        } catch {
          // Fallback
        }

        return json({
          isCorrect: false,
          feedback: 'Could not validate. Please try again.',
          hints: [],
        }, origin, env);
      }

      // POST /api/chat - Chat with AI tutor
      if (path === '/api/chat' && request.method === 'POST') {
        const { messages, context } = await request.json() as {
          messages: Array<{ role: string; content: string }>;
          context: { topic: string; lessonContent?: string };
        };

        const systemPrompt = `You are a friendly React & TypeScript tutor helping a beginner learn. Current topic: ${context.topic}.

${context.lessonContent ? `Current lesson content:\n${context.lessonContent}\n` : ''}

Guidelines:
- Keep responses concise (2-4 sentences usually)
- Use simple language, avoid jargon
- Give practical examples when helpful
- Be encouraging and supportive
- If asked something off-topic, gently redirect to React/TypeScript`;

        const apiMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ];

        const response = await callDeepSeek(env.DEEPSEEK_API_KEY, apiMessages, 400);
        return json({ response }, origin, env);
      }

      // POST /api/hint - Get hint for exercise
      if (path === '/api/hint' && request.method === 'POST') {
        const { code, exercise, attemptCount } = await request.json() as {
          code: string;
          exercise: { instructions: string; hints: string[] };
          attemptCount: number;
        };

        const hintLevel = Math.min(attemptCount, exercise.hints.length);
        const providedHints = exercise.hints.slice(0, hintLevel);

        const systemPrompt = `You are helping a student with a React exercise. Give ONE short, helpful hint.

Exercise: ${exercise.instructions}
Previous hints given: ${providedHints.join(', ') || 'none'}
Attempt number: ${attemptCount}

Be more specific with each attempt. Don't give the answer directly.`;

        const response = await callDeepSeek(env.DEEPSEEK_API_KEY, [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `My current code:\n${code}\n\nI need a hint!` },
        ], 150);

        return json({ hint: response }, origin, env);
      }

      // GET /api/leaderboard - Get top users by XP (exclude guests)
      if (path === '/api/leaderboard' && request.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        const result = await env.DB.prepare(`
          SELECT u.id, u.name, u.avatar_url, p.xp, p.level, p.streak
          FROM users u
          LEFT JOIN user_progress p ON u.id = p.user_id
          WHERE u.name != 'Learner' OR u.avatar_url IS NOT NULL
          ORDER BY p.xp DESC, u.name ASC
          LIMIT ${limit} OFFSET ${offset}
        `).all();

        const users = result.results as Array<{ id: string; name: string; avatar_url: string | null; xp: number; level: number; streak: number }>;
        const total = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();

        return json({ users, total: total?.count || 0 }, origin, env);
      }

      // POST /api/admin/cleanup-guests - Remove guest users (for admin use)
      if (path === '/api/admin/cleanup-guests' && request.method === 'POST') {
        await env.DB.prepare(
          "DELETE FROM users WHERE name = 'Learner' AND avatar_url IS NULL"
        ).run();
        return json({ success: true, message: 'Guest users removed' }, origin, env);
      }

      return error('Not found', origin, env, 404);
    } catch (err) {
      console.error('Worker error:', err);
      return error(err instanceof Error ? err.message : 'Internal server error', origin, env);
    }
  },
};
