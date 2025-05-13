const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};