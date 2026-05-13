const employeeService = require('../services/employeeService');
const parkingService = require('../services/parkingService');
const { success, error } = require('../utils/response');

async function getProfile(req, res, next) {
  try {
    const userId = req.user?.id;
    const profile = employeeService.getProfile(userId);
    success(res, profile);
  } catch (err) {
    error(res, err);
  }
}

async function getParkingStatus(req, res, next) {
  try {
    const status = parkingService.getMap();
    success(res, status);
  } catch (err) {
    error(res, err);
  }
}

async function manualCheckIn(req, res, next) {
  try {
    const result = parkingService.checkIn(req.body);
    success(res, result);
  } catch (err) {
    error(res, err);
  }
}

async function manualCheckOut(req, res, next) {
  try {
    const result = parkingService.checkOut(req.body);
    success(res, result);
  } catch (err) {
    error(res, err);
  }
}

async function getIncidents(req, res, next) {
  try {
    const { status, spotId, limit = 20, offset = 0 } = req.query;
    const result = employeeService.getIncidents({
      status,
      spotId,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    success(res, result);
  } catch (err) {
    error(res, err);
  }
}

async function createIncident(req, res, next) {
  try {
    const userId = req.user?.id;
    const incident = employeeService.createIncident(userId, req.body);
    success(res, incident);
  } catch (err) {
    error(res, err);
  }
}

async function updateIncidentStatus(req, res, next) {
  try {
    const { incidentId } = req.params;
    const { status } = req.body;
    const updated = employeeService.updateIncidentStatus(incidentId, status);
    success(res, updated);
  } catch (err) {
    error(res, err);
  }
}

async function getShiftInfo(req, res, next) {
  try {
    const userId = req.user?.id;
    const { date } = req.query;
    const shift = employeeService.getShiftInfo(userId, date);
    success(res, shift);
  } catch (err) {
    error(res, err);
  }
}

module.exports = {
  getProfile,
  getParkingStatus,
  manualCheckIn,
  manualCheckOut,
  getIncidents,
  createIncident,
  updateIncidentStatus,
  getShiftInfo,
};
