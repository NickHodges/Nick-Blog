interface AuthStatusResponse {
  isAuthenticated: boolean;
}

let authPromise: Promise<boolean> | null = null;

export function checkAuth(): Promise<boolean> {
  if (!authPromise) {
    authPromise = fetch('/api/auth-status')
      .then((r) => (r.ok ? (r.json() as Promise<AuthStatusResponse>) : { isAuthenticated: false }))
      .then((data) => data.isAuthenticated)
      .catch(() => false);
  }
  return authPromise;
}
