const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

router.post('/issues', maintenanceController.createIssue);
router.get('/issues', maintenanceController.listIssues);
router.get('/issues/:id', maintenanceController.getIssue);
router.patch('/issues/:id', maintenanceController.updateIssue);
router.post('/issues/:id/assign', maintenanceController.assignIssue);
router.post('/issues/:id/close', maintenanceController.closeIssue);
router.get('/spots/:spotId', maintenanceController.getSpotMaintenanceStatus);

module.exports = router;
