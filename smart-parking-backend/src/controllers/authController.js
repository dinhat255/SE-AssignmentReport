const authService = require('../services/authService');
const { success } = require('../utils/response');

function login(req, res, next) {
  try {
    success(res, authService.login(req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
