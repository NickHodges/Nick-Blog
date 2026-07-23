export interface MemoryRateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export interface IRateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

/** Sliding-window rate limiter kept entirely in process memory. */
export class SlidingWindowRateLimiter implements IRateLimiter {
  private readonly requests = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor(config: MemoryRateLimitConfig) {
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

export function createMemoryRateLimiter(config: MemoryRateLimitConfig): IRateLimiter {
  return new SlidingWindowRateLimiter(config);
}
