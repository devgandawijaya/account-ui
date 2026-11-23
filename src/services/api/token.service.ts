const ACCESS_TOKEN_KEY = 'accounthub_access_token';
const REFRESH_TOKEN_KEY = 'accounthub_refresh_token';
const SESSION_DATA_KEY = 'accounthub_session_user';

export class TokenService {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setAccessToken(token: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (e) {
      console.warn('[TokenService] Failed to persist access token', e);
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (e) {
      console.warn('[TokenService] Failed to persist refresh token', e);
    }
  }

  getUserSession<T>(): T | null {
    try {
      const data = localStorage.getItem(SESSION_DATA_KEY);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  }

  setUserSession<T>(user: T): void {
    try {
      localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('[TokenService] Failed to persist user session', e);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(SESSION_DATA_KEY);
    } catch (e) {
      console.warn('[TokenService] Failed to clear tokens', e);
    }
  }
}

export const tokenService = new TokenService();
