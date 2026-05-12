const express = require('express');
const debugController = require('../controllers/debugController');

const router = express.Router();

router.get('/state', debugController.state);
router.post('/reset', debugController.reset);

module.exports = router;
