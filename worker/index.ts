interface Env {
  DB: D1Database;
  DEEPSEEK_API_KEY: string;
}

interface UserProgress {
  user_id: string;
  xp: number;
  level: number;
  hearts: number;
  max_hearts: number;
  streak: number;
  last_active_date: string | null;
  completed_lessons: string;
  completed_exercises: string;
  module_progress: string;
  lab_progress: string;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function error(message: string, status = 500) {
  return json({ error: message }, status);
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
function toUserFormat(userId: string, email: string, name: string, progress: UserProgress | null) {
  if (!progress) {
    return {
      id: userId,
      email,
      name,
      xp: 0,
      level: 1,
      hearts: 5,
      maxHearts: 5,
      streak: 0,
      lastActiveDate: null,
      completedLessons: [],
      completedExercises: [],
      moduleProgress: {},
      labProgress: {},
    };
  }

  return {
    id: userId,
    email,
    name,
    xp: progress.xp,
    level: progress.level,
    hearts: progress.hearts,
    maxHearts: progress.max_hearts,
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
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/user/:id
      if (path.match(/^\/api\/user\/[\w-]+$/) && request.method === 'GET') {
        const userId = path.split('/').pop()!;

        const user = await env.DB.prepare(
          'SELECT u.id, u.email, u.name, p.* FROM users u LEFT JOIN user_progress p ON u.id = p.user_id WHERE u.id = ?'
        ).bind(userId).first<{ id: string; email: string; name: string } & UserProgress>();

        if (!user) {
          return error('User not found', 404);
        }

        return json(toUserFormat(user.id, user.email, user.name, user));
      }

      // POST /api/user - Create or update user
      if (path === '/api/user' && request.method === 'POST') {
        const body = await request.json() as {
          id: string;
          email: string;
          name: string;
          xp?: number;
          level?: number;
          hearts?: number;
          maxHearts?: number;
          streak?: number;
          lastActiveDate?: string;
          completedLessons?: string[];
          completedExercises?: string[];
          moduleProgress?: Record<string, number>;
          labProgress?: Record<string, unknown>;
        };

        // Upsert user
        await env.DB.prepare(
          'INSERT INTO users (id, email, name) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name'
        ).bind(body.id, body.email, body.name).run();

        // Upsert progress
        await env.DB.prepare(`
          INSERT INTO user_progress (user_id, xp, level, hearts, max_hearts, streak, last_active_date, completed_lessons, completed_exercises, module_progress, lab_progress)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            xp = excluded.xp,
            level = excluded.level,
            hearts = excluded.hearts,
            max_hearts = excluded.max_hearts,
            streak = excluded.streak,
            last_active_date = excluded.last_active_date,
            completed_lessons = excluded.completed_lessons,
            completed_exercises = excluded.completed_exercises,
            module_progress = excluded.module_progress,
            lab_progress = excluded.lab_progress
        `).bind(
          body.id,
          body.xp ?? 0,
          body.level ?? 1,
          body.hearts ?? 5,
          body.maxHearts ?? 5,
          body.streak ?? 0,
          body.lastActiveDate ?? null,
          JSON.stringify(body.completedLessons ?? []),
          JSON.stringify(body.completedExercises ?? []),
          JSON.stringify(body.moduleProgress ?? {}),
          JSON.stringify(body.labProgress ?? {})
        ).run();

        return json({ success: true });
      }

      // POST /api/validate - Validate exercise code
      if (path === '/api/validate' && request.method === 'POST') {
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
            return json(result);
          }
        } catch {
          // Fallback
        }

        return json({
          isCorrect: false,
          feedback: 'Could not validate. Please try again.',
          hints: [],
        });
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
        return json({ response });
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

        return json({ hint: response });
      }

      return error('Not found', 404);
    } catch (err) {
      console.error('Worker error:', err);
      return error(err instanceof Error ? err.message : 'Internal server error');
    }
  },
};
