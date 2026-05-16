const subscriptionRepository = require('../repositories/subscriptionRepository');
const parkingSessionRepository = require('../repositories/parkingSessionRepository');
const userRepository = require('../repositories/userRepository');
const paymentRepository = require('../repositories/paymentRepository');
const auditService = require('./auditService');
const ApiError = require('../utils/ApiError');
const { currentMonthYear, monthRange } = require('../utils/time');

const STUDENT_MONTHLY_PRICE = 50000;

function resolveStudent(userId = 'u-student-001') {
  const user = userRepository.findById(userId);
  if (!user || user.role !== 'student') {
    throw new ApiError(404, 'STUDENT_NOT_FOUND', 'Student not found');
  }
  return user;
}

function getProfile(userId = 'u-student-001') {
  const user = resolveStudent(userId);
  return {
    ...userRepository.sanitize(user),
    balance: user.balance || 0,
    walletBalance: user.balance || 0,
    subscription: subscriptionRepository.findActiveByUserId(userId),
    vehicle: {
      plate: user.vehiclePlate,
      type: 'MOTORBIKE',
    },
  };
}

function createOrUpdateSubscription(userId, month, year, metadata = {}) {
  const existing = subscriptionRepository.findActiveByUserIdAndMonth(userId, month, year);
  if (existing) {
    return existing;
  }

  const range = monthRange(month, year);
  return subscriptionRepository.create({
    id: `sub-${Date.now()}`,
    userId,
    status: 'ACTIVE',
    month: Number(month),
    year: Number(year),
    validFrom: range.validFrom,
    validTo: range.validTo,
    amount: STUDENT_MONTHLY_PRICE,
    ...metadata,
  });
}

function subscribe({ userId = 'u-student-001', month, year, paymentToken }) {
  const user = resolveStudent(userId);
  const target = {
    month: Number(month || currentMonthYear().month),
    year: Number(year || currentMonthYear().year),
  };

  const existing = subscriptionRepository.findActiveByUserIdAndMonth(userId, target.month, target.year);
  if (existing) return existing;

  if (paymentToken) {
    const payment = paymentRepository.findByToken(paymentToken);
    if (!payment || payment.status !== 'COMPLETED') {
      throw new ApiError(400, 'PAYMENT_REQUIRED', 'Completed payment is required for subscription');
    }
  } else if ((user.balance || 0) < STUDENT_MONTHLY_PRICE) {
    throw new ApiError(400, 'INSUFFICIENT_BALANCE', 'Student balance is not enough for monthly subscription');
  } else {
    userRepository.update(user.id, { balance: (user.balance || 0) - STUDENT_MONTHLY_PRICE });
  }

  const subscription = createOrUpdateSubscription(userId, target.month, target.year, {
    paymentToken: paymentToken || null,
  });
  auditService.log('STUDENT_SUBSCRIBE', userId, { month: target.month, year: target.year, paymentToken: paymentToken || null });
  return subscription;
}

function topup({ userId = 'u-student-001', amount = 0 }) {
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new ApiError(400, 'INVALID_AMOUNT', 'Top-up amount must be greater than 0');
  }
  const user = resolveStudent(userId);
  const balance = (user.balance || 0) + parsedAmount;
  userRepository.update(user.id, { balance });
  const transaction = {
    transactionId: `topup-${Date.now()}`,
    userId,
    amount: parsedAmount,
    balance,
    status: 'COMPLETED',
  };
  auditService.log('STUDENT_TOPUP', userId, transaction);
  return transaction;
}

function getParkingHistory({ userId = 'u-student-001', page = 1, limit = 5 }) {
  resolveStudent(userId);
  const all = parkingSessionRepository.findByUserId(userId);
  const start = (Number(page) - 1) * Number(limit);
  return {
    data: all.slice(start, start + Number(limit)),
    total: all.length,
    page: Number(page),
    limit: Number(limit),
  };
}

module.exports = { STUDENT_MONTHLY_PRICE, getProfile, subscribe, topup, getParkingHistory, createOrUpdateSubscription };
