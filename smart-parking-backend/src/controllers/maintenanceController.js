const maintenanceService = require('../services/maintenanceService');
const { success, error } = require('../utils/response');

async function createIssue(req, res, next) {
  try {
    const { spotId, description, priority } = req.body;
    const userId = req.userId;
    const issue = maintenanceService.createIssue({
      spotId,
      description,
      priority,
      reportedBy: userId,
    });
    success(res, issue);
  } catch (err) {
    error(res, err);
  }
}

async function getIssue(req, res, next) {
  try {
    const { id } = req.params;
    const issue = maintenanceService.getIssue(id);
    success(res, issue);
  } catch (err) {
    error(res, err);
  }
}

async function listIssues(req, res, next) {
  try {
    const { status, priority, assignedTo } = req.query;
    const issues = maintenanceService.listIssues({ status, priority, assignedTo });
    success(res, { data: issues, total: issues.length });
  } catch (err) {
    error(res, err);
  }
}

async function updateIssue(req, res, next) {
  try {
    const { id } = req.params;
    const { status, priority, notes, assignedTo } = req.body;
    const userId = req.userId;
    const updated = maintenanceService.updateIssue(id, {
      status,
      priority,
      notes,
      assignedTo,
      resolvedBy: status === 'RESOLVED' ? userId : undefined,
    });
    success(res, updated);
  } catch (err) {
    error(res, err);
  }
}

async function assignIssue(req, res, next) {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;
    const assigned = maintenanceService.assignIssue(id, employeeId);
    success(res, assigned);
  } catch (err) {
    error(res, err);
  }
}

async function closeIssue(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const closed = maintenanceService.closeIssue(id, userId);
    success(res, closed);
  } catch (err) {
    error(res, err);
  }
}

async function getSpotMaintenanceStatus(req, res, next) {
  try {
    const { spotId } = req.params;
    const status = maintenanceService.getSpotMaintenanceStatus(spotId);
    success(res, status);
  } catch (err) {
    error(res, err);
  }
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
