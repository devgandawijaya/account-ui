/**
 * Authentication Model Types
 * Matching real backend request bodies and responses
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    fullName: string;
    role: string;
  };
  expiresAt: number;
}

export interface AuthState {
  user: AuthSession['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
