/** Session cookie name — must match astro.config.ts session.cookie.name */
export const SESSION_COOKIE_NAME = 'session';

export function hasSessionCookie(cookieHeader: string): boolean {
  if (!cookieHeader) return false;

  return cookieHeader.split(';').some((part) => {
    const [name] = part.trim().split('=');
    return name === SESSION_COOKIE_NAME;
  });
}
