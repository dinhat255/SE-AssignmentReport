const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User Management
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserById);
router.patch('/users/:userId', adminController.updateUser);
router.patch('/users/:userId/disable', adminController.disableUser);

// Parking Analytics
router.get('/parking/analytics', adminController.getParkingAnalytics);

// Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
