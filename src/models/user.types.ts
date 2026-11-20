import { PageMetadata } from './api.types';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | string;

export interface AppUser {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  hasProfile: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  // Data Profil Personal
  profileId?: string;
  phoneNumber?: string | null;
  idCardNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

export interface AdminCreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  phoneNumber?: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface AdminUpdateUserRequest {
  fullName: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string | null;
  idCardNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

export interface AdminUpdateStatusRequest {
  isActive: boolean;
}

export interface UserFilterParams {
  page?: number;
  size?: number;
  sortBy?: 'createdAt' | 'fullName' | 'email' | string;
  sortDir?: 'asc' | 'desc';
  keyword?: string;
  role?: string;
  isActive?: boolean;
}

export interface PaginatedUsers {
  users: AdminUserItem[];
  pagination: PageMetadata;
}
