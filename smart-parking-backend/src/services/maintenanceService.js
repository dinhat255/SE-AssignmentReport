const maintenanceRepository = require('../repositories/maintenanceRepository');
const parkingSpotRepository = require('../repositories/parkingSpotRepository');
const auditService = require('./auditService');
const ApiError = require('../utils/ApiError');

function createIssue(payload = {}) {
  const { spotId, description, priority = 'MEDIUM', reportedBy } = payload;
  
  if (!spotId || !description) {
    throw new ApiError(400, 'INVALID_INPUT', 'spotId and description are required');
  }
  
  const spot = parkingSpotRepository.findById(spotId);
  if (!spot) {
    throw new ApiError(404, 'SPOT_NOT_FOUND', 'Parking spot not found');
  }
  
  const issue = maintenanceRepository.create({
    spotId,
    description,
    priority,
    reportedBy,
    status: 'OPEN',
    attachments: [],
    notes: [],
  });
  
  // Mark spot as maintenance
  parkingSpotRepository.updateStatus(spotId, 'MAINTENANCE');
  
  auditService.log('MAINTENANCE_ISSUE_CREATED', reportedBy, { issueId: issue.id, spotId });
  
  return issue;
}

function getIssue(issueId) {
  const issue = maintenanceRepository.findById(issueId);
  if (!issue) {
    throw new ApiError(404, 'ISSUE_NOT_FOUND', 'Maintenance issue not found');
  }
  return issue;
}

function listIssues(filters = {}) {
  return maintenanceRepository.list(filters);
}

function updateIssue(issueId, payload = {}) {
  const { status, priority, notes, assignedTo, resolvedBy } = payload;
  
  const issue = maintenanceRepository.findById(issueId);
  if (!issue) {
    throw new ApiError(404, 'ISSUE_NOT_FOUND', 'Maintenance issue not found');
  }
  
  const updateData = {};
  if (status) updateData.status = status;
  if (priority) updateData.priority = priority;
  if (assignedTo) updateData.assignedTo = assignedTo;
  if (resolvedBy) updateData.resolvedBy = resolvedBy;
  
  // Add notes if provided
  if (notes) {
    updateData.notes = [...(issue.notes || []), { text: notes, timestamp: new Date().toISOString() }];
  }
  
  const updated = maintenanceRepository.update(issueId, updateData);
  
  // If resolved, mark spot as available
  if (status === 'RESOLVED') {
    parkingSpotRepository.updateStatus(issue.spotId, 'AVAILABLE');
    auditService.log('MAINTENANCE_ISSUE_RESOLVED', resolvedBy, { issueId, spotId: issue.spotId });
  }
  
  return updated;
}

function assignIssue(issueId, employeeId) {
  const issue = maintenanceRepository.findById(issueId);
  if (!issue) {
    throw new ApiError(404, 'ISSUE_NOT_FOUND', 'Maintenance issue not found');
  }
  
  const updated = maintenanceRepository.update(issueId, { assignedTo: employeeId, status: 'IN_PROGRESS' });
  auditService.log('MAINTENANCE_ASSIGNED', employeeId, { issueId, spotId: issue.spotId });
  
  return updated;
}

function closeIssue(issueId, resolvedBy) {
  const issue = maintenanceRepository.findById(issueId);
  if (!issue) {
    throw new ApiError(404, 'ISSUE_NOT_FOUND', 'Maintenance issue not found');
  }
  
  const updated = maintenanceRepository.update(issueId, { status: 'RESOLVED', resolvedBy });
  
  // Mark spot as available
  parkingSpotRepository.updateStatus(issue.spotId, 'AVAILABLE');
  auditService.log('MAINTENANCE_CLOSED', resolvedBy, { issueId, spotId: issue.spotId });
  
  return updated;
}

function getSpotMaintenanceStatus(spotId) {
  const spot = parkingSpotRepository.findById(spotId);
  if (!spot) {
    throw new ApiError(404, 'SPOT_NOT_FOUND', 'Parking spot not found');
  }
  
  const issues = maintenanceRepository.findBySpotId(spotId);
  const openIssues = issues.filter((i) => i.status !== 'RESOLVED');
  
  return {
    spotId,
    isMaintenance: spot.status === 'MAINTENANCE',
    totalIssues: issues.length,
    openIssues: openIssues.length,
    issues: openIssues,
  };
}

module.exports = {
  createIssue,
  getIssue,
  listIssues,
  updateIssue,
  assignIssue,
  closeIssue,
  getSpotMaintenanceStatus,
};
