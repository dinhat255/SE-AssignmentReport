const lecturerService = require('../services/lecturerService');
const { success } = require('../utils/response');

function getProfile(req, res, next) {
  try {
    success(res, lecturerService.getProfile(req.query.userId || req.userId));
  } catch (err) {
    next(err);
  }
}

function getQuota(req, res, next) {
  try {
    success(res, lecturerService.getQuota(req.query.userId || req.userId));
  } catch (err) {
    next(err);
  }
}

function getEntryHistory(req, res, next) {
  try {
    success(res, lecturerService.getEntryHistory(req.query.userId || req.userId));
  } catch (err) {
    next(err);
  }
}

function getFrequency(req, res, next) {
  try {
    success(res, lecturerService.getFrequency(req.query.userId || req.userId));
  } catch (err) {
    next(err);
  }
}

function purchaseQuota(req, res, next) {
  try {
    success(res, lecturerService.purchaseQuota(req.body), 201);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, getQuota, getEntryHistory, getFrequency, purchaseQuota };
