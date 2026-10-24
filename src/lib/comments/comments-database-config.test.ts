import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LOCAL_COMMENTS_DATABASE_URL, resolveCommentsDatabase } from './comments-database-config.ts';

const turso = { remoteUrl: 'libsql://blog-comments.turso.io', authToken: 'a-token' };

describe('resolveCommentsDatabase', () => {
  it('uses the local file when not on Vercel, even with Turso credentials set', () => {
    assert.deepEqual(resolveCommentsDatabase({ vercelEnv: undefined, ...turso }), { kind: 'local', url: LOCAL_COMMENTS_DATABASE_URL });
  });

  it('uses the local file under vercel dev', () => {
    assert.deepEqual(resolveCommentsDatabase({ vercelEnv: 'development', ...turso }), { kind: 'local', url: LOCAL_COMMENTS_DATABASE_URL });
  });

  it('uses Turso on a production deployment', () => {
    assert.deepEqual(resolveCommentsDatabase({ vercelEnv: 'production', ...turso }), { kind: 'turso', url: turso.remoteUrl, authToken: turso.authToken });
  });

  it('uses Turso on a preview deployment', () => {
    assert.equal(resolveCommentsDatabase({ vercelEnv: 'preview', ...turso }).kind, 'turso');
  });

  it('accepts an https:// Turso URL', () => {
    assert.equal(resolveCommentsDatabase({ vercelEnv: 'production', remoteUrl: 'https://blog-comments.turso.io', authToken: 'a-token' }).kind, 'turso');
  });

  it('refuses a deployment with no Turso URL, naming the variable', () => {
    assert.throws(() => resolveCommentsDatabase({ vercelEnv: 'production', remoteUrl: undefined, authToken: 'a-token' }), /ASTRO_DB_REMOTE_URL missing or malformed on the production deployment/);
  });

  it('refuses a deployment with no token, naming the variable', () => {
    assert.throws(() => resolveCommentsDatabase({ vercelEnv: 'preview', remoteUrl: turso.remoteUrl, authToken: undefined }), /ASTRO_DB_APP_TOKEN missing or malformed on the preview deployment/);
  });

  it('refuses a deployment pointed at a local file', () => {
    assert.throws(() => resolveCommentsDatabase({ vercelEnv: 'production', remoteUrl: 'file:comments.db', authToken: 'a-token' }), /ASTRO_DB_REMOTE_URL/);
  });

  it('never puts the credentials in the error', () => {
    assert.throws(
      () => resolveCommentsDatabase({ vercelEnv: 'production', remoteUrl: 'not-a-url-secret', authToken: '' }),
      (error: Error) => !error.message.includes('not-a-url-secret') && error.message.includes('ASTRO_DB_REMOTE_URL and ASTRO_DB_APP_TOKEN'),
    );
  });
});
