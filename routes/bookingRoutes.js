const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  validateTicket
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// All routes protected by JWT
router.use(protect);

// GET /api/bookings
router.get('/', getBookings);

// GET /api/bookings/:id
router.get('/:id', getBooking);

// POST /api/bookings
router.post('/', createBooking);

// BONUS: GET /api/bookings/validate/:qr
router.get('/validate/:qr', validateTicket);

module.exports = router;