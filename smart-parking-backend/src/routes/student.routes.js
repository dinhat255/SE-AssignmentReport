const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

router.get('/profile', studentController.getProfile);
router.post('/subscribe', studentController.subscribe);
router.post('/topup', studentController.topup);
router.get('/parking-history', studentController.getParkingHistory);

module.exports = router;
