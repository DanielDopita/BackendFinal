const Event = require('../models/Event');

exports.getEvents = async (req, res, next) => {
  try {
    let query = {};
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by date
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