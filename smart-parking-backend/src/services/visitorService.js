const tickets = [];

function createTicket(payload) {
  const ticket = {
    ticketId: `VISITOR-${Date.now()}`,
    vehiclePlate: payload.vehiclePlate,
    checkInTime: payload.checkInTime,
    sessionId: payload.sessionId,
    fee: 0,
    status: 'ACTIVE',
    paymentStatus: 'PENDING',
  };
  tickets.push(ticket);
  return ticket;
}

function getTicket(ticketId) {
  return tickets.find((t) => t.ticketId === ticketId);
}

function updateTicket(ticketId, data) {
  const ticket = getTicket(ticketId);
  if (!ticket) return null;
  Object.assign(ticket, data);
  return ticket;
}

function processPayment(ticketId, amount) {
  const ticket = getTicket(ticketId);
  if (!ticket) return null;
  ticket.paymentStatus = 'COMPLETED';
  ticket.status = 'PAID';
  return {
    ticketId,
    amount,
    paymentStatus: 'COMPLETED',
    paymentMethod: 'CASH',
    timestamp: new Date().toISOString(),
  };
}

function getPaymentStatus(ticketId) {
  const ticket = getTicket(ticketId);
  if (!ticket) return null;
  return {
    ticketId,
    paymentStatus: ticket.paymentStatus || 'PENDING',
    amount: ticket.fee,
  };
}

module.exports = {
  createTicket,
  getTicket,
  updateTicket,
  processPayment,
  getPaymentStatus,
};
