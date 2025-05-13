const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode'); // For bonus feature

exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.id;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    // Check seat availability
    if (event.bookedSeats + quantity > event.seatCapacity) {
      return res.status(400).json({ success: false, error: 'Not enough seats available' });
    }
    
    // Create booking
    const booking = await Booking.create({ 
      user: userId, 
      event: eventId, 
      quantity 
    });
    
    // Update event's booked seats
    event.bookedSeats += quantity;
    await event.save();
    
    // Bonus: Generate QR code
    if (process.env.QR_CODE_ENABLED === 'true') {
      const qrData = `${booking._id}|${eventId}|${userId}`;
      booking.qrCode = await QRCode.toDataURL(qrData);
      await booking.save();
    }
    
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};