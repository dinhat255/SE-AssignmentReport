const express = require('express');
const visitorController = require('../controllers/visitorController');

const router = express.Router();

router.post('/check-in', visitorController.checkIn);
router.post('/check-out', visitorController.checkOut);
router.get('/tickets', visitorController.listTickets);
router.get('/ticket/:ticketId', visitorController.getTicket);
router.post('/payment', visitorController.processPayment);

module.exports = router;
