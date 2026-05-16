const authService = require('../services/authService');
const { success } = require('../utils/response');

function getMe(req, res, next) {
  try {
    success(res, authService.getUserFromRequest(req));
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe };
