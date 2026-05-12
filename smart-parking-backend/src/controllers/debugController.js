const { resetData } = require('../data/seed');
const users = require('../data/users.data');
const parkingSpots = require('../data/parkingSpots.data');
const parkingSessions = require('../data/parkingSessions.data');
const subscriptions = require('../data/subscriptions.data');
const lecturerQuotas = require('../data/lecturerQuotas.data');
const payments = require('../data/payments.data');
const auditLogs = require('../data/auditLogs.data');
const { success } = require('../utils/response');

function state(_req, res) {
  success(res, {
    users: users.length,
    parkingSpots: parkingSpots.length,
    activeSessions: parkingSessions.filter((session) => session.status === 'ACTIVE').length,
    subscriptions: subscriptions.length,
    lecturerQuotas: lecturerQuotas.length,
    payments: payments.length,
    auditLogs: auditLogs.length,
    latestAuditLogs: auditLogs.slice(0, 5),
  });
}

function reset(_req, res) {
  resetData();
  state(_req, res);
}

module.exports = { state, reset };
