import { defineConfig } from 'drizzle-kit';
import { LOCAL_COMMENTS_DATABASE_URL } from './src/lib/comments/comments-database-config';

// Local development only. The URL is a constant, never read from the environment, so this can
// only ever create the local file: the live Turso database already has the table.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/comments/schema.ts',
  dbCredentials: {
    url: LOCAL_COMMENTS_DATABASE_URL,
  },
});
