const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(eventController.getEvents)
  .post(protect, admin, eventController.createEvent);

router.route('/:id')
  .get(eventController.getEvent)
  .put(protect, admin, eventController.updateEvent)
  .delete(protect, admin, eventController.deleteEvent);

module.exports = router;