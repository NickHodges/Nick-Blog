import { defineMiddleware } from 'astro:middleware';
import { loginLimiter, commentLimiter } from '../lib/rate-limit';
import type { IRateLimiter } from '../lib/rate-limit';

const rateLimitedRoutes: Record<string, IRateLimiter> = {
  '/_actions/auth.login': loginLimiter,
  '/_actions/comments.submit': commentLimiter,
};

function getClientIp(request: Request, clientAddress: string | undefined): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]!.trim();
  }
  return clientAddress ?? 'unknown';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const limiter = rateLimitedRoutes[pathname];

  if (limiter && context.request.method === 'POST') {
    const ip = getClientIp(context.request, context.clientAddress);
    const key = `${ip}:${pathname}`;
    const result = limiter.check(key);

    if (!result.allowed) {
      const retryAfterSeconds = Math.ceil(result.retryAfterMs / 1000);
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSeconds),
        },
      });
    }
  }

  if (context.isPrerendered) {
    context.locals.user = null;
    context.locals.isAuthenticated = false;
    return next();
  }

  const user = await context.session?.get('user');
  context.locals.user = user ?? null;
  context.locals.isAuthenticated = user != null;
  return next();
});
