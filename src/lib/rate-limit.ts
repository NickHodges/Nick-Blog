import { getRedisClient } from './redis';
import { logger } from './logger';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  prefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export interface IRateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

class SlidingWindowRateLimiter implements IRateLimiter {
  private readonly requests = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor(config: Omit<RateLimitConfig, 'prefix'>) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;

    this.cleanupTimer = setInterval(() => this.cleanup(), 60_000);

    if (typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
      this.cleanupTimer.unref();
    }
  }

  check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const timestamps = this.requests.get(key) ?? [];
    const valid = timestamps.filter((t) => t > windowStart);

    if (valid.length >= this.maxRequests) {
      const oldestInWindow = valid[0]!;
      const retryAfterMs = oldestInWindow + this.windowMs - now;
      logger.warn(`[rate-limit] Blocked request for key: ${key} (${valid.length}/${this.maxRequests})`);
      return Promise.resolve({ allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) });
    }

    valid.push(now);
    this.requests.set(key, valid);
    return Promise.resolve({ allowed: true, retryAfterMs: 0 });
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, timestamps] of this.requests) {
      const valid = timestamps.filter((t) => t > windowStart);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }
  }
}

class RedisSlidingWindowRateLimiter implements IRateLimiter {
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly prefix: string;
  private readonly fallback: SlidingWindowRateLimiter;

  constructor(config: RateLimitConfig) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;
    this.prefix = config.prefix;
    this.fallback = new SlidingWindowRateLimiter(config);
  }

  async check(key: string): Promise<RateLimitResult> {
    const redis = getRedisClient();
    if (!redis) return this.fallback.check(key);

    const now = Date.now();
    const windowStart = now - this.windowMs;
    const redisKey = `${this.prefix}:${key}`;

    try {
      const member = `${now}:${Math.random()}`;
      const pipeline = redis.multi();
      pipeline.zremrangebyscore(redisKey, 0, windowStart);
      pipeline.zadd(redisKey, now, member);
      pipeline.zcard(redisKey);
      pipeline.pexpire(redisKey, this.windowMs);

      const results = await pipeline.exec();
      const count = (results?.[2]?.[1] as number) ?? 0;

      if (count > this.maxRequests) {
        await redis.zrem(redisKey, member).catch(() => undefined);

        const oldest = await redis.zrange(redisKey, 0, 0, 'WITHSCORES');
        const oldestTimestamp = oldest[1] ? Number(oldest[1]) : now;
        const retryAfterMs = Math.max(oldestTimestamp + this.windowMs - now, 1000);

        logger.warn(`[rate-limit] Blocked request for key: ${key} (${count}/${this.maxRequests})`);
        return { allowed: false, retryAfterMs };
      }

      return { allowed: true, retryAfterMs: 0 };
    } catch (error) {
      logger.error('[rate-limit] Redis error, falling back to in-memory limiter', { error });
      return this.fallback.check(key);
    }
  }
}

export const loginLimiter: IRateLimiter = new RedisSlidingWindowRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  prefix: 'ratelimit:login',
});

export const commentLimiter: IRateLimiter = new RedisSlidingWindowRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 10,
  prefix: 'ratelimit:comment',
});
