import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, describe, it } from 'node:test';

// Runs against the output of `npm run build`. The function is copied out of the repo first, the way
// Vercel deploys it, so a module missing from the bundle can't quietly resolve from ./node_modules.
const FUNCTION_DIR = resolve('.vercel/output/functions/_render.func');

// Placeholders for the required astro:env secrets: never the real values
const PLACEHOLDER_ENV = {
  PATH: process.env.PATH ?? '',
  ADMIN_EMAIL: 'admin@example.test',
  ADMIN_PASSWORD: 'placeholder',
  RESPECTIFY_EMAIL: 'respectify@example.test',
  RESPECTIFY_API_KEY: 'placeholder',
  REDIS_URL: 'redis://127.0.0.1:1',
};

// Loads the function and sends one request through its handler; prints the status or the load error
const REQUEST_SCRIPT = `
const { default: handler } = await import('./dist/server/entry.mjs');
const response = await handler.fetch(new Request('https://www.nickhodges.com/api/comments'));
process.stdout.write(String(response.status));
process.exit(0);
`;

describe('Vercel server function', () => {
  let isolatedDir = '';

  before(() => {
    assert.ok(existsSync(FUNCTION_DIR), `${FUNCTION_DIR} is missing: run npm run build first`);
    isolatedDir = mkdtempSync(join(tmpdir(), 'nick-blog-function-'));
    cpSync(FUNCTION_DIR, isolatedDir, { recursive: true, dereference: true });
    // The local comments database location; nothing is written by this request
    mkdirSync(join(isolatedDir, '.data'));
  });

  after(() => {
    rmSync(isolatedDir, { recursive: true, force: true });
  });

  it('loads and serves a request with only the files in the bundle', () => {
    const run = (): string => execFileSync(process.execPath, ['--input-type=module', '-e', REQUEST_SCRIPT], { cwd: isolatedDir, env: PLACEHOLDER_ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    let status = '';
    assert.doesNotThrow(() => {
      status = run();
    }, 'the server function failed to load or crashed');
    assert.equal(status, '400', 'GET /api/comments without a slug should be rejected with 400');
  });
});
