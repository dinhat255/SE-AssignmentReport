const studentService = require('../services/studentService');
const { success } = require('../utils/response');

function getProfile(req, res, next) {
  try {
    success(res, studentService.getProfile(req.query.userId || req.userId));
  } catch (err) {
    next(err);
  }
}

function subscribe(req, res, next) {
  try {
    success(res, studentService.subscribe(req.body), 201);
  } catch (err) {
    next(err);
  }
}

function topup(req, res, next) {
  try {
    success(res, studentService.topup(req.body), 201);
  } catch (err) {
    next(err);
  }
}

function getParkingHistory(req, res, next) {
  try {
    success(res, studentService.getParkingHistory({ ...req.query, userId: req.query.userId || req.userId }));
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, subscribe, topup, getParkingHistory };
