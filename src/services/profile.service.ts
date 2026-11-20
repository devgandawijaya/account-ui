import { API_CONFIG } from '../config/api.config';
import { apiClient } from './api/apiClient';
import { PageMetadata } from '../models/api.types';
import { 
  UserProfile, 
  ProfileUpdateRequest, 
  ProfileFilterParams, 
  PaginatedProfiles 
} from '../models/profile.types';

export class ProfileService {
  async getProfiles(params: ProfileFilterParams = {}): Promise<PaginatedProfiles> {
    const queryParams: Record<string, string | number | undefined> = {
      page: params.page !== undefined ? params.page : 0,
      size: params.size !== undefined ? params.size : 10,
      sortBy: params.sortBy || 'createdAt',
      sortDir: params.sortDir || 'desc',
    };

    const response = await apiClient.get<UserProfile[]>(API_CONFIG.ENDPOINTS.PROFILES.LIST, {
      params: queryParams,
    });

    const profiles = response.data || [];
    const rawPag = response.pagination as (PageMetadata & { pageNumber?: number; pageSize?: number; isLast?: boolean }) | undefined;
    const pageNum = rawPag?.pageNumber ?? rawPag?.page ?? (queryParams.page as number);
    const sizeNum = rawPag?.pageSize ?? rawPag?.size ?? (queryParams.size as number);
    const totalElem = rawPag?.totalElements ?? profiles.length;
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
      profiles,
      pagination,
    };
  }

  async getMyProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(API_CONFIG.ENDPOINTS.PROFILES.ME);
    if (!response.data) {
      throw new Error('Data profil pengguna tidak ditemukan.');
    }
    return response.data;
  }

  async updateMyProfile(payload: ProfileUpdateRequest): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(API_CONFIG.ENDPOINTS.PROFILES.ME, payload);
    if (!response.data) {
      throw new Error('Gagal memperbarui data profil.');
    }
    return response.data;
  }

  async updateProfileByUserId(userId: string, payload: ProfileUpdateRequest): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(API_CONFIG.ENDPOINTS.PROFILES.BY_ID(userId), payload);
    if (!response.data) {
      throw new Error('Gagal memperbarui data profil pengguna.');
    }
    return response.data;
  }

  async getProfileByUserId(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(API_CONFIG.ENDPOINTS.PROFILES.BY_ID(userId));
    if (!response.data) {
      throw new Error('Data profil untuk pengguna tersebut tidak ditemukan.');
    }
    return response.data;
  }

  exportProfilesToCSV(profiles: UserProfile[]): string {
    const headers = [
      'ID Profil',
      'User ID',
      'Nama Lengkap',
      'Email',
      'Nomor Telepon',
      'Nomor KTP/Identitas',
      'Jenis Kelamin',
      'Tanggal Lahir',
      'Alamat',
      'Tanggal Terdaftar',
    ];

    const rows = profiles.map((p) => [
      p.id,
      p.userId,
      `"${(p.fullName || '').replace(/"/g, '""')}"`,
      `"${p.email || ''}"`,
      `"${p.phoneNumber || '-'}"`,
      `"${p.idCardNumber || '-'}"`,
      p.gender || '-',
      p.dateOfBirth || '-',
      `"${(p.address || '-').replace(/"/g, '""')}"`,
      p.createdAt ? p.createdAt.split('T')[0] : '-',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const profileService = new ProfileService();
