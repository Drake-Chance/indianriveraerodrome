/**
 * Shared community authentication.
 *
 * All password-protected pages (Directory, Forum, Merch, Gallery) use
 * the same community password. Once a user authenticates on any page
 * the session is persisted in localStorage so they stay logged in
 * across pages and browser refreshes.
 */

const AUTH_KEY = 'irapoa_community_auth';
const COMMUNITY_PASSWORD = 'iraopa2026';

/** Check whether the user is already authenticated. */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === '1';
}

/**
 * Attempt to authenticate with a password.
 * Returns `true` on success, `false` on wrong password.
 */
export function authenticate(password: string): boolean {
  if (password === COMMUNITY_PASSWORD) {
    localStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

/** Clear the authentication state (log out). */
export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export { COMMUNITY_PASSWORD };
