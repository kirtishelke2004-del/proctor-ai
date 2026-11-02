const express = require('express');
const {
  startOrGetSession,
  logViolation,
  submitTest,
  getSession,
  getAdminLogs,
  getAdminLogDetail,
} = require('../controllers/proctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Candidate Proctoring Routes
router.post('/session/start', protect, startOrGetSession);
router.post('/log-violation', protect, logViolation);
router.post('/submit', protect, submitTest);
router.get('/session/:testId', protect, getSession);

// Admin Proctoring Routes
router.get('/admin/logs', protect, authorize('admin'), getAdminLogs);
router.get('/admin/logs/:id', protect, authorize('admin'), getAdminLogDetail);

module.exports = router;
