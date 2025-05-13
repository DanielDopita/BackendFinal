const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  qrCode: String
});

module.exports = mongoose.model('Booking', bookingSchema);