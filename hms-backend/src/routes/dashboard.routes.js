const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/authenticate');

router.get('/stats', authenticate, getStats);

module.exports = router;
