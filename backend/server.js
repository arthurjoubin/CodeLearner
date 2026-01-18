import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = 3001;

const DEEPSEEK_API_KEY = 'sk-b6751eb312a8410e9794cd5abae2b2c0';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

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

async function callDeepSeek(messages, maxTokens = 500) {
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
      temperature: 0.7,
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
    'Access-Control-Allow-Origin': '*',
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
