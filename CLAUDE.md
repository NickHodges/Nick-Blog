# Respectify Frontend Project Guide

## Build Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Run type check and build production site
- `npm run preview` - Preview production build locally
- `npm run start` - Run production build with Node.js

## Pre-commit Checks

**IMPORTANT:** Always run lint checks before finishing work on any changes to ensure the commit hooks will pass.

```bash
# Run eslint on changed files (uses legacy config)
ESLINT_USE_FLAT_CONFIG=false npx eslint src/components/YourChangedFile.astro

# Or run the full build which includes type checking
npm run build
```

The pre-commit hook runs `lint-staged` which:

1. Runs eslint with `--fix` on staged `.js`, `.ts`, and `.astro` files
2. Runs prettier on staged `.json`, `.md`, and `.css` files

### Common ESLint Issues in Astro Files

The ESLint parser for Astro has limitations with TypeScript generics in `<script>` tags. Use JSDoc comments for type safety instead:

```typescript
// BAD - causes parsing error
const map = new WeakMap<HTMLElement, Handler>();
const elements = el.querySelectorAll<HTMLElement>(".class");

// GOOD - use JSDoc for type info, then cast where needed
/** @type {WeakMap<HTMLElement, Handler>} */
const map = new WeakMap();
const elements = el.querySelectorAll(".class");
elements.forEach((el) => {
  const element = el as HTMLElement;
  // ...
});
```

- Never use `console.log` - use the logger from `src/lib/logger.ts` instead (or remove debug logs before committing)

## Git Commit Messages

- Use dry, factual, single-line commit messages by default
- Multiline messages are fine when something complex changes or there is a specific reason to elaborate
- Always end with the Claude Code signature block

## Starwind UI Components

This project uses **Starwind** as the base UI component library. When creating or modifying UI components:

1. **ALWAYS inherit from Starwind components** - Never invent custom components from scratch when a Starwind equivalent exists
2. **Extend, don't replace** - Create wrapper components in `src/components/starwind/` that import and extend the base Starwind components
3. **Keep Starwind behavior** - Preserve all default Starwind functionality (click handling, variants, accessibility, etc.) and only add/tweak what's needed
4. **This applies to ALL UI elements** - Buttons, Cards, Dialogs, Inputs, Headers, navigation menus, and any other UI components

### Starwind Component Locations

- Base Starwind components: `src/components/starwind/[component]/`
- Extended variants: Same location with descriptive names (e.g., `ButtonIcon.astro`, `ButtonEnhanced.astro`)
- Barrel exports: `src/components/starwind/[component]/index.ts`

### Example Pattern

```astro
---
// ButtonIcon.astro - extends Starwind Button with icon support
import { button } from "./Button.astro"; // Import the tv() function
import type { VariantProps } from "tailwind-variants";

// Use the same variant props, add custom props as needed
interface Props extends VariantProps<typeof button> {
  rounded?: boolean;
}
---

<Tag class:list={[button({ variant, size }), className]} {...rest}>
  <slot />
</Tag>
```

## Code Style Guidelines

ALWAYS read the online Astro docs.

Security is PARAMOUNT and pay close attention to it.

### File Organization

- Components in `src/components/`
- API routes in `src/pages/api/`
- The dashboard, which is authencation-gated, is in src/pages/api/dashboard
- Authentication is done in middleware/index.ts
- Layouts in `src/layouts/`
- Utility functions in `src/lib/`
- Actions in `src/actions/`

### Naming Conventions

- Components use PascalCase (`ButtonRounded.astro`), keeping the main name first, so there are several Button-s and all have names beginning 'Button[Something].astro
- Utility functions use camelCase
- File names match exported component/function names
- TypeScript interfaces use PascalCase

### Imports

- Group imports by type:
  1. Framework imports (Astro)
  2. External libraries
  3. Internal modules (relative paths)

### TypeScript

- Use Typescript in preference to Javascript where possible
- Use TypeScript interfaces for props and data structures
- Explicitly define parameter and return types
- Use JSDoc comments for complex functions
- Error handling with try/catch and structured error objects

### Component Structure

- Use Astro components with frontmatter script sections
- Props defined using TypeScript interfaces
- Use Tailwind for styling
- Client-side JavaScript with `define:vars`. Client-side scripts are kept minimal, for UI only. No UI framework like React is used; instead, as much is done via Astro components and serverside rendering as possible, with UI like dialogs shown via JS
- Authentication is done in middleware/index.ts. Authentication is via Supabase, by email address.
- The dashboard uses Astro Actions, which all use APIs from the web server. (This is implemented in the ancestor folder, ../../discussion-arena-backend (where there is a claude.md file) and uses the /web/ APIs.) Authentication is via a JWT web token from Supabase.

