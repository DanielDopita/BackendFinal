const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { generateQR } = require('../utils/qrGenerator');
const { sendBookingConfirmation } = require('../utils/emailService');

// Get all bookings for logged-in user
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// Get single booking
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// Create new booking
const createBooking = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check seat availability
    if (event.bookedSeats + quantity > event.seatCapacity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Not enough seats available' 
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      quantity
    });

    // Update event's booked seats
    event.bookedSeats += quantity;
    await event.save();

    // Generate QR code if enabled
    if (process.env.QR_CODE_ENABLED === 'true') {
      booking.qrCode = await generateQR(booking._id.toString());
      await booking.save();
    }

    // Send confirmation email if enabled
    if (process.env.EMAIL_SERVICE) {
      await sendBookingConfirmation(req.user.email, {
        eventTitle: event.title,
        eventDate: event.date,
        quantity,
        qrCode: booking.qrCode
      });
    }

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// Validate ticket by QR code
const validateTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      qrCode: req.params.qr
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid ticket' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        valid: true,
        booking
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  validateTicket
};