import "server-only";

/* Fixed-window in-memory rate limiter — per-instance substitute until a
   shared store exists (Supabase at HOY-040+). 5 submissions per 10 minutes
   per client hash. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, { windowStart: number; count: number }>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(key, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (now - v.windowStart > WINDOW_MS) hits.delete(k);
  }
  return entry.count > MAX_PER_WINDOW;
}
