const visitorTickets = require('../data/visitorTickets.data');
const parkingSpots = require('../data/parkingSpots.data');
const parkingSessions = require('../data/parkingSessions.data');

function createTicket(vehiclePlate, visitorCardId) {
  const ticket = {
    ticketId: `VT-${Date.now()}`,
    vehiclePlate,
    visitorCardId,
    checkInTime: new Date().toISOString(),
    checkOutTime: null,
    assignedSlot: null,
    fee: 0,
    status: 'ACTIVE',
    paymentStatus: 'PENDING',
  };
  visitorTickets.push(ticket);
  return ticket;
}

function getTicket(ticketId) {
  return visitorTickets.find((t) => t.ticketId === ticketId);
}

function updateTicket(ticketId, updates) {
  const ticket = getTicket(ticketId);
  if (ticket) {
    Object.assign(ticket, updates);
  }
  return ticket;
}

function getActiveTickets() {
  return visitorTickets.filter((t) => t.status === 'ACTIVE');
}

function getCompletedTickets() {
  return visitorTickets.filter((t) => t.status === 'COMPLETED');
}

function listTickets(filters = {}) {
  let result = [...visitorTickets];

  if (filters.status) {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters.vehiclePlate) {
    result = result.filter((t) => t.vehiclePlate.includes(filters.vehiclePlate));
  }

  return result.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
}

module.exports = {
  createTicket,
  getTicket,
  updateTicket,
  getActiveTickets,
  getCompletedTickets,
  listTickets,
};
