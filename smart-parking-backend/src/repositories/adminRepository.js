const adminLogs = require('../data/adminLogs.data');
const users = require('../data/users.data');
const parkingSpots = require('../data/parkingSpots.data');
const parkingSessions = require('../data/parkingSessions.data');
const payments = require('../data/payments.data');

function createAdminLog(action, userId, details) {
  const log = {
    id: `log-${Date.now()}`,
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
  };
  adminLogs.push(log);
  return log;
}

function getAdminLogs(filters = {}) {
  let result = [...adminLogs];

  if (filters.action) {
    result = result.filter((log) => log.action === filters.action);
  }
  if (filters.userId) {
    result = result.filter((log) => log.userId === filters.userId);
  }
  if (filters.startDate && filters.endDate) {
    result = result.filter(
      (log) =>
        new Date(log.timestamp) >= new Date(filters.startDate) &&
        new Date(log.timestamp) <= new Date(filters.endDate)
    );
  }

  return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getDashboardStats() {
  const activeSpots = parkingSpots.filter((s) => s.status === 'OCCUPIED').length;
  const totalSpots = parkingSpots.length;
  const activeSessions = parkingSessions.filter((s) => s.status === 'ACTIVE').length;
  const totalUsers = users.length;
  const studentUsers = users.filter((u) => u.role === 'student').length;
  const lecturerUsers = users.filter((u) => u.role === 'lecturer').length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const employeeUsers = users.filter((u) => u.role === 'employee').length;

  return {
    timestamp: new Date().toISOString(),
    parking: {
      available: totalSpots - activeSpots,
      occupied: activeSpots,
      maintenance: parkingSpots.filter((s) => s.status === 'MAINTENANCE').length,
      total: totalSpots,
      occupancyRate: ((activeSpots / totalSpots) * 100).toFixed(2) + '%',
    },
    sessions: {
      active: activeSessions,
      total: parkingSessions.length,
      completed: parkingSessions.filter((s) => s.status === 'COMPLETED').length,
    },
    users: {
      total: totalUsers,
      student: studentUsers,
      lecturer: lecturerUsers,
      admin: adminUsers,
      employee: employeeUsers,
    },
    revenue: {
      totalFees: parkingSessions.reduce((sum, s) => sum + (s.fee || 0), 0),
      completedPayments: payments.filter((p) => p.status === 'COMPLETED').length,
      totalPayments: payments.length,
    },
  };
}

module.exports = {
  createAdminLog,
  getAdminLogs,
  getDashboardStats,
};
