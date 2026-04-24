/**
 * Lightweight in-process sliding-window rate limiter.
 *
 * Works within a single serverless cold-start. On Vercel, each function
 * instance is isolated, so this provides good protection against bots
 * hitting the same instance but will not catch attacks spread across many
 * concurrent instances. For distributed rate-limiting, replace this with
 * @upstash/ratelimit backed by Upstash Redis.
 *
 * Usage:
 *   const allowed = rateLimit(`validate-link:${ip}`, 10, 60); // 10 req/min
 *   if (!allowed) return 429;
 */

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

// Prune expired entries every 5 minutes to avoid unbounded memory growth.
setInterval(() => {
  const now = Date.now();
  store.forEach((win, key) => {
    if (now > win.resetAt) store.delete(key);
  });
}, 5 * 60 * 1000);

/**
 * Returns true if the request is within the limit, false if it should be blocked.
 *
 * @param key           Unique string identifying the (action, identity) pair,
 *                      e.g. `"login:192.168.1.1"` or `"forgot-password:user@x.com"`
 * @param limit         Maximum number of allowed requests per window
 * @param windowSeconds Length of the sliding window in seconds
 */
export function rateLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}
