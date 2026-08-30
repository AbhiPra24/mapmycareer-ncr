/**
 * Vercel KV Edge Caching & Rate Limiting Utility
 * Provides fast edge caching for DNS/MX lookups and rate limiting
 * with graceful memory fallback for local development / zero-config environments.
 */

import { kv } from '@vercel/kv';

export interface CachedMxRecord {
  resolves: boolean;
  mxRecords: string[];
  timestamp: number;
}

// In-memory fallback for local dev or when Vercel KV env vars are not set
const memoryCache = new Map<string, CachedMxRecord>();
const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();

const isKvConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

/**
 * Retrieve cached DNS/MX status from Vercel KV (Edge) or memory
 */
export async function getCachedMxRecord(domain: string): Promise<CachedMxRecord | null> {
  const cleanDomain = domain.toLowerCase().trim();

  if (isKvConfigured) {
    try {
      const data = await kv.get<CachedMxRecord>(`mx:${cleanDomain}`);
      if (data) return data;
    } catch {
      // Fallback to memory on KV network failure
    }
  }

  const inMem = memoryCache.get(cleanDomain);
  if (inMem && Date.now() - inMem.timestamp < 1000 * 60 * 60) {
    return inMem;
  }
  return null;
}

/**
 * Store DNS/MX status into Vercel KV (Edge) and memory
 */
export async function setCachedMxRecord(
  domain: string,
  record: { resolves: boolean; mxRecords: string[] },
  ttlSeconds: number = 3600
): Promise<void> {
  const cleanDomain = domain.toLowerCase().trim();
  const entry: CachedMxRecord = {
    ...record,
    timestamp: Date.now(),
  };

  // Always update memory cache
  memoryCache.set(cleanDomain, entry);

  if (isKvConfigured) {
    try {
      await kv.set(`mx:${cleanDomain}`, entry, { ex: ttlSeconds });
    } catch {
      // Non-blocking catch
    }
  }
}

/**
 * Lightweight rate-limiting helper (e.g., max 30 requests/minute per client IP)
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  if (isKvConfigured) {
    try {
      const current = await kv.incr(key);
      if (current === 1) {
        await kv.expire(key, windowSeconds);
      }
      return {
        success: current <= maxRequests,
        remaining: Math.max(0, maxRequests - current),
        reset: now + windowSeconds * 1000,
      };
    } catch {
      // Fallback to memory
    }
  }

  const existing = memoryRateLimits.get(key);
  if (!existing || now > existing.resetAt) {
    memoryRateLimits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, remaining: maxRequests - 1, reset: now + windowSeconds * 1000 };
  }

  existing.count += 1;
  return {
    success: existing.count <= maxRequests,
    remaining: Math.max(0, maxRequests - existing.count),
    reset: existing.resetAt,
  };
}
