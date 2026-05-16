const express = require('express');
const { success } = require('../utils/response');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const parkingRoutes = require('./parking.routes');
const studentRoutes = require('./student.routes');
const lecturerRoutes = require('./lecturer.routes');
const paymentRoutes = require('./payment.routes');
const debugRoutes = require('./debug.routes');
const adminRoutes = require('./admin.routes');
const employeeRoutes = require('./employee.routes');
const visitorRoutes = require('./visitor.routes');
const router = express.Router();

router.get('/health', (_req, res) => {
  success(res, { status: 'ok', service: 'smart-parking-backend' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/parking', parkingRoutes);
router.use('/student', studentRoutes);
router.use('/lecturer', lecturerRoutes);
router.use('/payments', paymentRoutes);
router.use('/debug', debugRoutes);

router.use('/admin', adminRoutes);
router.use('/employee', employeeRoutes);
router.use('/visitor', visitorRoutes);
module.exports = router;
