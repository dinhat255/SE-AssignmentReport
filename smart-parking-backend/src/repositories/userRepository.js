const users = require('../data/users.data');

function sanitize(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
}

function findById(id) {
  return users.find((user) => user.id === id) || null;
}

function findByCardId(cardId) {
  return users.find((user) => user.cardId === cardId) || null;
}

function update(id, patch) {
  const user = findById(id);
  if (!user) return null;
  Object.assign(user, patch);
  return user;
}

function list() {
  return users.map(sanitize);
}

module.exports = { findByEmail, findById, findByCardId, update, list, sanitize };
