// lib/rateLimit.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

// Simple in-memory store for rate limiting
// Note: In production, use Redis or similar for distributed systems
const rateLimit = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxAttempts: number;  // Maximum number of attempts
  windowMs: number;     // Time window in milliseconds
}

export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimiter(req: Request) {
    const { userId } = auth();
    if (!userId) return false;

    const key = `${userId}:auth`;
    const now = Date.now();
    const limit = rateLimit.get(key);

    if (!limit) {
      // First attempt
      rateLimit.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (now > limit.resetTime) {
      // Reset window
      rateLimit.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (limit.count >= config.maxAttempts) {
      return false;
    }

    // Increment attempt count
    limit.count += 1;
    rateLimit.set(key, limit);
    return true;
  };
}