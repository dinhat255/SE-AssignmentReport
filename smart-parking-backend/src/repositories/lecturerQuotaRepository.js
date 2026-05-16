const lecturerQuotas = require('../data/lecturerQuotas.data');

function findByUserId(userId) {
  return lecturerQuotas.find((quota) => quota.userId === userId) || null;
}

function findByUserIdAndMonth(userId, month, year) {
  return lecturerQuotas.find((quota) =>
    quota.userId === userId &&
    Number(quota.month) === Number(month) &&
    Number(quota.year) === Number(year)
  ) || null;
}

function create(quota) {
  lecturerQuotas.unshift(quota);
  return quota;
}

function update(userId, patch) {
  const quota = findByUserId(userId);
  if (!quota) return null;
  Object.assign(quota, patch);
  return quota;
}

function list() {
  return lecturerQuotas;
}

module.exports = { findByUserId, findByUserIdAndMonth, create, update, list };
