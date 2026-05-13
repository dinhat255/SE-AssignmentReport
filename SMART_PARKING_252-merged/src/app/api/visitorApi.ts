import { apiGet, apiPost } from './client';

export interface VisitorTicket {
  ticketId: string;
  vehiclePlate: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
  fee: number;
  status: 'ACTIVE' | 'PAID' | 'COMPLETED';
  paymentStatus?: 'PENDING' | 'COMPLETED';
}

export interface VisitorCheckInResponse {
  ticketId: string;
  vehiclePlate: string;
  checkInTime: string;
  estimatedFee?: number;
  status: 'ACTIVE';
}

export interface VisitorCheckOutResponse {
  ticketId: string;
  checkOutTime: string;
  duration: string;
  fee: number;
  status: 'COMPLETED';
  paymentRequired: boolean;
}

export interface VisitorPaymentResponse {
  ticketId: string;
  amount: number;
  paymentStatus: 'COMPLETED';
  paymentMethod: string;
  timestamp: string;
}

export const visitorApi = {
  // Check-in
  checkIn(payload: { vehiclePlate: string; notes?: string }) {
    return apiPost<VisitorCheckInResponse>('/api/visitor/check-in', payload);
  },

  // Check-out
  checkOut(payload: { ticketId: string; notes?: string }) {
    return apiPost<VisitorCheckOutResponse>('/api/visitor/check-out', payload);
  },

  // Get Ticket Details
  getTicket(ticketId: string) {
    return apiGet<VisitorTicket>(`/api/visitor/ticket/${encodeURIComponent(ticketId)}`);
  },

  // Process Payment
  processPayment(payload: { ticketId: string; amount: number; paymentMethod?: string }) {
    return apiPost<VisitorPaymentResponse>('/api/visitor/payment', payload);
  },

  // Check Payment Status
  getPaymentStatus(ticketId: string) {
    return apiGet<{
      ticketId: string;
      paymentStatus: 'PENDING' | 'COMPLETED';
      amount: number;
    }>(`/api/visitor/payment/${encodeURIComponent(ticketId)}/status`);
  },
};
