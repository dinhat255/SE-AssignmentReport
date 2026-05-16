import { apiGet, apiPost } from './client';

export interface StudentProfile {
  walletBalance?: number;
  subscription?: {
    status?: string;
    validTo?: string;
    expiresAt?: string;
  };
}

export interface StudentHistoryEntry {
  sessionId?: string;
  date: string;
  timeIn: string;
  timeOut: string;
  slot: string;
  duration: string;
  fee: number | string;
  status: string;
  cardType?: string;
}

export interface StudentHistoryResponse {
  data: StudentHistoryEntry[];
  total: number;
  page?: number;
  limit?: number;
}

export const studentApi = {
  getProfile() {
    return apiGet<StudentProfile>('/api/student/profile');
  },
  subscribe(payload: { userId?: string; month: number; year: number; paymentToken?: string }) {
    return apiPost('/api/student/subscribe', payload);
  },
  topup(payload: { userId?: string; amount: number }) {
    return apiPost('/api/student/topup', payload);
  },
  getParkingHistory(userId: string | undefined, page: number, limit: number) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (userId) params.set('userId', userId);
    return apiGet<StudentHistoryResponse>(`/api/student/parking-history?${params.toString()}`);
  },
};
