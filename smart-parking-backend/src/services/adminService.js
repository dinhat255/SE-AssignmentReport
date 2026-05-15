const userRepository = require('../repositories/userRepository');
const parkingSessionRepository = require('../repositories/parkingSessionRepository');
const parkingSpotRepository = require('../repositories/parkingSpotRepository');
const auditRepository = require('../repositories/auditLogRepository');
const paymentRepository = require('../repositories/paymentRepository');

function getDashboard() {
  const users = userRepository.list();
  const sessions = parkingSessionRepository.list();
  const payments = paymentRepository.list();
  const spots = parkingSpotRepository.list();

  return {
    totalUsers: users.length,
    usersByRole: {
      student: users.filter((u) => u.role === 'student').length,
      lecturer: users.filter((u) => u.role === 'lecturer').length,
      employee: users.filter((u) => u.role === 'employee').length,
      admin: users.filter((u) => u.role === 'admin').length,
    },
    totalSessions: sessions.length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    activeSessions: sessions.filter((s) => s.status === 'ACTIVE').length,
    peakHour: calculatePeakHour(sessions),
  };
}

function getUsers(filters) {
  let users = userRepository.list();
  if (filters.role) users = users.filter((u) => u.role === filters.role);
  if (filters.search) {
    const search = filters.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search)
    );
  }
  return users.map((u) => ({ ...u, status: u.status || 'ACTIVE' }));
}

function getUserById(userId) {
  return userRepository.findById(userId);
}

function updateUser(userId, data) {
  const user = userRepository.findById(userId);
  if (!user) return null;
  Object.assign(user, data);
  return user;
}

function disableUser(userId) {
  const user = userRepository.findById(userId);
  if (!user) return null;
  user.status = 'DISABLED';
  return user;
}

function getParkingAnalytics(filters) {
  const spots = parkingSpotRepository.list();
  const sessions = parkingSessionRepository.list();

  const filteredSessions = sessions.filter((s) => {
    if (filters.startDate && s.date < filters.startDate) return false;
    if (filters.endDate && s.date > filters.endDate) return false;
    if (filters.zone && s.slot && !s.slot.startsWith(filters.zone)) return false;
    return true;
  });

  const zoneStats = {};
  spots.forEach((spot) => {
    if (!zoneStats[spot.zone]) {
      zoneStats[spot.zone] = { zone: spot.zone, available: 0, occupied: 0, maintenance: 0 };
    }
    if (spot.status === 'AVAILABLE') zoneStats[spot.zone].available++;
    else if (spot.status === 'OCCUPIED') zoneStats[spot.zone].occupied++;
    else if (spot.status === 'MAINTENANCE') zoneStats[spot.zone].maintenance++;
  });

  return {
    totalSpots: spots.length,
    availableSpots: spots.filter((s) => s.status === 'AVAILABLE').length,
    occupiedSpots: spots.filter((s) => s.status === 'OCCUPIED').length,
    maintenanceSpots: spots.filter((s) => s.status === 'MAINTENANCE').length,
    zoneStats: Object.values(zoneStats),
    peakHours: calculatePeakHours(filteredSessions),
  };
}

function getAuditLogs(params) {
  const logs = auditRepository.list();
  const filtered = logs
    .filter((log) => {
      if (params.action && log.action !== params.action) return false;
      if (params.userId && log.userId !== params.userId) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const paginated = filtered.slice(
    params.offset,
    params.offset + params.limit
  );

  return {
    logs: paginated,
    total: filtered.length,
  };
}

function calculatePeakHour(sessions) {
  const hourCounts = {};
  sessions.forEach((s) => {
    const hour = new Date(s.entryTime).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const peak = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  return peak ? `${peak[0]}:00` : null;
}

function calculatePeakHours(sessions) {
  const hourCounts = {};
  sessions.forEach((s) => {
    const hour = new Date(s.entryTime || `${s.date}T${s.timeIn}:00`).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  return Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), occupancy: count }))
    .sort((a, b) => a.hour - b.hour);
}

module.exports = {
  getDashboard,
  getUsers,
  getUserById,
  updateUser,
  disableUser,
  getParkingAnalytics,
  getAuditLogs,
};
