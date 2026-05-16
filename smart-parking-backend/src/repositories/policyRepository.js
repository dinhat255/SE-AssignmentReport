const policies = require('../data/policies.data');

function getPolicy(id) {
  return policies.find((p) => p.id === id);
}

function getPoliciesByType(type) {
  return policies.filter((p) => p.type === type && p.active);
}

function getActivePolicies() {
  return policies.filter((p) => p.active);
}

function createPolicy(data) {
  const policy = {
    id: `policy-${Date.now()}`,
    ...data,
    effectiveFrom: data.effectiveFrom || new Date().toISOString(),
    active: true,
  };
  policies.push(policy);
  return policy;
}

function updatePolicy(id, updates) {
  const policy = getPolicy(id);
  if (policy) {
    Object.assign(policy, updates);
  }
  return policy;
}

function deactivatePolicy(id) {
  return updatePolicy(id, { active: false });
}

function listPolicies() {
  return policies.sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom));
}

module.exports = {
  getPolicy,
  getPoliciesByType,
  getActivePolicies,
  createPolicy,
  updatePolicy,
  deactivatePolicy,
  listPolicies,
};
