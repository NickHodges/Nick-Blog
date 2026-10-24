/**
 * The comments table, for drizzle-kit. It is exactly the `Comment` table Astro DB created in
 * Turso, so the live database needs no migration; drizzle.local.config.ts uses this to create
 * the local development database only.
 */
export { respectifyComments } from '@respectify/astro/sqlite';
