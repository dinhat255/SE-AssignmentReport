const lecturerQuotaRepository = require('../repositories/lecturerQuotaRepository');
const parkingSessionRepository = require('../repositories/parkingSessionRepository');
const userRepository = require('../repositories/userRepository');
const paymentRepository = require('../repositories/paymentRepository');
const auditService = require('./auditService');
const ApiError = require('../utils/ApiError');
const { currentMonthYear } = require('../utils/time');

const QUOTA_PRICE = 5000;

function resolveLecturer(userId = 'u-lecturer-001') {
  const user = userRepository.findById(userId);
  if (!user || user.role !== 'lecturer') {
    throw new ApiError(404, 'LECTURER_NOT_FOUND', 'Lecturer not found');
  }
  return user;
}

function normalizeQuota(quota) {
  quota.remaining = Math.max(0, quota.monthlyLimit - quota.currentUsage);
  return quota;
}

function getProfile(userId = 'u-lecturer-001') {
  const user = resolveLecturer(userId);
  return {
    ...userRepository.sanitize(user),
    quota: getQuota(userId),
  };
}

function getQuota(userId = 'u-lecturer-001') {
  resolveLecturer(userId);
  const { month, year } = currentMonthYear();
  const existing = lecturerQuotaRepository.findByUserIdAndMonth(userId, month, year) || lecturerQuotaRepository.findByUserId(userId);
  if (existing) return normalizeQuota(existing);
  return lecturerQuotaRepository.create({
    userId,
    month,
    year,
    monthlyLimit: 50,
    currentUsage: 0,
    remaining: 50,
  });
}

function getEntryHistory(userId = 'u-lecturer-001') {
  resolveLecturer(userId);
  const sessions = parkingSessionRepository.findByUserId(userId);
  return sessions.map((session) => ({
    sessionId: session.sessionId,
    date: session.date,
    timeIn: session.timeIn,
    timeOut: session.timeOut,
    slot: session.slot,
    duration: session.duration,
    fee: session.fee,
    status: session.status,
    type: session.status === 'ACTIVE' ? 'in' : 'out',
  }));
}

function getFrequency(userId = 'u-lecturer-001') {
  resolveLecturer(userId);
  const counts = new Map();
  for (const session of parkingSessionRepository.findByUserId(userId)) {
    const date = session.entryTime ? new Date(session.entryTime) : new Date(`${session.date}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const now = new Date();
  const months = [];
  for (let index = 4; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    months.push({ month: key, count: counts.get(key) || 0 });
  }
  return months;
}

function purchaseQuota({ userId = 'u-lecturer-001', quantity = 1, paymentToken }) {
  const parsedQuantity = Number(quantity);
  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    throw new ApiError(400, 'INVALID_QUANTITY', 'Quantity must be greater than 0');
  }
  const quota = getQuota(userId);
  if (paymentToken) {
    const payment = paymentRepository.findByToken(paymentToken);
    if (!payment || payment.status !== 'COMPLETED') {
      throw new ApiError(400, 'PAYMENT_REQUIRED', 'Completed payment is required for quota purchase');
    }
  }
  const updated = lecturerQuotaRepository.update(userId, {
    monthlyLimit: quota.monthlyLimit + parsedQuantity,
    purchasedExtraQuota: (quota.purchasedExtraQuota || 0) + parsedQuantity,
  }) || quota;
  auditService.log('LECTURER_QUOTA_PURCHASE', userId, {
    quantity: parsedQuantity,
    amount: parsedQuantity * QUOTA_PRICE,
    paymentToken: paymentToken || null,
  });
  return normalizeQuota(updated);
}

function incrementUsage(userId = 'u-lecturer-001') {
  const quota = getQuota(userId);
  const updated = lecturerQuotaRepository.update(userId, {
    currentUsage: quota.currentUsage + 1,
  }) || quota;
  return normalizeQuota(updated);
}

module.exports = { QUOTA_PRICE, getProfile, getQuota, getEntryHistory, getFrequency, purchaseQuota, incrementUsage };
