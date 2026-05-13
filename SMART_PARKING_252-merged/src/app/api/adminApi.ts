import { apiGet, apiPost, apiPatch, type ApiRole } from './client';

export interface AdminDashboardStats {
  totalUsers: number;
  usersByRole: {
    student: number;
    lecturer: number;
    employee: number;
    admin: number;
  };
  totalSessions: number;
  totalRevenue: number;
  activeSessions: number;
  peakHour?: string;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  role: ApiRole;
  department?: string;
  cardId?: string;
  vehiclePlate?: string;
  phone?: string;
  status?: 'ACTIVE' | 'DISABLED';
}

export interface ParkingAnalytics {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  maintenanceSpots: number;
  zoneStats: Array<{
    zone: string;
    available: number;
    occupied: number;
    maintenance: number;
  }>;
  peakHours: Array<{
    hour: number;
    occupancy: number;
  }>;
}

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  details?: Record<string, any>;
}

export const adminApi = {
  // Dashboard
  getDashboard() {
    return apiGet<AdminDashboardStats>('/api/admin/dashboard');
  },

  // User Management
  getUsers(filters?: { role?: ApiRole; status?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.role) params.set('role', filters.role);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    return apiGet<UserInfo[]>(`/api/admin/users${params.toString() ? '?' + params.toString() : ''}`);
  },

  getUserById(userId: string) {
    return apiGet<UserInfo>(`/api/admin/users/${encodeURIComponent(userId)}`);
  },

  updateUser(userId: string, data: Partial<UserInfo>) {
    return apiPatch<UserInfo>(`/api/admin/users/${encodeURIComponent(userId)}`, data);
  },

  disableUser(userId: string) {
    return apiPatch<UserInfo>(`/api/admin/users/${encodeURIComponent(userId)}/disable`, {});
  },

  // Parking Analytics
  getParkingAnalytics(params?: { startDate?: string; endDate?: string; zone?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    if (params?.zone) searchParams.set('zone', params.zone);
    return apiGet<ParkingAnalytics>(
      `/api/admin/parking/analytics${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    );
  },

  // Audit Logs
  getAuditLogs(params?: { limit?: number; offset?: number; action?: string; userId?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.action) searchParams.set('action', params.action);
    if (params?.userId) searchParams.set('userId', params.userId);
    return apiGet<{
      logs: AuditLog[];
      total: number;
    }>(`/api/admin/audit-logs${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
  },
};
