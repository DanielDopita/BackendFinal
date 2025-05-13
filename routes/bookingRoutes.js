const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Debug imports
console.log('Imported bookingController methods:', Object.keys(bookingController));

// All routes protected by JWT
router.use(protect);

// Route handlers with explicit function checks
router.get('/', (req, res, next) => {
  if (typeof bookingController.getBookings !== 'function') {
    console.error('getBookings is not a function!');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  bookingController.getBookings(req, res, next);
});

router.get('/:id', bookingController.getBooking);
router.post('/', bookingController.createBooking);
router.get('/validate/:qr', bookingController.validateTicket);

module.exports = router;