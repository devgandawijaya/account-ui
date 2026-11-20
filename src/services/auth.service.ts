import { API_CONFIG } from '../config/api.config';
import { apiClient } from './api/apiClient';
import { tokenService } from './api/token.service';
import { 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest,
  AuthResponseData, 
  AuthSession 
} from '../models/auth.types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthSession> {
    const response = await apiClient.post<AuthResponseData>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requiresAuth: false }
    );

    if (!response.data) {
      throw new Error('Format respons autentikasi tidak valid.');
    }

    const { accessToken, refreshToken, expiresIn, userId, email, fullName, role } = response.data;

    tokenService.setAccessToken(accessToken);
    tokenService.setRefreshToken(refreshToken);

    const user = { userId, email, fullName, role };
    tokenService.setUserSession(user);

    const session: AuthSession = {
      token: accessToken,
      refreshToken,
      user,
      expiresAt: Date.now() + (expiresIn || 86400000),
    };

    return session;
  }

  async register(payload: RegisterRequest): Promise<AuthSession> {
    const response = await apiClient.post<AuthResponseData>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      payload,
      { requiresAuth: false }
    );

    if (!response.data) {
      throw new Error('Format respons registrasi tidak valid.');
    }

    const { accessToken, refreshToken, expiresIn, userId, email, fullName, role } = response.data;

    tokenService.setAccessToken(accessToken);
    tokenService.setRefreshToken(refreshToken);

    const user = { userId, email, fullName, role };
    tokenService.setUserSession(user);

    const session: AuthSession = {
      token: accessToken,
      refreshToken,
      user,
      expiresAt: Date.now() + (expiresIn || 86400000),
    };

    return session;
  }

  async getCurrentUser(): Promise<AuthResponseData> {
    const response = await apiClient.get<AuthResponseData>(API_CONFIG.ENDPOINTS.AUTH.ME);
    if (!response.data) {
      throw new Error('Gagal mendapatkan sesi akun aktif.');
    }
    return response.data;
  }

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiClient.put<void>(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  }

  async selfDeactivate(): Promise<void> {
    await apiClient.delete<void>(API_CONFIG.ENDPOINTS.USERS.ME);
    this.logout();
  }

  getStoredSession(): AuthSession | null {
    const token = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken() || '';
    const user = tokenService.getUserSession<AuthSession['user']>();

    if (!token || !user) {
      return null;
    }

    return {
      token,
      refreshToken,
      user,
      expiresAt: Date.now() + 86400000,
    };
  }

  logout(): void {
    tokenService.clear();
  }

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.SYSTEM.HEALTH, {
        headers: { accept: 'application/json' },
      });
      if (response.ok) {
        return await response.json();
      }
      return { status: 'DOWN' };
    } catch {
      return { status: 'DOWN' };
    }
  }
}

export const authService = new AuthService();
