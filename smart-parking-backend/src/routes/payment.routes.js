const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/bkpay/qr', paymentController.createBkpayQr);
router.get('/:qrToken/status', paymentController.getStatus);
router.post('/:qrToken/confirm', paymentController.confirm);

module.exports = router;
