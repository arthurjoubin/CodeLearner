import type { Env } from '../types';
import type { LanguageExercise } from '../../src/types';
import { json, error, getAuthenticatedUserId } from '../utils';
import { isRateLimited } from '../rate-limit';
import { callDeepSeek } from '../deepseek';

// Rate limit: 20 AI requests per user per minute (shared with other AI endpoints)
const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW = 60 * 1000;

const SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript', 'rust', 'go'];

interface GeneratedExerciseData {
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  validationPrompt: string;
  hints: string[];
}

function buildExercisePrompt(language: string, difficulty: string): string {
  return `You are an expert programming instructor. Generate a coding exercise for a student learning ${language}.

Difficulty: ${difficulty}
- easy: Basic syntax, simple operations, single concept
- medium: Combine 2-3 concepts, moderate logic
- hard: Algorithm design, data structures, complex problem-solving

Respond with ONLY a JSON object (no markdown, no code fences):
{
  "title": "Short title (3-6 words)",
  "description": "One sentence describing the task",
  "instructions": "Clear instructions (2-4 sentences). Specify expected output precisely.",
  "starterCode": "Minimal starter with guiding comments",
  "solution": "Complete working solution",
  "expectedOutput": "Exact expected stdout",
  "validationPrompt": "Specific criteria to validate the student's code",
  "hints": ["Gentle first hint", "More specific hint", "Almost gives the answer"]
}

Rules:
- Self-contained: no imports, no file I/O, no user input, no external libraries
- Must produce output via print/console.log/println/fmt.Println
- Completable in 5-15 minutes
- The solution MUST produce exactly the expectedOutput`;
}

function processGeneratedExercise(
  data: GeneratedExerciseData,
  id: string,
  language: string,
  difficulty: string
): LanguageExercise {
  const xpReward = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 75 : 100;

  return {
    id,
    type: 'language',
    language,
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    difficulty: difficulty as 'easy' | 'medium' | 'hard',
    order: 0,
    starterCode: data.starterCode,
    solution: data.solution,
    expectedOutput: data.expectedOutput,
    validationPrompt: data.validationPrompt,
    hints: data.hints,
    xpReward,
    lessonId: '',
    moduleId: '',
  };
}

async function generateExerciseWithAI(
  apiKey: string,
  language: string,
  difficulty: string
): Promise<GeneratedExerciseData> {
  const prompt = buildExercisePrompt(language, difficulty);

  const response = await callDeepSeek(
    apiKey,
    [
      { role: 'system', content: prompt },
      { role: 'user', content: 'Generate a coding exercise.' },
    ],
    1200,
    0.9
  );

  // Parse JSON from response
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GeneratedExerciseData;
    }
  } catch {
    // Continue to fallback
  }

  // Fallback: try to parse the whole response
  try {
    return JSON.parse(response) as GeneratedExerciseData;
  } catch {
    throw new Error('Failed to parse exercise from AI response');
  }
}

function getDailyRotation(dateStr: string): { language: string; difficulty: string } {
  // Calculate days since 2024-01-01
  const baseDate = new Date('2024-01-01');
  const currentDate = new Date(dateStr);
  const dayIndex = Math.floor(
    (currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const language = SUPPORTED_LANGUAGES[dayIndex % SUPPORTED_LANGUAGES.length];
  const difficulty = ['easy', 'medium', 'hard'][dayIndex % 3];

  return { language, difficulty };
}

export async function handleCodecraft(
  path: string,
  method: string,
  request: Request,
  origin: string | null,
  env: Env
): Promise<Response | null> {
  // POST /api/codecraft/generate — Generate practice exercise
  if (path === '/api/codecraft/generate' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Connecte-toi pour générer des exercices', origin, env, 401);
    }

    if (isRateLimited(`ai:${userId}`, AI_RATE_LIMIT, AI_RATE_WINDOW)) {
      return error('Trop de requêtes. Attends un peu avant de réessayer.', origin, env, 429);
    }

    const { language, difficulty } = await request.json() as {
      language: string;
      difficulty: 'easy' | 'medium' | 'hard';
    };

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return error(`Langage non supporté: ${language}`, origin, env, 400);
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return error(`Difficulté invalide: ${difficulty}`, origin, env, 400);
    }

    try {
      const data = await generateExerciseWithAI(env.DEEPSEEK_API_KEY, language, difficulty);
      const exercise = processGeneratedExercise(
        data,
        `practice-${language}-${Date.now()}`,
        language,
        difficulty
      );

      return json({ exercise }, origin, env);
    } catch (err) {
      console.error('Failed to generate exercise:', err);
      return error('Échec de la génération de l\'exercice', origin, env, 500);
    }
  }

  // GET /api/codecraft/daily — Get daily challenge
  if (path === '/api/codecraft/daily' && method === 'GET') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Connecte-toi pour accéder au défi quotidien', origin, env, 401);
    }

    const dateStr = new Date().toISOString().split('T')[0];

    // Check if we have a cached daily challenge
    try {
      const cached = await env.DB.prepare(
        'SELECT exercise_json FROM daily_challenges WHERE date = ?'
      )
        .bind(dateStr)
        .first();

      if (cached) {
        const exercise = JSON.parse(cached.exercise_json as string) as LanguageExercise;
        return json({ date: dateStr, exercise }, origin, env);
      }
    } catch (err) {
      console.error('Failed to fetch cached daily challenge:', err);
      // Continue to generate new one
    }

    // Generate new daily challenge
    const { language, difficulty } = getDailyRotation(dateStr);

    try {
      const data = await generateExerciseWithAI(env.DEEPSEEK_API_KEY, language, difficulty);
      const exercise = processGeneratedExercise(data, `daily-${dateStr}`, language, difficulty);

      // Cache in database
      try {
        await env.DB.prepare(
          'INSERT INTO daily_challenges (date, language, difficulty, exercise_json) VALUES (?, ?, ?, ?)'
        )
          .bind(dateStr, language, difficulty, JSON.stringify(exercise))
          .run();
      } catch (err) {
        console.error('Failed to cache daily challenge:', err);
        // Continue even if caching fails
      }

      return json({ date: dateStr, exercise }, origin, env);
    } catch (err) {
      console.error('Failed to generate daily challenge:', err);
      return error('Échec de la génération du défi quotidien', origin, env, 500);
    }
  }

  return null;
}
