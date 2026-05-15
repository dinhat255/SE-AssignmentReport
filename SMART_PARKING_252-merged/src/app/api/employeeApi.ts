import { apiGet, apiPost, apiPatch } from './client';

export interface EmployeeProfile {
  id: string;
  fullName: string;
  email: string;
  department: string;
  phone?: string;
  shiftStart?: string;
  shiftEnd?: string;
}

export interface ParkingStatusSummary {
  updatedAt: string;
  totalSpots: number;
  available: number;
  occupied: number;
  maintenance: number;
  zones: Array<{
    zone: string;
    available: number;
    occupied: number;
    maintenance: number;
  }>;
}

export interface CheckInOutResponse {
  sessionId: string;
  userId: string;
  assignedSlot?: string;
  timeIn?: string;
  timeOut?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface ParkingIncident {
  id: string;
  type: string;
  spotId?: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  reportedAt: string;
  reportedBy?: string;
  resolvedAt?: string;
  attachments?: string[];
}

export interface EmployeeShiftInfo {
  employeeId: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  duties: string[];
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export const employeeApi = {
  // Profile
  getProfile() {
    return apiGet<EmployeeProfile>('/api/employee/profile');
  },

  // Real-time Parking Status
  getParkingStatus() {
    return apiGet<ParkingStatusSummary>('/api/employee/parking/status');
  },

  // Manual Check-in (Gate Operator)
  manualCheckIn(payload: {
    vehiclePlate?: string;
    cardId?: string;
    visitorCardId?: string;
    notes?: string;
  }) {
    return apiPost<CheckInOutResponse>('/api/employee/manual-checkin', payload);
  },

  // Manual Check-out (Gate Operator)
  manualCheckOut(payload: {
    sessionId?: string;
    cardId?: string;
    notes?: string;
  }) {
    return apiPost<CheckInOutResponse>('/api/employee/manual-checkout', payload);
  },

  // Incidents Management
  getIncidents(params?: { status?: string; spotId?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.spotId) searchParams.set('spotId', params.spotId);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    return apiGet<{
      incidents: ParkingIncident[];
      total: number;
    }>(`/api/employee/incidents${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
  },

  createIncident(payload: {
    type: string;
    spotId?: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    return apiPost<ParkingIncident>('/api/employee/incidents', payload);
  },

  updateIncidentStatus(incidentId: string, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') {
    return apiPatch<ParkingIncident>(`/api/employee/incidents/${encodeURIComponent(incidentId)}`, {
      status,
    });
  },

  // Shift Info
  getShiftInfo(date?: string) {
    const params = date ? `?date=${encodeURIComponent(date)}` : '';
    return apiGet<EmployeeShiftInfo>(`/api/employee/shift${params}`);
  },
};
