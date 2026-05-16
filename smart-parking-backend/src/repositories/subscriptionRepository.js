const subscriptions = require('../data/subscriptions.data');

function findActiveByUserId(userId) {
  return subscriptions.find((item) => item.userId === userId && item.status === 'ACTIVE') || null;
}

function findActiveByUserIdAndMonth(userId, month, year) {
  return subscriptions.find((item) =>
    item.userId === userId &&
    item.status === 'ACTIVE' &&
    Number(item.month) === Number(month) &&
    Number(item.year) === Number(year)
  ) || null;
}

function create(subscription) {
  subscriptions.unshift(subscription);
  return subscription;
}

function update(id, patch) {
  const subscription = subscriptions.find((item) => item.id === id);
  if (!subscription) return null;
  Object.assign(subscription, patch);
  return subscription;
}

function list() {
  return subscriptions;
}

module.exports = { findActiveByUserId, findActiveByUserIdAndMonth, create, update, list };
