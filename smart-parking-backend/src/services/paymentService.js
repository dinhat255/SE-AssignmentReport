const paymentRepository = require('../repositories/paymentRepository');
const ApiError = require('../utils/ApiError');
const { nowIso } = require('../utils/time');
const auditService = require('./auditService');
const studentService = require('./studentService');
const lecturerService = require('./lecturerService');

function createBkpayQr({ amount = 0, role = 'student', context = {}, expiresInSeconds = 300 }) {
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new ApiError(400, 'INVALID_AMOUNT', 'Payment amount must be greater than 0');
  }
  const qrToken = `PAY_${Date.now()}`;
  const payment = paymentRepository.create({
    qrToken,
    amount: parsedAmount,
    role,
    context,
    status: 'PENDING',
    createdAt: nowIso(),
    expiresInSeconds,
  });
  auditService.log('PAYMENT_QR_CREATED', context.userId || null, { qrToken, amount: parsedAmount, role, context });

  return {
    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrToken)}`,
    qrToken: payment.qrToken,
    expiresInSeconds: payment.expiresInSeconds,
  };
}

function getStatus(qrToken) {
  const payment = paymentRepository.findByToken(qrToken);
  if (!payment) throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
  return payment;
}

function isExpired(payment) {
  const expiresInSeconds = Number(payment.expiresInSeconds || 300);
  return Date.now() > new Date(payment.createdAt).getTime() + expiresInSeconds * 1000;
}

function applyPaymentEffect(payment) {
  const context = payment.context || {};
  if (context.type === 'STUDENT_SUBSCRIPTION') {
    const now = new Date();
    const subscription = studentService.createOrUpdateSubscription(
      context.userId || 'u-student-001',
      context.month || now.getMonth() + 1,
      context.year || now.getFullYear(),
      { paymentToken: payment.qrToken }
    );
    auditService.log('STUDENT_SUBSCRIBE', context.userId || 'u-student-001', {
      month: subscription.month,
      year: subscription.year,
      paymentToken: payment.qrToken,
    });
    return { type: context.type, subscription };
  }

  if (context.type === 'LECTURER_QUOTA_PURCHASE') {
    const quota = lecturerService.purchaseQuota({
      userId: context.userId || 'u-lecturer-001',
      quantity: context.quantity || 1,
      paymentToken: payment.qrToken,
    });
    return { type: context.type, quota };
  }

  return { type: context.type || 'UNKNOWN' };
}

function confirm(qrToken) {
  const existing = paymentRepository.findByToken(qrToken);
  if (!existing) throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
  if (existing.status === 'COMPLETED') {
    return { payment: existing, effect: existing.effect || null };
  }
  if (isExpired(existing)) {
    paymentRepository.update(qrToken, { status: 'EXPIRED', expiredAt: nowIso() });
    throw new ApiError(400, 'PAYMENT_EXPIRED', 'Payment QR token has expired');
  }

  const payment = paymentRepository.update(qrToken, { status: 'COMPLETED', confirmedAt: nowIso() });
  const effect = applyPaymentEffect(payment);
  paymentRepository.update(qrToken, { effect });
  auditService.log('PAYMENT_CONFIRMED', payment.context?.userId || null, { qrToken, amount: payment.amount, effectType: effect.type });
  return { payment, effect };
}

module.exports = { createBkpayQr, getStatus, confirm };
