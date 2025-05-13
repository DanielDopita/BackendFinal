module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRES_IN || '1h',
    
    // For token generation in controllers
    signToken: (payload) => {
      return jwt.sign(payload, this.jwtSecret, { 
        expiresIn: this.jwtExpiration 
      });
    }
  };