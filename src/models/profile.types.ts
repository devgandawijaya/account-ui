import { PageMetadata } from './api.types';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  idCardNumber: string | null;
  bio: string | null;
  avatarUrl: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProfileUpdateRequest {
  phoneNumber?: string | null;
  idCardNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
}

export interface ProfileFilterParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedProfiles {
  profiles: UserProfile[];
  pagination: PageMetadata;
}
