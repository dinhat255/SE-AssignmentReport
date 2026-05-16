const authService = require('../services/authService');

function mockAuth(req, _res, next) {
  req.userId = authService.userIdFromToken(req.headers.authorization) || req.query.userId || null;
  next();
}

module.exports = mockAuth;
