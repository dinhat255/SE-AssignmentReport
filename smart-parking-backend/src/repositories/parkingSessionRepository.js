const parkingSessions = require('../data/parkingSessions.data');

function list() {
  return parkingSessions;
}

function findActiveByCardId(cardId) {
  return parkingSessions.find((session) => session.cardId === cardId && session.status === 'ACTIVE') || null;
}

function findActiveByUserId(userId) {
  return parkingSessions.find((session) => session.userId === userId && session.status === 'ACTIVE') || null;
}

function findActiveBySessionId(sessionId) {
  return parkingSessions.find((session) => session.sessionId === sessionId && session.status === 'ACTIVE') || null;
}

function findByUserId(userId) {
  return parkingSessions.filter((session) => session.userId === userId);
}

function create(session) {
  parkingSessions.unshift(session);
  return session;
}

function update(sessionId, patch) {
  const session = parkingSessions.find((item) => item.sessionId === sessionId);
  if (!session) return null;
  Object.assign(session, patch);
  return session;
}

module.exports = { list, findActiveByCardId, findActiveByUserId, findActiveBySessionId, findByUserId, create, update };
