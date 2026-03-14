import type { APIContext } from 'astro';

export const prerender = false;

export function GET(context: APIContext): Response {
  return new Response(JSON.stringify({ isAuthenticated: context.locals.isAuthenticated }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
