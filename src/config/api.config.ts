/**
 * Centralized API Configuration
 * Zero hardcoded endpoints.
 * Supports direct cross-origin communication (allowed by Spring Boot backend)
 * or same-origin reverse proxy (Vite & Nginx).
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = typeof rawBaseUrl === 'string' ? rawBaseUrl.replace(/\/+$/, '') : 'http://localhost:8085';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT_MS: 15000,
  ENDPOINTS: {
    AUTH: {
      REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
      LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
      ME: `${API_BASE_URL}/api/v1/auth/me`,
      CHANGE_PASSWORD: `${API_BASE_URL}/api/v1/auth/change-password`,
    },
    USERS: {
      LIST: `${API_BASE_URL}/api/v1/users`,
      BY_ID: (userId: string) => `${API_BASE_URL}/api/v1/users/${encodeURIComponent(userId)}`,
      STATUS: (userId: string) => `${API_BASE_URL}/api/v1/users/${encodeURIComponent(userId)}/status`,
      ME: `${API_BASE_URL}/api/v1/users/me`,
    },
    PROFILES: {
      LIST: `${API_BASE_URL}/api/v1/profiles`,
      ME: `${API_BASE_URL}/api/v1/profiles/me`,
      BY_ID: (userId: string) => `${API_BASE_URL}/api/v1/profiles/${encodeURIComponent(userId)}`,
    },
    SYSTEM: {
      HEALTH: `${API_BASE_URL}/actuator/health`,
    },
  },
} as const;
