const express = require('express');
const router = express.Router();
const { getStats, getViolationsByType } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/stats', protect, checkRole(['admin']), getStats);
router.get('/by-type', protect, checkRole(['admin']), getViolationsByType);

module.exports = router;
