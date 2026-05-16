const policyRepository = require('../repositories/policyRepository');
const ApiError = require('../utils/ApiError');

function getActivePolicies() {
  return policyRepository.getActivePolicies();
}

function getPoliciesByType(type) {
  return policyRepository.getPoliciesByType(type);
}

function createPolicy(data) {
  if (!data.type || !data.name || data.value === undefined) {
    throw new ApiError(400, 'INVALID_POLICY_DATA', 'Type, name, and value are required');
  }

  return policyRepository.createPolicy(data);
}

function updatePolicy(id, updates) {
  const existing = policyRepository.getPolicy(id);
  if (!existing) {
    throw new ApiError(404, 'POLICY_NOT_FOUND', `Policy ${id} not found`);
  }

  return policyRepository.updatePolicy(id, updates);
}

function getPricingPolicy() {
  const policies = getPoliciesByType('VISITOR_HOURLY_RATE');
  return policies.length > 0 ? policies[0] : null;
}

function getStudentSubscriptionPolicy() {
  const policies = getPoliciesByType('STUDENT_SUBSCRIPTION_MONTHLY');
  return policies.length > 0 ? policies[0] : null;
}

function getLecturerQuotaPolicy() {
  const policies = getPoliciesByType('LECTURER_QUOTA_MONTHLY');
  return policies.length > 0 ? policies[0] : null;
}

function getLecturerQuotaPurchasePolicy() {
  const policies = getPoliciesByType('LECTURER_QUOTA_PURCHASE');
  return policies.length > 0 ? policies[0] : null;
}

module.exports = {
  getActivePolicies,
  getPoliciesByType,
  createPolicy,
  updatePolicy,
  getPricingPolicy,
  getStudentSubscriptionPolicy,
  getLecturerQuotaPolicy,
  getLecturerQuotaPurchasePolicy,
};
