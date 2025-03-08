# Nick-Blog Development Guide

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Run checks and build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Prettier and ESLint to fix files
- `npm run format` - Format files with Prettier (JS, TS, Astro)
- `npm run format:all` - Format all files, including HTML and CSS
- `npm run check` - Run Astro type checking

## Code Style

- Single quotes for strings
- Printwidth: 1200 characters
- Use TypeScript with strict type checking
- Follow the path aliases defined in tsconfig.json (@components/, @utils, etc.)
- Astro components use .astro extension
- React components (.tsx) for interactive UI elements
- Use Tailwind CSS for styling
- Follow ESLint recommendations for JS/TS
- When testing, run `npm run check` before committing changes

## Project Structure

- `src/components/` - Reusable UI components
- `src/content/` - Blog posts and page content
- `src/layouts/` - Page layout templates
- `src/pages/` - Astro page components
- `src/utils/` - Utility functions and helpers
