import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createMemoryRateLimiter } from './memory-rate-limit.ts';

describe('createMemoryRateLimiter', () => {
  it('allows requests under the limit', async () => {
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, maxRequests: 3 });

    assert.equal((await limiter.check('a')).allowed, true);
    assert.equal((await limiter.check('a')).allowed, true);
    assert.equal((await limiter.check('a')).allowed, true);
  });

  it('blocks once the limit is exceeded', async () => {
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, maxRequests: 2 });

    assert.equal((await limiter.check('b')).allowed, true);
    assert.equal((await limiter.check('b')).allowed, true);

    const blocked = await limiter.check('b');
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterMs >= 1000);
  });

  it('tracks keys independently', async () => {
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, maxRequests: 1 });

    assert.equal((await limiter.check('one')).allowed, true);
    assert.equal((await limiter.check('one')).allowed, false);
    assert.equal((await limiter.check('two')).allowed, true);
  });
});
