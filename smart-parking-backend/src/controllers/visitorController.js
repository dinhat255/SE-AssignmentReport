const visitorService = require('../services/visitorService');
const parkingService = require('../services/parkingService');
const { success, error } = require('../utils/response');

async function checkIn(req, res, next) {
  try {
    const result = parkingService.checkIn({
      vehiclePlate: req.body.vehiclePlate,
      visitorCardId: `VISITOR-${Date.now()}`,
    });
    const ticket = visitorService.createTicket({
      vehiclePlate: req.body.vehiclePlate,
      sessionId: result.sessionId,
      checkInTime: result.entryTime,
    });
    success(res, ticket);
  } catch (err) {
    error(res, err);
  }
}

async function checkOut(req, res, next) {
  try {
    const { ticketId } = req.body;
    const ticket = visitorService.getTicket(ticketId);
    if (!ticket) return error(res, new Error('Ticket not found'), 404);

    const checkOutResult = parkingService.checkOut({
      sessionId: ticket.sessionId,
    });
    const updated = visitorService.updateTicket(ticketId, {
      checkOutTime: checkOutResult.exitTime,
      fee: checkOutResult.fee,
      status: 'COMPLETED',
    });
    success(res, updated);
  } catch (err) {
    error(res, err);
  }
}

async function getTicket(req, res, next) {
  try {
    const { ticketId } = req.params;
    const ticket = visitorService.getTicket(ticketId);
    if (!ticket) return error(res, new Error('Ticket not found'), 404);
    success(res, ticket);
  } catch (err) {
    error(res, err);
  }
}
async function listTickets(req, res, next) {
  try {
    const tickets = visitorService.getAllTickets ? visitorService.getAllTickets() : [];
    success(res, tickets);
  } catch (err) {
    error(res, err);
  }
}
async function processPayment(req, res, next) {
  try {
    const { ticketId, amount } = req.body;
    const result = visitorService.processPayment(ticketId, amount);
    success(res, result);
  } catch (err) {
    error(res, err);
  }
}

async function getPaymentStatus(req, res, next) {
  try {
    const { ticketId } = req.params;
    const status = visitorService.getPaymentStatus(ticketId);
    success(res, status);
  } catch (err) {
    error(res, err);
  }
}

module.exports = {
  checkIn,
  checkOut,
  getTicket,
  listTickets,
  processPayment,
  getPaymentStatus,
};
