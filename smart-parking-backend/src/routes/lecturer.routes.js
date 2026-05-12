const express = require('express');
const lecturerController = require('../controllers/lecturerController');

const router = express.Router();

router.get('/profile', lecturerController.getProfile);
router.get('/quota', lecturerController.getQuota);
router.get('/entry-history', lecturerController.getEntryHistory);
router.get('/frequency', lecturerController.getFrequency);
router.post('/quota/purchase', lecturerController.purchaseQuota);

module.exports = router;
