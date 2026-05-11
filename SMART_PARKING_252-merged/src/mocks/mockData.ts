// Central mock data layer for frontend - backend can implement matching endpoints later.
// All functions intentionally return Promises and simulate small network delay.

export type LoginFreq = { month: string; count: number };
export type MaintenanceIssue = {
  id: string;
  zone: string;
  spot: string;
  sensor: string;
  issueType: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'pending' | 'in-progress' | 'resolved';
  reportedAt: string;
  description: string;
  resolvedAt?: string;
  resolvedBy?: string;
  reportedBy?: string;
  attachments?: string[];
};

const wait = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export async function getLoginFrequency(_opts?: { period?: string; role?: string }): Promise<LoginFreq[]> {
  await wait(200);
  return [
    { month: '11/2025', count: 12 },
    { month: '12/2025', count: 18 },
    { month: '01/2026', count: 25 },
    { month: '02/2026', count: 22 },
    { month: '03/2026', count: 15 },
  ];
}

export async function getEntryHistory(_opts?: { role?: string; page?: number; limit?: number }) {
  await wait(150);
  return [
    { date: '10/04', timeIn: '07:45 AM', timeOut: '04:30 PM', type: 'in' },
    { date: '10/04', timeIn: '04:30 PM', timeOut: '-', type: 'out' },
    { date: '09/04', timeIn: '08:10 AM', timeOut: '05:00 PM', type: 'in' },
    { date: '09/04', timeIn: '05:00 PM', timeOut: '-', type: 'out' },
    { date: '08/04', timeIn: '07:50 AM', timeOut: '04:15 PM', type: 'in' },
  ];
}

export async function getMaintenanceIssues(): Promise<MaintenanceIssue[]> {
  await wait(250);
  return [
    {
      id: 'M001',
      zone: 'A',
      spot: 'A04',
      sensor: 'SENSOR-A04-001',
      issueType: 'Không phát hiện xe',
      severity: 'critical',
      status: 'pending',
      reportedAt: '2026-04-08 08:15',
      description: 'Cảm biến không phát hiện xe mặc dù có xe đậu tại vị trí này',
      reportedBy: 'Hệ thống',
    },
    {
      id: 'M002',
      zone: 'B',
      spot: 'B07',
      sensor: 'SENSOR-B07-002',
      issueType: 'Sai lệch khoảng cách',
      severity: 'warning',
      status: 'in-progress',
      reportedAt: '2026-04-08 07:30',
      description: 'Cảm biến báo khoảng cách không chính xác',
      reportedBy: 'Hệ thống',
    },
  ];
}

export async function getHistory(page = 1, limit = 5) {
  await wait(200);
  const all = [
    { date: '10/04/2026', timeIn: '08:00 AM', timeOut: '-', slot: 'A04', duration: '-', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '09/04/2026', timeIn: '08:10 AM', timeOut: '05:15 PM', slot: 'A04', duration: '9h 5m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '08/04/2026', timeIn: '07:45 AM', timeOut: '04:30 PM', slot: 'B07', duration: '8h 45m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '07/04/2026', timeIn: '08:20 AM', timeOut: '05:00 PM', slot: 'C02', duration: '8h 40m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '06/04/2026', timeIn: '08:05 AM', timeOut: '12:00 PM', slot: 'A10', duration: '3h 55m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '05/04/2026', timeIn: '09:00 AM', timeOut: '06:30 PM', slot: 'D05', duration: '9h 30m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '04/04/2026', timeIn: '07:30 AM', timeOut: '04:00 PM', slot: 'B03', duration: '8h 30m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
    { date: '03/04/2026', timeIn: '08:15 AM', timeOut: '05:45 PM', slot: 'A07', duration: '9h 30m', cardType: 'Thẻ tháng', fee: '-', status: 'active' },
  ];

  const start = (page - 1) * limit;
  const pageItems = all.slice(start, start + limit);
  return { data: pageItems, total: all.length };
}

export async function getParkingMap() {
  await wait(200);
  const rows = ['A', 'B', 'C', 'D'];
  const cols = 10;
  return rows.map(() => Array.from({ length: cols }, () => (Math.random() > 0.3 ? 'available' : 'full')));
}

export async function postMaintenanceReport(payload: any) {
  await wait(300);
  // return created id or success
  return { success: true, id: `M${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}` };
}
