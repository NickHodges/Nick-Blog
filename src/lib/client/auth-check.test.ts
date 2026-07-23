import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { checkAuth, clearAuthCache } from './auth-check.ts';

describe('checkAuth', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    clearAuthCache();
  });

  it('fetches /api/auth-status without requiring a readable session cookie', async () => {
    let requestedUrl = '';
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify({ isAuthenticated: true }), { status: 200 });
    }) as typeof fetch;

    assert.equal(await checkAuth(), true);
    assert.equal(requestedUrl, '/api/auth-status');
  });

  it('caches the auth result across calls', async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response(JSON.stringify({ isAuthenticated: false }), { status: 200 });
    }) as typeof fetch;

    assert.equal(await checkAuth(), false);
    assert.equal(await checkAuth(), false);
    assert.equal(calls, 1);
  });

  it('returns false when the auth status request fails', async () => {
    globalThis.fetch = (async () => {
      throw new Error('network down');
    }) as typeof fetch;

    assert.equal(await checkAuth(), false);
  });

  it('returns false for non-OK responses', async () => {
    globalThis.fetch = (async () => new Response('nope', { status: 500 })) as typeof fetch;

    assert.equal(await checkAuth(), false);
  });

  it('clearAuthCache forces a fresh request', async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response(JSON.stringify({ isAuthenticated: true }), { status: 200 });
    }) as typeof fetch;

    assert.equal(await checkAuth(), true);
    clearAuthCache();
    assert.equal(await checkAuth(), true);
    assert.equal(calls, 2);
  });
});
