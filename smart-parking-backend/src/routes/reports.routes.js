const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.get('/parking', reportController.getParkingReport);
router.get('/revenue', reportController.getRevenueReport);
router.get('/occupancy', reportController.getOccupancyReport);
router.get('/activity', reportController.getUserActivityReport);
router.get('/combined', reportController.getCombinedReport);

module.exports = router;
