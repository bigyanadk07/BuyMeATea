const express = require('express');
const router = express.Router();
const esewaController = require('../Controller/esewa.controller');

// eSewa payment routes
router.post('/initiate', esewaController.initiatePayment);
router.post('/verify', esewaController.verifyPayment);

module.exports = router;