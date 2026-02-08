const express = require('express');
const router = express.Router();
const { createViolation, getViolations, getViolationTypes, getAreas, markViolationAsPaid } = require('../controllers/violationController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/types', protect, getViolationTypes);
router.get('/areas', protect, getAreas);

router.route('/')
    .post(protect, checkRole(['officer', 'admin']), createViolation)
    .get(protect, getViolations);

router.put('/:id/pay', protect, checkRole(['officer', 'admin']), markViolationAsPaid);

module.exports = router;
