const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/userRepository');
const ssoService = require('./ssoService');
const dataCoreService = require('./dataCoreService');
const auditService = require('./auditService');

function buildToken(userId) {
  return `mock-token:${userId}`;
}

function parseToken(token) {
  if (!token) return null;
  if (token.startsWith('Bearer ')) return token.slice('Bearer '.length);
  return token;
}

function userIdFromToken(authHeader) {
  const token = parseToken(authHeader);
  if (!token?.startsWith('mock-token:')) return null;
  return token.split(':')[1] || null;
}

function login({ email, password, provider }) {
  ssoService.normalizeProvider(provider);
  const user = userRepository.findByEmail(email);
  if (!user || user.password !== password) {
    auditService.log('LOGIN_FAILED', null, { email });
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  auditService.log('LOGIN_SUCCESS', user.id, { email: user.email });
  return {
    accessToken: buildToken(user.id),
    user: dataCoreService.enrichUser(userRepository.sanitize(user)),
  };
}

function getUserFromRequest(req) {
  const hasAuthHeader = Boolean(req.headers.authorization);
  const userId = userIdFromToken(req.headers.authorization) || req.query.userId;
  if (hasAuthHeader && !userId) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid authorization token');
  }
  if (!userId) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authorization token or userId is required');
  }
  const user = userRepository.findById(userId);
  if (!user) throw new ApiError(401, 'UNAUTHORIZED', 'User not found for authorization token');
  return userRepository.sanitize(user);
}

module.exports = { login, getUserFromRequest, userIdFromToken };
