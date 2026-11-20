export type ActivitySeverity = 'info' | 'warning' | 'critical';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  category: 'AUTH' | 'USER_MANAGEMENT' | 'SECURITY' | 'SETTINGS';
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: ActivitySeverity;
}

export interface ActivityFilter {
  search?: string;
  category?: string;
  severity?: string;
  page: number;
  pageSize: number;
}
