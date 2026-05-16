const express = require('express');
const parkingController = require('../controllers/parkingController');

const router = express.Router();

router.get('/map', parkingController.getMap);
router.get('/zones/status', parkingController.getZonesStatus);
router.post('/check-in', parkingController.checkIn);
router.post('/check-out', parkingController.checkOut);

module.exports = router;
