import { z } from 'astro/zod';

/** The local comments database used everywhere except a Vercel deployment. Created by `npm run db:local`. */
export const LOCAL_COMMENTS_DATABASE_URL = 'file:.data/comments.db';

/** What decides where comments are stored. */
export interface CommentsDatabaseSettings {
  /** Vercel's VERCEL_ENV: set on Vercel deployments, unset locally */
  vercelEnv: 'production' | 'preview' | 'development' | undefined;
  /** The Turso database URL */
  remoteUrl: string | undefined;
  /** The Turso auth token */
  authToken: string | undefined;
}

/** A libSQL connection: a local file, or Turso with its token. */
export type CommentsDatabaseConnection = { kind: 'local'; url: string } | { kind: 'turso'; url: string; authToken: string };

const tursoSchema = z.object({
  remoteUrl: z.string().regex(/^(libsql|https):\/\//, 'must be a libsql:// or https:// URL'),
  authToken: z.string().min(1),
});

/**
 * Choose the comments database. Production and preview deployments on Vercel use Turso, the
 * only place the real comments live. Everything else (astro dev, a local build or preview, and
 * `vercel dev`) uses the local file, even when .env holds the Turso credentials, so local work
 * never writes to the live comments.
 * @throws Error naming the variable when a deployment is missing or has a malformed Turso setting
 */
export function resolveCommentsDatabase(settings: CommentsDatabaseSettings): CommentsDatabaseConnection {
  if (settings.vercelEnv !== 'production' && settings.vercelEnv !== 'preview') {
    return { kind: 'local', url: LOCAL_COMMENTS_DATABASE_URL };
  }
  const result = tursoSchema.safeParse({ remoteUrl: settings.remoteUrl, authToken: settings.authToken });
  if (!result.success) {
    // Name the variables, never their values: they hold the database credentials
    const names = result.error.issues.map((issue) => (issue.path[0] === 'remoteUrl' ? 'ASTRO_DB_REMOTE_URL' : 'ASTRO_DB_APP_TOKEN'));
    throw new Error(`Comments database: ${[...new Set(names)].join(' and ')} missing or malformed on the ${settings.vercelEnv} deployment`);
  }
  return { kind: 'turso', url: result.data.remoteUrl, authToken: result.data.authToken };
}
