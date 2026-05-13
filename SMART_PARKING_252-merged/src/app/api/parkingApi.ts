import { apiGet, apiPost } from './client';

export type ParkingSpotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'UNKNOWN';

export interface ParkingSpotDto {
  id: string;
  zone: string;
  status: ParkingSpotStatus;
  sensorId?: string;
  occupiedByCurrentUser?: boolean;
}

export interface ParkingMapResponse {
  updatedAt: string;
  summary?: {
    available: number;
    occupied: number;
    total: number;
  };
  spots: ParkingSpotDto[];
}

export const parkingApi = {
  getMap() {
    return apiGet<ParkingMapResponse>('/api/parking/map');
  },
  getZonesStatus() {
    return apiGet('/api/parking/zones/status');
  },
  checkIn(payload: { cardId?: string; userId?: string; vehiclePlate?: string; visitorCardId?: string }) {
    return apiPost<{ sessionId?: string; assignedSlot?: string; timeIn?: string }, typeof payload>('/api/parking/check-in', payload);
  },
  checkOut(payload: { sessionId?: string; cardId?: string; visitorCardId?: string }) {
    return apiPost<{ sessionId?: string; timeOut?: string; fee?: number }, typeof payload>('/api/parking/check-out', payload);
  },
};
