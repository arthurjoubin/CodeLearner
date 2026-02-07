// Simple in-memory rate limiter for Cloudflare Workers
// Note: This is per-isolate, not global. For stricter limits, use Cloudflare Rate Limiting rules.
// This is sufficient to prevent accidental spam from a single user within one worker instance.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request is rate limited.
 * @param key - Unique key (e.g. userId or IP)
 * @param maxRequests - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the request should be blocked
 */
export function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  // Clean up every 100 checks
  if (store.size > 100) cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return true;
  }

  return false;
}
