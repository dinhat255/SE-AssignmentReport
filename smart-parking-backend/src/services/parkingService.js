const parkingSpotRepository = require('../repositories/parkingSpotRepository');
const parkingSessionRepository = require('../repositories/parkingSessionRepository');
const userRepository = require('../repositories/userRepository');
const subscriptionRepository = require('../repositories/subscriptionRepository');
const lecturerService = require('./lecturerService');
const auditService = require('./auditService');
const ApiError = require('../utils/ApiError');
const { nowIso, dateOnly, timeOnly, formatDuration } = require('../utils/time');

function getMap() {
  const spots = parkingSpotRepository.list();
  const occupied = spots.filter((spot) => spot.status === 'OCCUPIED').length;
  const maintenance = spots.filter((spot) => spot.status === 'MAINTENANCE').length;
  return {
    updatedAt: nowIso(),
    summary: {
      available: spots.filter((spot) => spot.status === 'AVAILABLE').length,
      occupied,
      maintenance,
      total: spots.length,
    },
    spots,
  };
}

function resolveUser(payload = {}) {
  const userId = payload.userId;
  const cardId = payload.cardId || payload.visitorCardId;
  const user = (userId && userRepository.findById(userId)) || (cardId && userRepository.findByCardId(cardId));
  if (!user && payload.visitorCardId) {
    return {
      id: `visitor-${payload.visitorCardId}`,
      role: 'visitor',
      cardId: payload.visitorCardId,
      vehiclePlate: payload.vehiclePlate,
    };
  }
  if (!user) throw new ApiError(400, 'INVALID_CARD', 'Card or user is not registered');
  return user;
}

function checkIn(payload = {}) {
  const user = resolveUser(payload);
  const active = parkingSessionRepository.findActiveByUserId(user.id) || parkingSessionRepository.findActiveByCardId(user.cardId);
  if (active) {
    throw new ApiError(409, 'DUPLICATE_ACTIVE_SESSION', 'User already has an active parking session');
  }

  let remainingQuota;
  if (user.role === 'student') {
    const subscription = subscriptionRepository.findActiveByUserId(user.id);
    if (!subscription) {
      throw new ApiError(403, 'SUBSCRIPTION_REQUIRED', 'Student needs an active subscription to check in');
    }
  }

  if (user.role === 'lecturer') {
    const quota = lecturerService.getQuota(user.id);
    if (quota.currentUsage >= quota.monthlyLimit) {
      throw new ApiError(403, 'QUOTA_EXCEEDED', 'Lecturer monthly parking quota is exhausted');
    }
    const updatedQuota = lecturerService.incrementUsage(user.id);
    remainingQuota = updatedQuota.remaining;
  }

  const available = parkingSpotRepository.list().find((spot) => spot.status === 'AVAILABLE');
  if (!available) throw new ApiError(409, 'NO_AVAILABLE_SPOT', 'No available parking spot');
  const assignedSlot = available.id;
  parkingSpotRepository.updateStatus(available.id, 'OCCUPIED');

  const entryTime = nowIso();
  const session = parkingSessionRepository.create({
    sessionId: `ps-${Date.now()}`,
    userId: user.id,
    cardId: user.cardId || payload.visitorCardId,
    vehiclePlate: payload.vehiclePlate || user.vehiclePlate,
    slot: assignedSlot,
    date: dateOnly(),
    entryTime,
    timeIn: timeOnly(),
    timeOut: '-',
    duration: '-',
    fee: 0,
    status: 'ACTIVE',
    cardType: user.role === 'student' ? 'Thang' : user.role === 'lecturer' ? 'Lecturer' : 'Visitor',
  });

  auditService.log('PARKING_CHECK_IN', user.id, { sessionId: session.sessionId, slot: assignedSlot });
  return {
    sessionId: session.sessionId,
    userId: user.id,
    assignedSlot,
    entryTime,
    timeIn: session.timeIn,
    status: session.status,
    remainingQuota,
  };
}

function checkOut(payload = {}) {
  const user = (payload.userId && userRepository.findById(payload.userId)) || null;
  const session =
    (payload.sessionId && parkingSessionRepository.findActiveBySessionId(payload.sessionId)) ||
    (payload.userId && parkingSessionRepository.findActiveByUserId(payload.userId)) ||
    (payload.cardId && parkingSessionRepository.findActiveByCardId(payload.cardId)) ||
    null;

  if (!session) throw new ApiError(404, 'ACTIVE_SESSION_NOT_FOUND', 'Active parking session not found');

  const exitTime = nowIso();
  const fee = session.cardType === 'Visitor' ? 5000 : 0;
  const completed = parkingSessionRepository.update(session.sessionId, {
    exitTime,
    timeOut: timeOnly(),
    duration: formatDuration(session.entryTime || `${session.date}T${session.timeIn}:00.000Z`, exitTime),
    fee,
    status: 'COMPLETED',
  });
  parkingSpotRepository.updateStatus(session.slot, 'AVAILABLE');
  auditService.log('PARKING_CHECK_OUT', user?.id || session.userId, { sessionId: session.sessionId, slot: session.slot, fee });

  return completed;
}

module.exports = { getMap, checkIn, checkOut };
