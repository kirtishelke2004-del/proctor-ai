const express = require('express');
const { getTests, getTestById, createTest } = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getTests);
router.get('/:id', protect, getTestById);
router.post('/', protect, authorize('admin'), createTest);

module.exports = router;
