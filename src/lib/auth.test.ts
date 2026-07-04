import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { timingSafeEqual } from 'node:crypto';

function verifyCredentials(email: string, password: string, expectedEmail: string, expectedPassword: string): boolean {
  const encoder = new TextEncoder();
  const emailBytes = encoder.encode(email);
  const expectedEmailBytes = encoder.encode(expectedEmail);
  const passwordBytes = encoder.encode(password);
  const expectedPasswordBytes = encoder.encode(expectedPassword);

  const emailMatch = emailBytes.length === expectedEmailBytes.length && timingSafeEqual(emailBytes, expectedEmailBytes);
  const passwordMatch = passwordBytes.length === expectedPasswordBytes.length && timingSafeEqual(passwordBytes, expectedPasswordBytes);

  return emailMatch && passwordMatch;
}

describe('verifyCredentials logic', () => {
  const expectedEmail = 'admin@example.com';
  const expectedPassword = 'secret-password';

  it('accepts valid credentials', () => {
    assert.equal(verifyCredentials('admin@example.com', 'secret-password', expectedEmail, expectedPassword), true);
  });

  it('rejects invalid email', () => {
    assert.equal(verifyCredentials('wrong@example.com', 'secret-password', expectedEmail, expectedPassword), false);
  });

  it('rejects invalid password', () => {
    assert.equal(verifyCredentials('admin@example.com', 'wrong-password', expectedEmail, expectedPassword), false);
  });

  it('rejects credentials with different lengths', () => {
    assert.equal(verifyCredentials('admin@example.com', 'short', expectedEmail, expectedPassword), false);
  });
});
