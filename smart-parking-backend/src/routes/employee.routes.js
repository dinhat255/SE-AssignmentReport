const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

// Profile
router.get('/profile', employeeController.getProfile);

// Parking Status
router.get('/parking/status', employeeController.getParkingStatus);

// Manual Check-in/out
router.post('/manual-checkin', employeeController.manualCheckIn);
router.post('/manual-checkout', employeeController.manualCheckOut);

// Incidents
router.get('/incidents', employeeController.getIncidents);
router.post('/incidents', employeeController.createIncident);
router.patch('/incidents/:incidentId', employeeController.updateIncidentStatus);

// Shift
router.get('/shift', employeeController.getShiftInfo);

module.exports = router;
