// Simple in-memory repository for employees
const employees = require('../data/employees.data'); // tạo file data tương ứng

function list() {
  return employees;
}

function findById(id) {
  return employees.find(e => e.id === id) || null;
}

function findByEmail(email) {
  return employees.find(e => e.email === email) || null;
}

function findByCardId(cardId) {
  return employees.find(e => e.cardId === cardId) || null;
}

function create(payload) {
  const record = { id: `u-employee-${Date.now()}`, ...payload };
  employees.push(record);
  return record;
}

function update(id, patch) {
  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) return null;
  employees[idx] = { ...employees[idx], ...patch };
  return employees[idx];
}

module.exports = { list, findById, findByEmail, findByCardId, create, update };