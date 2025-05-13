const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
router.post('/login', login);

/**
 * @route GET /api/auth/me
 * @desc Get current user data
 */
router.get('/me', protect, getMe);

module.exports = router;