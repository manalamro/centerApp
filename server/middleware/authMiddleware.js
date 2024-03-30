// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Manager = require('../models/managersModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key');
    const manager = await Manager.findOne({ _id: decoded.id });

    if (!manager) {
      throw new Error();
    }

    req.manager = manager;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = {
  authenticate,
};
