# Nick's Blog Project Guide

## Build Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Run type check and build production site
- `npm run preview` - Preview production build locally
- `npm run start` - Run production build with Node.js

## Pre-commit Checks

**IMPORTANT:** Always run lint checks before finishing work on any changes to ensure the commit hooks will pass.

The pre-commit hook runs `lint-staged` which:
1. Runs eslint with `--fix` on staged `.js`, `.ts`, and `.astro` files
2. Runs prettier on staged `.json`, `.md`, and `.css` files

## Project-Specific Details

### Content Collections
- Blog posts use Astro content collections
- Markdown/MDX files in `src/content/blog/`
- Content schema defined with Zod

### Starwind UI Components
- Uses Starwind as the base UI component library
- Same patterns as other projects: inherit, extend, don't replace

### Authentication
- Authentication is via Supabase, by email address
- Authentication is done in `middleware/index.ts`

### Backend Integration
- Headless client — no local database
- Communicates with backend via Astro Actions
- Backend API URL configured via `BACKEND_API_URL` environment variable
- Does NOT use Astro:DB, Drizzle, or Turso

### Commenting System
- Integrated commenting on blog posts
- Respectify integration for comment moderation

### Component Structure
- Client-side JavaScript with `define:vars`, kept minimal for UI only
- No UI framework like React; use Astro components and SSR
- Dialogs shown via JS

## File Organization

- Components in `src/components/`
- API routes in `src/pages/api/`
- Layouts in `src/layouts/`
- Utility functions in `src/lib/`
- Actions in `src/actions/`
- Blog content in `src/content/blog/`

## Documentation

- https://docs.astro.build/en/getting-started/
