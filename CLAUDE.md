# Nick's Blog Project Guide

## Build Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Production build (`astro build`)
- `npm run build:ci` - Same build, for CI
- `npm run db:local` - Create the local comments database `.data/comments.db` (git-ignored)
- `npm run preview` - Preview production build locally
- `npm run check` - Type check with `astro check`
- `npm test` - Run unit tests

## Pre-commit Checks

Run lint before committing:

```bash
npm run lint
```

## Project-Specific Details

### Content Collections

Blog content uses Astro content collections defined in `src/content.config.ts`:

- `post` — main blog posts in `src/content/post/`
- `delphi` — archived Embarcadero/Delphi posts in `src/content/delphi/`
- `info` — static info/legal pages in `src/content/info/`

Both `post` and `delphi` render at `/posts/[slug]`.

### UI

- Tailwind CSS with custom `prose-cactus` typography
- Astro components with minimal client-side JavaScript (custom elements)
- No React runtime on pages

### Authentication

- Single admin account via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars
- Astro 6 Sessions API with Redis (`REDIS_URL`)
- Login at `/login`; session cookie name is `session`
- Middleware in `src/middleware/index.ts` hydrates `context.locals.isAuthenticated`

### Backend Integration

- Astro Actions in `src/actions/` for comments and auth
- Comments are stored in the blog's own Turso (libSQL) database through Drizzle ORM and `@respectify/astro/sqlite` — no Astro DB, and nothing to do with the Respectify (respectify.ai) databases
- `src/lib/comments/comments-database.ts` connects: Turso (`ASTRO_DB_REMOTE_URL`, `ASTRO_DB_APP_TOKEN`) only on Vercel production/preview (`VERCEL_ENV`); everywhere else the local `.data/comments.db`, so local work never writes live comments
- The `Comment` table is the one Astro DB created; `src/lib/comments/schema.ts` re-exports it for drizzle-kit (`drizzle.local.config.ts`, local database only)
- Comment moderation via `@respectify/astro` npm integration
- Comments fetched at runtime via `/api/comments` on prerendered post pages

### Commenting System

- `@respectify/astro` integration in `astro.config.ts` (`runtime: './src/respectify.runtime.ts'`, custom `commentsApiPath: '/api/comments'`)
- `src/respectify.runtime.ts` holds the comment store and `getPostUrl` (functions can't go in `astro.config`)
- Comments submitted via `comments.submit` action (`respectifyCommentActions`)
- Comment list loaded client-side from `/api/comments?slug=...`
- Admin delete via `comments.delete` action
- UI: `<CommentSection />` from `@respectify/astro/components/CommentSection.astro`

### Search

- Pagefind indexes prerendered HTML at build time
- Postbuild script: `pagefind --site dist/client/` (copied to Vercel static output)
- Search UI in `src/components/Search.astro` (production builds only)

### Deployment

- Vercel with `@astrojs/vercel` adapter
- `output: 'server'` with most pages prerendered
- Requires `REDIS_URL`, Respectify credentials, and Turso credentials for production

## File Organization

- Components in `src/components/`
- API routes in `src/pages/api/`
- Layouts in `src/layouts/`
- Utility functions in `src/lib/`
- Actions in `src/actions/`
- Blog content in `src/content/post/` and `src/content/delphi/`

## Documentation

- https://docs.astro.build/en/getting-started/
