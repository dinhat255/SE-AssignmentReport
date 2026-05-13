const reportService = require('../services/reportService');
const { success, error } = require('../utils/response');

async function getParkingReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return error(res, new Error('startDate and endDate are required'));
    }
    const report = reportService.getParkingReport(startDate, endDate);
    success(res, report);
  } catch (err) {
    error(res, err);
  }
}

async function getRevenueReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return error(res, new Error('startDate and endDate are required'));
    }
    const report = reportService.getRevenueReport(startDate, endDate);
    success(res, report);
  } catch (err) {
    error(res, err);
  }
}

async function getOccupancyReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return error(res, new Error('startDate and endDate are required'));
    }
    const report = reportService.getOccupancyReport(startDate, endDate);
    success(res, report);
  } catch (err) {
    error(res, err);
  }
}

async function getUserActivityReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return error(res, new Error('startDate and endDate are required'));
    }
    const report = reportService.getUserActivityReport(startDate, endDate);
    success(res, report);
  } catch (err) {
    error(res, err);
  }
}

async function getCombinedReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return error(res, new Error('startDate and endDate are required'));
    }
    const report = reportService.generateCombinedReport(startDate, endDate);
    success(res, report);
  } catch (err) {
    error(res, err);
  }
}

module.exports = {
  getParkingReport,
  getRevenueReport,
  getOccupancyReport,
  getUserActivityReport,
  getCombinedReport,
};
