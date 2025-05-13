const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

/**
 * @route GET /api/events
 * @desc Get all events
 */
router.get('/', getEvents);

/**
 * @route GET /api/events/:id
 * @desc Get single event
 */
router.get('/:id', getEvent);

/**
 * @route POST /api/events
 * @desc Create new event (Admin only)
 */
router.post('/', protect, admin, createEvent);

/**
 * @route PUT /api/events/:id
 * @desc Update event (Admin only)
 */
router.put('/:id', protect, admin, updateEvent);

/**
 * @route DELETE /api/events/:id
 * @desc Delete event (Admin only)
 */
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;