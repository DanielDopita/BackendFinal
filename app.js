require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
require('./config/db');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Event Ticketing System API');
});

// 404 handler
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).send('<h1>404 Not Found</h1>');
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).send('404 Not Found');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});