interface AuthStatusResponse {
  isAuthenticated: boolean;
}

let authPromise: Promise<boolean> | null = null;

/**
 * Check admin auth via the server. Session cookies are httpOnly, so we cannot
 * gate on document.cookie — always ask /api/auth-status (result is cached).
 */
export function checkAuth(): Promise<boolean> {
  if (!authPromise) {
    authPromise = fetch('/api/auth-status')
      .then((r) => (r.ok ? (r.json() as Promise<AuthStatusResponse>) : { isAuthenticated: false }))
      .then((data) => data.isAuthenticated)
      .catch(() => false);
  }

  return authPromise;
}

/** Clear the cached auth result (e.g. after logout). */
export function clearAuthCache(): void {
  authPromise = null;
}
