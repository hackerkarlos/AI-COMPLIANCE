import { LRUCache } from 'lru-cache';

const LIMIT = 5;
const WINDOW_MS = 60 * 1000; // 60 seconds

// Stores an array of request timestamps per user ID.
// max: max distinct users tracked before evicting oldest.
const cache = new LRUCache<string, number[]>({ max: 500 });

/**
 * Simple in-memory sliding-window rate limiter (per authenticated user).
 * Returns { allowed: false } when the user has exceeded LIMIT requests
 * within the last WINDOW_MS milliseconds.
 *
 * This is an in-process store — limits reset on server restart and are not
 * shared across multiple instances. Sufficient for Vercel Fluid Compute
 * single-instance deployments; replace with Redis for multi-region.
 */
export function checkRateLimit(userId: string): { allowed: boolean } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const prev = cache.get(userId) ?? [];
  const timestamps = prev.filter((t) => t > windowStart);

  if (timestamps.length >= LIMIT) {
    return { allowed: false };
  }

  cache.set(userId, [...timestamps, now]);
  return { allowed: true };
}
