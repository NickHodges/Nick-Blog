import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasSessionCookie, SESSION_COOKIE_NAME } from './session-cookie.ts';

describe('hasSessionCookie', () => {
  it('returns false for empty cookie header', () => {
    assert.equal(hasSessionCookie(''), false);
  });

  it('returns false when session cookie is absent', () => {
    assert.equal(hasSessionCookie('other=value; theme=dark'), false);
  });

  it('returns true when session cookie is present', () => {
    assert.equal(hasSessionCookie(`${SESSION_COOKIE_NAME}=abc123; other=value`), true);
  });
});
