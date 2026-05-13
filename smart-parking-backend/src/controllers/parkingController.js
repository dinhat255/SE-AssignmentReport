const parkingService = require('../services/parkingService');
const zoneService = require('../services/zoneService');
const { success } = require('../utils/response');

function getMap(_req, res, next) {
  try {
    success(res, parkingService.getMap());
  } catch (err) {
    next(err);
  }
}

function getZonesStatus(_req, res, next) {
  try {
    success(res, zoneService.getZonesStatus());
  } catch (err) {
    next(err);
  }
}

function checkIn(req, res, next) {
  try {
    success(res, parkingService.checkIn({ ...req.body, userId: req.body.userId || req.userId }), 201);
  } catch (err) {
    next(err);
  }
}

function checkOut(req, res, next) {
  try {
    success(res, parkingService.checkOut({ ...req.body, userId: req.body.userId || req.userId }));
  } catch (err) {
    next(err);
  }
}

module.exports = { getMap, getZonesStatus, checkIn, checkOut };
