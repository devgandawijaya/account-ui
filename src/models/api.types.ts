/**
 * Standard Backend Envelope Types
 * Matches Spring Boot ApiResponse structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: PageMetadata;
  timestamp: string;
}

export interface PageMetadata {
  page: number;
  size: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
  isLast?: boolean;
}

export class ApiError extends Error {
  public statusCode?: number;
  public errors?: string[];
  public timestamp?: string;

  constructor(message: string, statusCode?: number, errors?: string[], timestamp?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.timestamp = timestamp;
  }
}
