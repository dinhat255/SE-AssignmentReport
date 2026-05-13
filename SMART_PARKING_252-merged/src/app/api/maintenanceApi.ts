import { apiGet, apiPost, apiPatch } from './client';

export interface MaintenanceIssue {
  id: string;
  spotId?: string;
  title: string;
  description: string;
  type: 'SENSOR' | 'EQUIPMENT' | 'STRUCTURAL' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: number;
  reportedBy?: string;
  reportedAt: string;
  assignedTo?: string;
  estimatedResolutionTime?: string;
  actualResolutionTime?: string;
  attachments?: string[];
  notes?: string;
}

export interface MaintenanceSpot {
  spotId: string;
  zone: string;
  status: 'MAINTENANCE';
  reason?: string;
  startDate: string;
  estimatedEndDate?: string;
  assignedEmployee?: string;
}

export interface MaintenanceStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  averageResolutionTime: number;
  criticalIssues: number;
}

export const maintenanceApi = {
  // Get all issues
  getIssues(params?: {
    status?: string;
    severity?: string;
    spotId?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.severity) searchParams.set('severity', params.severity);
    if (params?.spotId) searchParams.set('spotId', params.spotId);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    return apiGet<{
      issues: MaintenanceIssue[];
      total: number;
      stats: MaintenanceStats;
    }>(`/api/maintenance/issues${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
  },

  // Get single issue
  getIssue(issueId: string) {
    return apiGet<MaintenanceIssue>(`/api/maintenance/issues/${encodeURIComponent(issueId)}`);
  },

  // Create issue
  createIssue(payload: {
    spotId?: string;
    title: string;
    description: string;
    type: 'SENSOR' | 'EQUIPMENT' | 'STRUCTURAL' | 'OTHER';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    attachments?: string[];
  }) {
    return apiPost<MaintenanceIssue>('/api/maintenance/issues', payload);
  },

  // Update issue
  updateIssue(
    issueId: string,
    data: {
      status?: string;
      assignedTo?: string;
      notes?: string;
      actualResolutionTime?: string;
    }
  ) {
    return apiPatch<MaintenanceIssue>(`/api/maintenance/issues/${encodeURIComponent(issueId)}`, data);
  },

  // Assign issue
  assignIssue(issueId: string, employeeId: string) {
    return apiPatch<MaintenanceIssue>(`/api/maintenance/issues/${encodeURIComponent(issueId)}/assign`, {
      assignedTo: employeeId,
    });
  },

  // Close issue
  closeIssue(issueId: string, notes?: string) {
    return apiPatch<MaintenanceIssue>(
      `/api/maintenance/issues/${encodeURIComponent(issueId)}/close`,
      { notes }
    );
  },

  // Mark spot for maintenance
  markSpotMaintenance(payload: {
    spotId: string;
    reason: string;
    estimatedEndDate?: string;
  }) {
    return apiPost<MaintenanceSpot>('/api/maintenance/mark-spot', payload);
  },

  // Get maintenance spots
  getMaintenanceSpots() {
    return apiGet<MaintenanceSpot[]>('/api/maintenance/spots');
  },

  // Get maintenance stats
  getStats() {
    return apiGet<MaintenanceStats>('/api/maintenance/stats');
  },
};
