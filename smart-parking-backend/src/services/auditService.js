const auditLogRepository = require('../repositories/auditLogRepository');
const { nowIso } = require('../utils/time');

function log(action, actorId, metadata = {}) {
  return auditLogRepository.create({
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    actorId,
    metadata,
    createdAt: nowIso(),
  });
}

module.exports = { log, record: log };
