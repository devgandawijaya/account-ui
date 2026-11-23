import { API_CONFIG } from '../../config/api.config';
import { ApiResponse, ApiError } from '../../models/api.types';
import { tokenService } from './token.service';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}

export class ApiClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { body, params, requiresAuth = true, headers: customHeaders, ...restOptions } = options;

    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const headers = new Headers(customHeaders);
    headers.set('accept', '*/*');

    if (body !== undefined && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (requiresAuth) {
      const token = tokenService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body: body !== undefined ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let payload: ApiResponse<T>;
      const text = await response.text();

      try {
        payload = text ? JSON.parse(text) : { success: response.ok, message: response.statusText, timestamp: new Date().toISOString() };
      } catch {
        payload = {
          success: response.ok,
          message: text || response.statusText,
          timestamp: new Date().toISOString(),
        };
      }

      if (!response.ok || !payload.success) {
        if (response.status === 401) {
          tokenService.clear();
        }

        let errorMessage = payload.message || `HTTP Error ${response.status}`;
        if (payload.errors && Array.isArray(payload.errors) && payload.errors.length > 0) {
          errorMessage = `${errorMessage} (${payload.errors.join('; ')})`;
        }

        throw new ApiError(errorMessage, response.status, payload.errors, payload.timestamp);
      }

      return payload;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Waktu permintaan habis. Silakan periksa koneksi Anda dan coba beberapa saat lagi.');
      }

      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw new ApiError(
          'Tidak dapat terhubung ke server. Pastikan layanan server aktif dan periksa koneksi internet Anda.'
        );
      }

      const msg = err instanceof Error ? err.message : 'Terjadi kendala saat menghubungkan ke server.';
      throw new ApiError(msg);
    }
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
