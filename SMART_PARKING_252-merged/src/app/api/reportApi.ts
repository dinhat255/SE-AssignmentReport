import { apiGet, apiPost } from './client';

export interface ParkingReport {
  period: { startDate: string; endDate: string };
  totalSessions: number;
  totalDuration: string;
  averageDuration: string;
  peakHours: Array<{ hour: number; sessions: number }>;
  zoneStats: Array<{
    zone: string;
    sessions: number;
    averageOccupancy: number;
  }>;
}

export interface RevenueReport {
  period: { startDate: string; endDate: string };
  totalRevenue: number;
  revenueByType: {
    visitorFees: number;
    subscriptionFees: number;
    quotaPurchases: number;
  };
  dailyRevenue: Array<{ date: string; amount: number }>;
  paymentMethods: Record<string, number>;
}

export interface OccupancyReport {
  period: { startDate: string; endDate: string };
  averageOccupancy: number;
  peakOccupancy: number;
  lowOccupancy: number;
  hourlyOccupancy: Array<{ hour: number; occupancy: number }>;
  zoneOccupancy: Array<{
    zone: string;
    average: number;
    peak: number;
  }>;
}

export interface UserActivityReport {
  period: { startDate: string; endDate: string };
  totalActiveUsers: number;
  usersByRole: {
    student: number;
    lecturer: number;
    employee: number;
    visitor: number;
  };
  topUsers: Array<{
    userId: string;
    userName: string;
    sessions: number;
    totalDuration: string;
  }>;
  newUsers: number;
}

export interface ReportSummary {
  parking: ParkingReport;
  revenue: RevenueReport;
  occupancy: OccupancyReport;
  userActivity: UserActivityReport;
  generatedAt: string;
}

export const reportApi = {
  // Parking Report
  getParkingReport(params: { startDate: string; endDate: string; zone?: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set('startDate', params.startDate);
    searchParams.set('endDate', params.endDate);
    if (params.zone) searchParams.set('zone', params.zone);
    return apiGet<ParkingReport>(
      `/api/reports/parking?${searchParams.toString()}`
    );
  },

  // Revenue Report
  getRevenueReport(params: { startDate: string; endDate: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set('startDate', params.startDate);
    searchParams.set('endDate', params.endDate);
    return apiGet<RevenueReport>(
      `/api/reports/revenue?${searchParams.toString()}`
    );
  },

  // Occupancy Report
  getOccupancyReport(params: { startDate: string; endDate: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set('startDate', params.startDate);
    searchParams.set('endDate', params.endDate);
    return apiGet<OccupancyReport>(
      `/api/reports/occupancy?${searchParams.toString()}`
    );
  },

  // User Activity Report
  getUserActivityReport(params: { startDate: string; endDate: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set('startDate', params.startDate);
    searchParams.set('endDate', params.endDate);
    return apiGet<UserActivityReport>(
      `/api/reports/user-activity?${searchParams.toString()}`
    );
  },

  // Combined Report Summary
  getReportSummary(params: { startDate: string; endDate: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set('startDate', params.startDate);
    searchParams.set('endDate', params.endDate);
    return apiGet<ReportSummary>(
      `/api/reports/summary?${searchParams.toString()}`
    );
  },

  // Export Report
  exportReport(params: {
    type: 'parking' | 'revenue' | 'occupancy' | 'user-activity';
    format: 'csv' | 'pdf';
    startDate: string;
    endDate: string;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.set('type', params.type);
    searchParams.set('format', params.format);
    searchParams.set('startDate', params.startDate);
    searchParams.set('endDate', params.endDate);
    return apiGet(
      `/api/reports/export?${searchParams.toString()}`
    );
  },
};
