const auditLogs = require('../data/auditLogs.data');

function create(log) {
  auditLogs.unshift(log);
  return log;
}

function list() {
  return auditLogs;
}

module.exports = { create, list };
