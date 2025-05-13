const Event = require('../models/Event');

// Get all events
const getEvents = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.date) {
      const date = new Date(req.query.date);
      query.date = {
        $gte: new Date(date.setHours(0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59))
      };
    }
    
    const events = await Event.find(query);
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

// Get single event
const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// Create event
const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// Update event
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (req.body.seatCapacity && req.body.seatCapacity < event.bookedSeats) {
      return res.status(400).json({
        success: false,
        error: `Cannot reduce capacity below ${event.bookedSeats} booked seats`
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// Delete event
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.bookedSeats > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete event with existing bookings'
      });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
};