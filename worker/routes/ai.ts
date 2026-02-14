import type { Env } from '../types';
import { json, error, getAuthenticatedUserId } from '../utils';
import { isRateLimited } from '../rate-limit';
import { callDeepSeek } from '../deepseek';

// Rate limit: 20 AI requests per user per minute
const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW = 60 * 1000;

export async function handleAi(path: string, method: string, request: Request, origin: string | null, env: Env): Promise<Response | null> {

  // POST /api/validate — requires auth + rate limited
  if (path === '/api/validate' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Connecte-toi pour valider tes exercices', origin, env, 401);
    }

    if (isRateLimited(`ai:${userId}`, AI_RATE_LIMIT, AI_RATE_WINDOW)) {
      return error('Trop de requêtes. Attends un peu avant de réessayer.', origin, env, 429);
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

  // POST /api/chat — SECURED: requires auth + rate limited
  if (path === '/api/chat' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Connecte-toi pour utiliser le chat', origin, env, 401);
    }

    if (isRateLimited(`ai:${userId}`, AI_RATE_LIMIT, AI_RATE_WINDOW)) {
      return error('Trop de requêtes. Attends un peu avant de réessayer.', origin, env, 429);
    }

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

  // POST /api/hint — SECURED: requires auth + rate limited
  if (path === '/api/hint' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Connecte-toi pour obtenir des indices', origin, env, 401);
    }

    if (isRateLimited(`ai:${userId}`, AI_RATE_LIMIT, AI_RATE_WINDOW)) {
      return error('Trop de requêtes. Attends un peu avant de réessayer.', origin, env, 429);
    }

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

  return null;
}
