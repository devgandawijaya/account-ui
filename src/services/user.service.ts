import { API_CONFIG } from '../config/api.config';
import { apiClient } from './api/apiClient';
import { PageMetadata } from '../models/api.types';
import { 
  AdminUserItem, 
  AdminCreateUserRequest, 
  AdminUpdateUserRequest, 
  UserFilterParams, 
  PaginatedUsers 
} from '../models/user.types';

export class UserService {
  async getUsers(params: UserFilterParams = {}): Promise<PaginatedUsers> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: params.page !== undefined ? params.page : 0,
      size: params.size !== undefined ? params.size : 10,
      sortBy: params.sortBy || 'createdAt',
      sortDir: params.sortDir || 'desc',
    };

    if (params.keyword && params.keyword.trim() !== '') {
      queryParams.keyword = params.keyword.trim();
    }
    if (params.role && params.role !== 'ALL') {
      queryParams.role = params.role;
    }
    if (params.isActive !== undefined) {
      queryParams.isActive = params.isActive;
    }

    const response = await apiClient.get<AdminUserItem[]>(API_CONFIG.ENDPOINTS.USERS.LIST, {
      params: queryParams,
    });

    const users = response.data || [];
    const rawPag = response.pagination as (PageMetadata & { pageNumber?: number; pageSize?: number; isLast?: boolean }) | undefined;
    const pageNum = rawPag?.pageNumber ?? rawPag?.page ?? (queryParams.page as number);
    const sizeNum = rawPag?.pageSize ?? rawPag?.size ?? (queryParams.size as number);
    const totalElem = rawPag?.totalElements ?? users.length;
    const totalPages = rawPag?.totalPages ?? Math.max(1, Math.ceil(totalElem / sizeNum));
    const isLast = rawPag?.isLast ?? rawPag?.last ?? ((pageNum + 1) >= totalPages);

    const pagination: PageMetadata = {
      page: pageNum,
      size: sizeNum,
      pageNumber: pageNum,
      pageSize: sizeNum,
      totalElements: totalElem,
      totalPages: totalPages,
      first: pageNum === 0,
      last: isLast,
      isLast: isLast,
    };

    return {
      users,
      pagination,
    };
  }

  async getUserById(userId: string): Promise<AdminUserItem> {
    const response = await apiClient.get<AdminUserItem>(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId));
    if (!response.data) {
      throw new Error('Data pengguna tidak ditemukan.');
    }
    return response.data;
  }

  async createUser(payload: AdminCreateUserRequest): Promise<AdminUserItem> {
    const response = await apiClient.post<AdminUserItem>(API_CONFIG.ENDPOINTS.USERS.LIST, payload);
    if (!response.data) {
      throw new Error('Gagal membuat pengguna baru.');
    }
    return response.data;
  }

  async updateUser(userId: string, payload: AdminUpdateUserRequest): Promise<AdminUserItem> {
    const response = await apiClient.put<AdminUserItem>(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId), payload);
    if (!response.data) {
      throw new Error('Gagal memperbarui data pengguna.');
    }
    return response.data;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<AdminUserItem> {
    const response = await apiClient.patch<AdminUserItem>(API_CONFIG.ENDPOINTS.USERS.STATUS(userId), {
      isActive,
    });
    if (!response.data) {
      throw new Error('Gagal memperbarui status aktif pengguna.');
    }
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete<void>(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId));
  }

  exportUsersToCSV(users: AdminUserItem[]): string {
    const headers = [
      'ID Pengguna',
      'Nama Lengkap',
      'Email',
      'Peran (Role)',
      'Status Akun',
      'Memiliki Profil',
      'Tanggal Dibuat',
      'Pembuat',
      'Pembaruan Terakhir',
      'Diperbarui Oleh',
    ];

    const rows = users.map((u) => [
      u.id,
      `"${(u.fullName || '').replace(/"/g, '""')}"`,
      `"${u.email || ''}"`,
      u.role === 'ROLE_ADMIN' ? 'Administrator' : 'Pengguna Standar',
      u.isActive ? 'Aktif' : 'Dinonaktifkan',
      u.hasProfile ? 'Ya' : 'Belum',
      u.createdAt ? u.createdAt.replace('T', ' ').slice(0, 19) : '-',
      `"${u.createdBy || '-'}"`,
      u.updatedAt ? u.updatedAt.replace('T', ' ').slice(0, 19) : '-',
      `"${u.updatedBy || '-'}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}

export const userService = new UserService();
