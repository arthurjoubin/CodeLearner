import type { Env } from '../types';
import { json, error, getAuthenticatedUserId } from '../utils';
import { isRateLimited } from '../rate-limit';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// Rate limit: 20 execute requests per user per minute
const EXECUTE_RATE_LIMIT = 20;
const EXECUTE_RATE_WINDOW = 60 * 1000;

// Language mapping from our IDs to Piston runtime names
const languageMapping: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  rust: { language: 'rust', version: '1.68.2' },
  go: { language: 'go', version: '1.20.2' },
};

export async function handleExecute(path: string, method: string, request: Request, origin: string | null, env: Env): Promise<Response | null> {
  // POST /api/execute — requires auth + rate limited
  if (path === '/api/execute' && method === 'POST') {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return error('Connecte-toi pour exécuter du code', origin, env, 401);
    }

    if (isRateLimited(`execute:${userId}`, EXECUTE_RATE_LIMIT, EXECUTE_RATE_WINDOW)) {
      return error('Trop de requêtes. Attends un peu avant de réessayer.', origin, env, 429);
    }

    const { code, language } = await request.json() as { code: string; language: string };

    const runtime = languageMapping[language];
    if (!runtime) {
      return error(`Language "${language}" is not supported`, origin, env, 400);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(PISTON_API_URL, {
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

      const data = await response.json() as {
        run: {
          stdout: string;
          stderr: string;
          code: number;
          output: string;
        };
      };

      return json({
        stdout: data.run.stdout,
        stderr: data.run.stderr,
        exitCode: data.run.code,
      }, origin, env);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return error('Code execution timed out (10s limit)', origin, env, 504);
      }
      console.error('Execute error:', err);
      return error('Failed to execute code', origin, env, 500);
    }
  }

  return null;
}
