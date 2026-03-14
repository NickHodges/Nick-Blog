# TODOs

## Gate auth-status fetch behind session cookie check

**What:** Add a `document.cookie` check in `src/lib/client/auth-check.ts` — only call `fetch('/api/auth-status')` if the session cookie exists. Return `false` immediately otherwise.

**Why:** Currently every visitor (admin or not) triggers a Vercel serverless function call on every page load. ~99%+ of visitors are not admins, so this is wasted compute and latency.

**Pros:** Eliminates unnecessary serverless invocations for non-admin visitors. Zero network request for the common case.

**Cons:** Requires exposing the session cookie name to client-side code (not a security issue since cookies are already visible in `document.cookie`, but creates coupling between `lib/auth.ts` and `lib/client/auth-check.ts`).

**Context:** Introduced in the `feature/static-output-refactor` branch which switched from `output: 'server'` to `output: 'static'`. The `checkAuth()` singleton in `auth-check.ts` deduplicates within a page load but still fires for every visitor. The session cookie name is set in `lib/auth.ts` — check there for the cookie name to match.

**Depends on:** Nothing. Can be done independently.
