require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Debugging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Database connection
const connectDB = require('./config/db');
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// API Routes
const apiRouter = express.Router();
apiRouter.get('/', (req, res) => res.json({
  status: 'API is working',
  endpoints: {
    auth: '/api/auth',
    events: '/api/events',
    bookings: '/api/bookings'
  }
}));
apiRouter.use('/auth', authRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/bookings', bookingRoutes);

// Mount the API router
app.use('/api', apiRouter);

// Welcome route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Health check
app.get('/health', (req, res) => res.json({
  status: 'healthy',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// 404 handler
app.use((req, res) => {
  console.warn(`404: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found',
    suggestion: 'Try /api for available endpoints'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});