const paymentService = require('../services/paymentService');
const { success } = require('../utils/response');

function createBkpayQr(req, res, next) {
  try {
    success(res, paymentService.createBkpayQr(req.body), 201);
  } catch (err) {
    next(err);
  }
}

function getStatus(req, res, next) {
  try {
    success(res, paymentService.getStatus(req.params.qrToken));
  } catch (err) {
    next(err);
  }
}

function confirm(req, res, next) {
  try {
    success(res, paymentService.confirm(req.params.qrToken));
  } catch (err) {
    next(err);
  }
}

module.exports = { createBkpayQr, getStatus, confirm };
