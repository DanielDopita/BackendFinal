const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map(val => val.message)
      });
    }
  
    // JWT authentication error
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  
    // Default to 500 server error
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  };
  
  module.exports = errorHandler;