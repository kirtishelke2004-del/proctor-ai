const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    check('username', 'Username must be at least 3 characters').trim().isLength({ min: 3 }),
    check('email', 'Please include a valid email address').isEmail().normalizeEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    validate,
  ],
  registerUser
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please enter your email or username').not().isEmpty(),
    check('password', 'Password is required').exists(),
    validate,
  ],
  loginUser
);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
