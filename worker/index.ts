import type { Env } from './types';
import { getCorsHeaders, error } from './utils';
import { handleAuth } from './routes/auth';
import { handleApi } from './routes/api';
import { handleAi } from './routes/ai';
import { handleAdmin } from './routes/admin';
import { handleExecute } from './routes/execute';
import { handleCodecraft } from './routes/codecraft';

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
    const method = request.method;

    try {
      // Route to handlers — first match wins
      const response =
        await handleAuth(path, method, request, origin, env) ??
        await handleAdmin(path, method, request, origin, env) ??
        await handleCodecraft(path, method, request, origin, env) ??
        await handleExecute(path, method, request, origin, env) ??
        await handleAi(path, method, request, origin, env) ??
        await handleApi(path, method, request, url, origin, env);

      if (response) return response;

      return error('Not found', origin, env, 404);
    } catch (err) {
      console.error('Worker error:', err);
      return error(err instanceof Error ? err.message : 'Internal server error', origin, env);
    }
  },
};
