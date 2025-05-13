const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, bookingController.getBookings)
  .post(protect, bookingController.createBooking);

router.route('/:id')
  .get(protect, bookingController.getBooking);

// Bonus: QR validation route
router.get('/validate/:qr', bookingController.validateTicket);

module.exports = router;