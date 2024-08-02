// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Manager = require('../models/managersModel');
const Admin = require('../models/adminModel');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, 'your-secret-key');

    // Find manager using the decoded token information
    const manager = await Manager.findOne({ _id: decoded.id });

    if (!manager) {
      return res.status(401).json({ error: 'Authentication failed: Manager not found' });
    }

    // Attach manager and token information to the request object
    req.manager = manager;
    req.token = token;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log('ErrorName:', error.name);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token, please log in again' });
    }

    res.status(500).json({ error: 'Internal Server Error, please try again later' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, 'your-secret-key');

    // Find admin using the decoded token information
    const admin = await Admin.findOne({ _id: decoded.id });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Authentication failed: Admin not found' });
    }

    // Attach admin and token information to the request object
    req.admin = admin;
    req.token = token;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log('ErrorName:', error.name);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token, please log in again' });
    }

    res.status(500).json({ error: 'Internal Server Error, please try again later' });
  }
};

module.exports = {
  authenticate,
  authenticateAdmin
};
