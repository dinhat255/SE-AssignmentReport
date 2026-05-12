const payments = require('../data/payments.data');

function create(payment) {
  payments.unshift(payment);
  return payment;
}

function findByToken(qrToken) {
  return payments.find((payment) => payment.qrToken === qrToken) || null;
}

function update(qrToken, patch) {
  const payment = findByToken(qrToken);
  if (!payment) return null;
  Object.assign(payment, patch);
  return payment;
}

function list() {
  return payments;
}

module.exports = { create, findByToken, update, list };
