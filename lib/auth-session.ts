import type { AuthTokensResponse, AuthUser } from '@/lib/contracts';

const STORAGE_KEY = 'dubiken_session';

export const AUTH_SESSION_EVENT = 'dubiken-auth-change';

export interface AuthSession {
  loggedIn: boolean;
  email?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthUser;
}

/** Mock / demo login (no API) */
export function setAuthSession(email?: string): void {
  if (typeof window === 'undefined') return;
  const session: AuthSession = { loggedIn: true, email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

/** After `POST /auth/login` or register */
export function setAuthSessionFromTokens(response: AuthTokensResponse): void {
  if (typeof window === 'undefined') return;
  const session: AuthSession = {
    loggedIn: true,
    email: response.user.email,
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    user: response.user,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed.loggedIn ? parsed : null;
  } catch {
    return null;
  }
}

export function isAuthSessionActive(): boolean {
  return getAuthSession()?.loggedIn === true;
}
