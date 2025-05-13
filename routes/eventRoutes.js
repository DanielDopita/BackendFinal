const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController'); // Make sure these exist
const { protect, admin } = require('../middleware/auth');

// GET /api/events
router.get('/', getEvents);

// GET /api/events/:id
router.get('/:id', getEvent);

// POST /api/events (admin only)
router.post('/', protect, admin, createEvent);

// PUT /api/events/:id (admin only)
router.put('/:id', protect, admin, updateEvent);

// DELETE /api/events/:id (admin only)
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;