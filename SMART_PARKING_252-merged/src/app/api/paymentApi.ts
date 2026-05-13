import { apiGet, apiPost, type ApiRole } from './client';

export interface CreateBkpayQrRequest {
  amount: number;
  role: ApiRole;
  context:
    | { type: 'STUDENT_SUBSCRIPTION'; userId?: string }
    | { type: 'LECTURER_QUOTA_PURCHASE'; userId?: string; quantity?: number }
    | { type: string; userId?: string; [key: string]: unknown };
  expiresInSeconds: number;
}

export interface CreateBkpayQrResponse {
  qrImageUrl?: string;
  qrCodeBase64?: string;
  qrToken?: string;
  expiresInSeconds?: number;
}

export const paymentApi = {
  createBkpayQr(payload: CreateBkpayQrRequest) {
    return apiPost<CreateBkpayQrResponse, CreateBkpayQrRequest>('/api/payments/bkpay/qr', payload);
  },
  getStatus(qrToken: string) {
    return apiGet(`/api/payments/${encodeURIComponent(qrToken)}/status`);
  },
  confirm(qrToken: string) {
    return apiPost(`/api/payments/${encodeURIComponent(qrToken)}/confirm`);
  },
};
