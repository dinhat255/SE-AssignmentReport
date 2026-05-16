const adminService = require('../services/adminService');
const { success, error } = require('../utils/response');

async function getDashboard(req, res, next) {
  try {
    const data = adminService.getDashboard();
    success(res, data);
  } catch (err) {
    error(res, err);
  }
}

async function getUsers(req, res, next) {
  try {
    const { role, status, search } = req.query;
    const users = adminService.getUsers({ role, status, search });
    success(res, users);
  } catch (err) {
    error(res, err);
  }
}

async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = adminService.getUserById(userId);
    if (!user) return error(res, new Error('User not found'), 404);
    success(res, user);
  } catch (err) {
    error(res, err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const updated = adminService.updateUser(userId, req.body);
    success(res, updated);
  } catch (err) {
    error(res, err);
  }
}

async function disableUser(req, res, next) {
  try {
    const { userId } = req.params;
    const updated = adminService.disableUser(userId);
    success(res, updated);
  } catch (err) {
    error(res, err);
  }
}

async function getParkingAnalytics(req, res, next) {
  try {
    const { startDate, endDate, zone } = req.query;
    const analytics = adminService.getParkingAnalytics({ startDate, endDate, zone });
    success(res, analytics);
  } catch (err) {
    error(res, err);
  }
}

async function getAuditLogs(req, res, next) {
  try {
    const { limit = 50, offset = 0, action, userId } = req.query;
    const result = adminService.getAuditLogs({
      limit: parseInt(limit),
      offset: parseInt(offset),
      action,
      userId,
    });
    success(res, result);
  } catch (err) {
    error(res, err);
  }
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