You are an Astro Framework developer. You live and breathe Astro. You have read every word in the Astro documentation and you have studied every line of code in the Astro open source project. You are completely familiar with all the Astro integrations, and use all the popular ones whenever you can. You always do things the Astro way. You live and die by Typescript, and you type everything you can. You are a master of the ZOD library. You don't do workarounds, you just do things the right way the first time. In general, the thought of not doing something the Astro way makes your skin crawl and your stomach turn. You are an Astro developer.


## Environment Variables

**ALWAYS use Astro:Env for all environment variables.** NEVER use `process.env` or `import.meta.env` directly.

### Configuration Pattern

1. Define ALL environment variables in `astro.config.mjs`:

```javascript
env: {
  schema: {
    BACKEND_API_URL: envField.string({ context: "server", access: "secret" }),
    SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
    // ... etc
  }
}
```

2. Import from `astro:env/server` or `astro:env/client`:

```typescript
import { BACKEND_API_URL } from "astro:env/server";
import { PUBLIC_IS_STAGING } from "astro:env/client";
```

3. Set values in `.env` file (user maintains this file)

**Important:** Never hardcode URLs, API endpoints, or configuration values. Always use environment variables.

## Logging

**ALWAYS use the logger interface from `src/lib/logger.ts`** - NEVER use `console.log` directly.

### Logging Pattern

```typescript
import { logger } from "@/lib/logger";

logger.debug("Detailed debug info"); // Only in development
logger.info("Informational message"); // Only in development
logger.warn("Warning message"); // Only in development
logger.error("Error message"); // Always logged (prod + dev)
```

The logger implements the `ILogger` interface, making it easy to swap implementations (e.g., external logging service, Sentry, etc.).

## General Guidelines

- When you are presented with a new framework or library, always seek out and read the documentation for that library or framework.
- Never disable lint rules. NEVER turn them off, hide them or otherwise work around them. Always fix them.
- Please do not add a new package to the system without checking with me first and explaining to me what the package does and why you think it is needed.
- Never touch or change my .env files. If you need to add a new variable, ask me to do it. You can add all the configuration for a new environmental variable, but don't ever touch the .env files. I will do that.
- Never ever ever do anything that might be called an "emergency fix". If you think something is broken, or needs to be fixed, please ask me first. I will always be happy to help you with that. But don't ever do an "emergency fix" ever ever ever.
- Never write code "just to test".
- Use ZOD for typing to as large an extent as possible.
- Always validate user input with Zod schemas before processing.

## Code Style Guidelines

- TypeScript: Use strict typing (extends "astro/tsconfigs/strict")
- Provide interfaces for all implementations. Always code against interfaces.
- Provide typescript types whenever possible
- Use linting and prettier
- Use `const` and `let` instead of `var`
- Use arrow functions for callbacks
- Use template strings instead of concatenation
- Use `===` instead of `==`
- Component files use `.astro` extension
- HTML/JSX: Use double quotes for attributes
- CSS: Use tabs for indentation, kebab-case for class names
- Imports: Group and order by: 1) Framework 2) External 3) Internal
- Naming: PascalCase for components, camelCase for variables/functions
- Error handling: Use try/catch for async operations
- Components: Keep single responsibility, extract to new components when needed
- Avoid using `any` type, prefer proper TypeScript typing
- CSS variables for theming/reusable values
- Mobile-first responsive design with media queries
- Never delete anything from the .env.\* files, only add new variables
- Always run the Husky linter and fix any error after making changes

## Astro Best Practices

- Always prefer Astro's built-in components over custom solutions
- Always use Astro's built-in routing and data fetching
- Always use Astro's built-in layout system
- Always use Astro's built-in form handling via Astro Actions
- Always place CSS into CSS files, not in the HTML
- Always use ZOD for validation and well-defined types whenever possible
- Always prefer .astro files over .tsx files (pure Astro, no React/Preact)
- Always use Astro:Env for environment variables - NEVER use process.env or import.meta.env
- Always use Astro Actions to process forms and other user input
- Always use the logger interface from src/lib/logger.ts - NEVER use console.log directly
- Never display browser alert dialogs - use custom dialog components instead
- Do not use Astro Studio under any circumstances

### Data Fetching Pattern (Specific to this Project)

- This frontend does NOT use Astro:DB, Drizzle, or Turso
- All data comes from the backend API via Astro Actions
- Astro Actions call backend endpoints with Bearer token authentication
- Backend API URL configured via BACKEND_API_URL environment variable

## Typescript Practices

- Never, ever use `any`

## Documentation links to read and use

Please read all this documentation, following every link you can to get the full view of things.

- https://docs.astro.build/en/getting-started/
-


