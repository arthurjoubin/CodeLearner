import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = 3001;

const DEEPSEEK_API_KEY = 'sk-b6751eb312a8410e9794cd5abae2b2c0';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// In-memory cache for daily challenges (dev mode)
const dailyCache = new Map();
const SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript', 'rust', 'go'];

// User rate limiting (simple in-memory)
const userRequestCounts = new Map();
const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW = 60 * 1000;

function isRateLimited(userId) {
  const now = Date.now();
  const userData = userRequestCounts.get(userId);
  
  if (!userData || now - userData.resetTime > AI_RATE_WINDOW) {
    userRequestCounts.set(userId, { count: 1, resetTime: now });
    return false;
  }
  
  if (userData.count >= AI_RATE_LIMIT) {
    return true;
  }
  
  userData.count++;
  return false;
}

function buildExercisePrompt(language, difficulty) {
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

async function generateExerciseWithAI(language, difficulty) {
  const prompt = buildExercisePrompt(language, difficulty);

  const response = await callDeepSeek([
    { role: 'system', content: prompt },
    { role: 'user', content: 'Generate a coding exercise.' },
  ], 1200);

  // Parse JSON from response
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Continue to fallback
  }

  // Fallback: try to parse the whole response
  try {
    return JSON.parse(response);
  } catch {
    throw new Error('Failed to parse exercise from AI response');
  }
}

function processGeneratedExercise(data, id, language, difficulty) {
  const xpReward = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 75 : 100;

  return {
    id,
    type: 'language',
    language,
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    difficulty,
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

function getDailyRotation(dateStr) {
  const baseDate = new Date('2024-01-01');
  const currentDate = new Date(dateStr);
  const dayIndex = Math.floor(
    (currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const language = SUPPORTED_LANGUAGES[dayIndex % SUPPORTED_LANGUAGES.length];
  const difficulty = ['easy', 'medium', 'hard'][dayIndex % 3];

  return { language, difficulty };
}

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ user: null }, null, 2));
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function callDeepSeek(messages, maxTokens = 500, temperature = 0.7) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4321',
    'Access-Control-Allow-Credentials': 'true',
  });
  res.end(JSON.stringify(data));
}

function sendError(res, message, status = 500) {
  sendJSON(res, { error: message }, status);
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:4321',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  try {
    // GET /api/user
    if (pathname === '/api/user' && req.method === 'GET') {
      const data = readData();
      if (!data.user) {
        return sendError(res, 'User not found', 404);
      }
      return sendJSON(res, data.user);
    }

    // POST /api/user
    if (pathname === '/api/user' && req.method === 'POST') {
      const user = await parseBody(req);
      const data = readData();
      data.user = user;
      writeData(data);
      return sendJSON(res, { success: true });
    }

    // POST /api/validate - Validate exercise code
    if (pathname === '/api/validate' && req.method === 'POST') {
      const { code, exercise } = await parseBody(req);

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

      const response = await callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Student's code:\n\`\`\`jsx\n${code}\n\`\`\`` },
      ]);

      try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return sendJSON(res, result);
        }
      } catch {
        // Fallback if JSON parsing fails
      }

      return sendJSON(res, {
        isCorrect: false,
        feedback: 'Could not validate. Please try again.',
        hints: [],
      });
    }

    // POST /api/chat - Chat with AI tutor
    if (pathname === '/api/chat' && req.method === 'POST') {
      const { messages, context } = await parseBody(req);

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

      const response = await callDeepSeek(apiMessages, 400);
      return sendJSON(res, { response });
    }

    // POST /api/hint - Get hint for exercise
    if (pathname === '/api/hint' && req.method === 'POST') {
      const { code, exercise, attemptCount } = await parseBody(req);

      const hintLevel = Math.min(attemptCount, exercise.hints.length);
      const providedHints = exercise.hints.slice(0, hintLevel);

      const systemPrompt = `You are helping a student with a React exercise. Give ONE short, helpful hint.

Exercise: ${exercise.instructions}
Previous hints given: ${providedHints.join(', ') || 'none'}
Attempt number: ${attemptCount}

Be more specific with each attempt. Don't give the answer directly.`;

      const response = await callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `My current code:\n${code}\n\nI need a hint!` },
      ], 150);

      return sendJSON(res, { hint: response });
    }

    // POST /api/execute - Execute code via Piston API
    if (pathname === '/api/execute' && req.method === 'POST') {
      const { code, language } = await parseBody(req);

      // Language mapping from our IDs to Piston runtime names
      const languageMapping = {
        python: { language: 'python', version: '3.10.0' },
        javascript: { language: 'javascript', version: '18.15.0' },
        typescript: { language: 'typescript', version: '5.0.3' },
        rust: { language: 'rust', version: '1.68.2' },
        go: { language: 'go', version: '1.20.2' },
      };

      const runtime = languageMapping[language];
      if (!runtime) {
        return sendError(res, `Language "${language}" is not supported`, 400);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [
              {
                content: code,
              },
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Piston API error: ${err}`);
        }

        const data = await response.json();

        return sendJSON(res, {
          stdout: data.run.stdout,
          stderr: data.run.stderr,
          exitCode: data.run.code,
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          return sendError(res, 'Code execution timed out (10s limit)', 504);
        }
        console.error('Execute error:', err);
        return sendError(res, err.message || 'Failed to execute code', 500);
      }
    }

    // POST /api/codecraft/generate - Generate practice exercise
    if (pathname === '/api/codecraft/generate' && req.method === 'POST') {
      // NOTE: En dev local, on contourne l'authentification pour faciliter les tests
      // En production, l'authentification est gérée par le Worker Cloudflare

      const { language, difficulty } = await parseBody(req);

      if (!SUPPORTED_LANGUAGES.includes(language)) {
        return sendError(res, `Unsupported language: ${language}`, 400);
      }

      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return sendError(res, `Invalid difficulty: ${difficulty}`, 400);
      }

      try {
        const exerciseData = await generateExerciseWithAI(language, difficulty);
        const exercise = processGeneratedExercise(
          exerciseData,
          `practice-${language}-${Date.now()}`,
          language,
          difficulty
        );

        return sendJSON(res, { exercise });
      } catch (err) {
        console.error('Failed to generate exercise:', err);
        return sendError(res, 'Failed to generate exercise', 500);
      }
    }

    // GET /api/codecraft/daily - Get daily challenge
    if (pathname === '/api/codecraft/daily' && req.method === 'GET') {
      // NOTE: En dev local, on contourne l'authentification pour faciliter les tests
      // En production, l'authentification est gérée par le Worker Cloudflare
      
      const dateStr = new Date().toISOString().split('T')[0];

      // Check cache
      const cached = dailyCache.get(dateStr);
      if (cached) {
        return sendJSON(res, { date: dateStr, exercise: cached });
      }

      // Generate new daily challenge
      const { language, difficulty } = getDailyRotation(dateStr);

      try {
        const exerciseData = await generateExerciseWithAI(language, difficulty);
        const exercise = processGeneratedExercise(exerciseData, `daily-${dateStr}`, language, difficulty);

        // Cache it
        dailyCache.set(dateStr, exercise);

        return sendJSON(res, { date: dateStr, exercise });
      } catch (err) {
        console.error('Failed to generate daily challenge:', err);
        return sendError(res, 'Failed to generate daily challenge', 500);
      }
    }

    // 404 for unknown routes
    sendError(res, 'Not found', 404);
  } catch (error) {
    console.error('Server error:', error);
    sendError(res, error.message || 'Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
