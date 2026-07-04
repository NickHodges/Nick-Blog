import { SESSION_COOKIE_NAME } from '../session-cookie';

interface AuthStatusResponse {
  isAuthenticated: boolean;
}

let authPromise: Promise<boolean> | null = null;

function hasSessionCookie(): boolean {
  return document.cookie.split(';').some((part) => {
    const [name] = part.trim().split('=');
    return name === SESSION_COOKIE_NAME;
  });
}

export function checkAuth(): Promise<boolean> {
  if (!hasSessionCookie()) {
    return Promise.resolve(false);
  }

  if (!authPromise) {
    authPromise = fetch('/api/auth-status')
      .then((r) => (r.ok ? (r.json() as Promise<AuthStatusResponse>) : { isAuthenticated: false }))
      .then((data) => data.isAuthenticated)
      .catch(() => false);
  }

  return authPromise;
}
