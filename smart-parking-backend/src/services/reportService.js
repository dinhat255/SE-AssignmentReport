const parkingSessionRepository = require('../repositories/parkingSessionRepository');
const paymentRepository = require('../repositories/paymentRepository');
const parkingSpotRepository = require('../repositories/parkingSpotRepository');
const userRepository = require('../repositories/userRepository');
const { dateOnly } = require('../utils/time');

function getParkingReport(startDate, endDate) {
  const sessions = parkingSessionRepository.list();
  const filtered = sessions.filter((s) => {
    const sessionDate = s.date || (s.entryTime ? s.entryTime.split('T')[0] : null);
    return sessionDate && sessionDate >= startDate && sessionDate <= endDate;
  });
  
  return {
    period: { startDate, endDate },
    totalSessions: filtered.length,
    completedSessions: filtered.filter((s) => s.status === 'COMPLETED').length,
    activeSessions: filtered.filter((s) => s.status === 'ACTIVE').length,
    byZone: groupByZone(filtered),
    byHour: groupByHour(filtered),
  };
}

function getRevenueReport(startDate, endDate) {
  const sessions = parkingSessionRepository.list();
  const payments = paymentRepository.list();
  
  const filteredSessions = sessions.filter((s) => {
    const sessionDate = s.date || (s.entryTime ? s.entryTime.split('T')[0] : null);
    return sessionDate && sessionDate >= startDate && sessionDate <= endDate;
  });
  
  const filteredPayments = payments.filter((p) => {
    const paymentDate = p.createdAt ? p.createdAt.split('T')[0] : null;
    return paymentDate && paymentDate >= startDate && paymentDate <= endDate;
  });
  
  const visitorFees = filteredSessions
    .filter((s) => s.cardType === 'Visitor' && s.fee)
    .reduce((sum, s) => sum + s.fee, 0);
  
  const paymentAmount = filteredPayments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  
  return {
    period: { startDate, endDate },
    totalRevenue: visitorFees + paymentAmount,
    visitorFees,
    paymentRevenue: paymentAmount,
    transactionCount: filteredPayments.length,
    averageTransaction: filteredPayments.length > 0 ? paymentAmount / filteredPayments.length : 0,
  };
}

function getOccupancyReport(startDate, endDate) {
  const sessions = parkingSessionRepository.list();
  const spots = parkingSpotRepository.list();
  
  const filtered = sessions.filter((s) => {
    const sessionDate = s.date || (s.entryTime ? s.entryTime.split('T')[0] : null);
    return sessionDate && sessionDate >= startDate && sessionDate <= endDate;
  });
  
  const totalSpots = spots.length;
  const occupiedSpots = spots.filter((s) => s.status === 'OCCUPIED').length;
  const maintenanceSpots = spots.filter((s) => s.status === 'MAINTENANCE').length;
  const availableSpots = spots.filter((s) => s.status === 'AVAILABLE').length;
  
  return {
    period: { startDate, endDate },
    currentOccupancy: {
      total: totalSpots,
      occupied: occupiedSpots,
      available: availableSpots,
      maintenance: maintenanceSpots,
      occupancyRate: totalSpots > 0 ? ((occupiedSpots / totalSpots) * 100).toFixed(2) : 0,
    },
    peakHours: calculatePeakHours(filtered),
    byZone: groupZoneOccupancy(spots),
  };
}

function getUserActivityReport(startDate, endDate) {
  const sessions = parkingSessionRepository.list();
  const users = userRepository.list();
  
  const filtered = sessions.filter((s) => {
    const sessionDate = s.date || (s.entryTime ? s.entryTime.split('T')[0] : null);
    return sessionDate && sessionDate >= startDate && sessionDate <= endDate;
  });
  
  const byRole = {};
  users.forEach((u) => {
    byRole[u.role] = 0;
  });
  
  filtered.forEach((s) => {
    const user = users.find((u) => u.id === s.userId);
    if (user && byRole.hasOwnProperty(user.role)) {
      byRole[user.role]++;
    }
  });
  
  return {
    period: { startDate, endDate },
    totalSessions: filtered.length,
    totalUsers: users.length,
    byRole,
    topUsers: getTopUsers(filtered, users, 5),
  };
}

function generateCombinedReport(startDate, endDate) {
  return {
    period: { startDate, endDate },
    parking: getParkingReport(startDate, endDate),
    revenue: getRevenueReport(startDate, endDate),
    occupancy: getOccupancyReport(startDate, endDate),
    activity: getUserActivityReport(startDate, endDate),
  };
}

// Helper functions
function groupByZone(sessions) {
  const zones = {};
  sessions.forEach((s) => {
    const zone = s.slot ? s.slot.charAt(0) : 'UNKNOWN';
    zones[zone] = (zones[zone] || 0) + 1;
  });
  return zones;
}

function groupByHour(sessions) {
  const hours = {};
  sessions.forEach((s) => {
    const hour = s.timeIn ? s.timeIn.split(':')[0] : 'UNKNOWN';
    hours[hour] = (hours[hour] || 0) + 1;
  });
  return hours;
}

function groupZoneOccupancy(spots) {
  const zones = {};
  spots.forEach((spot) => {
    if (!zones[spot.zone]) {
      zones[spot.zone] = { total: 0, occupied: 0, available: 0, maintenance: 0 };
    }
    zones[spot.zone].total++;
    if (spot.status === 'OCCUPIED') zones[spot.zone].occupied++;
    else if (spot.status === 'AVAILABLE') zones[spot.zone].available++;
    else if (spot.status === 'MAINTENANCE') zones[spot.zone].maintenance++;
  });
  
  Object.keys(zones).forEach((zone) => {
    const z = zones[zone];
    z.occupancyRate = z.total > 0 ? ((z.occupied / z.total) * 100).toFixed(2) : 0;
  });
  
  return zones;
}

function calculatePeakHours(sessions) {
  const hours = groupByHour(sessions);
  return Object.entries(hours)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => ({ hour: `${hour}:00`, sessions: count }));
}

function getTopUsers(sessions, users, limit = 5) {
  const userCount = {};
  sessions.forEach((s) => {
    userCount[s.userId] = (userCount[s.userId] || 0) + 1;
  });
  
  return Object.entries(userCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([userId, count]) => {
      const user = users.find((u) => u.id === userId);
      return {
        userId,
        fullName: user?.fullName || 'Unknown',
        role: user?.role || 'unknown',
        sessionCount: count,
      };
    });
}

module.exports = {
  getParkingReport,
  getRevenueReport,
  getOccupancyReport,
  getUserActivityReport,
  generateCombinedReport,
};
