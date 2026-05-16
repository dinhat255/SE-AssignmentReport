import { apiGet, apiPost } from './client';

export interface LecturerQuota {
  userId: string;
  month: number;
  year: number;
  monthlyLimit: number;
  currentUsage: number;
  remaining: number;
}

export const lecturerApi = {
  getProfile() {
    return apiGet('/api/lecturer/profile');
  },
  getQuota(userId?: string) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return apiGet<LecturerQuota>(`/api/lecturer/quota${query}`);
  },
  getEntryHistory(userId?: string) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return apiGet<any[]>(`/api/lecturer/entry-history${query}`);
  },
  getFrequency(userId?: string) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return apiGet<{ month: string; count: number }[]>(`/api/lecturer/frequency${query}`);
  },
  purchaseQuota(payload: { userId?: string; quantity: number; paymentToken?: string }) {
    return apiPost('/api/lecturer/quota/purchase', payload);
  },
};
