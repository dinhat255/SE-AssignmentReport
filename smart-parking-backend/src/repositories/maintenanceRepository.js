const maintenanceIssues = require('../data/maintenanceIssues.data');

function createIssue(spotId, description, priority = 'MEDIUM') {
  const issue = {
    id: `MI-${Date.now()}`,
    spotId,
    description,
    priority,
    status: 'OPEN',
    reportedAt: new Date().toISOString(),
    resolvedAt: null,
    assignedTo: null,
    attachments: [],
    notes: [],
  };
  maintenanceIssues.push(issue);
  return issue;
}

function getIssue(id) {
  return maintenanceIssues.find((i) => i.id === id);
}

function updateIssue(id, updates) {
  const issue = getIssue(id);
  if (issue) {
    Object.assign(issue, updates);
    if (updates.status === 'RESOLVED') {
      issue.resolvedAt = new Date().toISOString();
    }
  }
  return issue;
}

function listIssues(filters = {}) {
  let result = [...maintenanceIssues];

  if (filters.status) {
    result = result.filter((i) => i.status === filters.status);
  }
  if (filters.priority) {
    result = result.filter((i) => i.priority === filters.priority);
  }
  if (filters.spotId) {
    result = result.filter((i) => i.spotId === filters.spotId);
  }

  return result.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
}

function addNote(issueId, note, userId) {
  const issue = getIssue(issueId);
  if (issue) {
    issue.notes.push({
      id: `note-${Date.now()}`,
      text: note,
      userId,
      timestamp: new Date().toISOString(),
    });
  }
  return issue;
}

function closeIssue(id) {
  return updateIssue(id, { status: 'RESOLVED', resolvedAt: new Date().toISOString() });
}

module.exports = {
  createIssue,
  getIssue,
  updateIssue,
  listIssues,
  addNote,
  closeIssue,
};
