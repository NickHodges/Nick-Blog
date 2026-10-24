import { ASTRO_DB_APP_TOKEN, ASTRO_DB_REMOTE_URL, VERCEL_ENV } from 'astro:env/server';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { logger } from '../logger';
import { resolveCommentsDatabase } from './comments-database-config';

const connection = resolveCommentsDatabase({ vercelEnv: VERCEL_ENV, remoteUrl: ASTRO_DB_REMOTE_URL, authToken: ASTRO_DB_APP_TOKEN });

if (connection.kind === 'local') {
  logger.info(`Comments: using the local database ${connection.url} (create it with npm run db:local)`);
}

/** The blog's comments database, through Drizzle: Turso when deployed, a local file otherwise. */
export const commentsDatabase = drizzle({
  client: connection.kind === 'turso' ? createClient({ url: connection.url, authToken: connection.authToken }) : createClient({ url: connection.url }),
});
