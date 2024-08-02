const jwt = require('jsonwebtoken');
const Manager = require('../models/managersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Admin = require('../models/adminModel');
require('dotenv').config();

// Generate a random secret key
const jwtSecretKey = crypto.randomBytes(3).toString('hex');

const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    '4fcd2d8f320a07a3c45c5a4227ee9e21',
    'd993624910c1f6edde26b326f529b585',
);

const generateToken = (managerId) => {
  return jwt.sign({ id: managerId }, 'your-secret-key', { expiresIn: '2hour' });
};

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    // Send password reset email using Mailjet
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [{
        From: {
          Email: 'devmanal5@gmail.com', // Sender's email address
          Name: 'EducationalCenter Website' // Sender's name (optional)
        },
        To: [{
          Email: email // Recipient's email address
        }],
        Subject: 'Password Reset Request',
        HTMLPart: `
          <p>Hello,</p>
          <p>You have requested a password reset for your account. Click the link below to reset your password:</p>
          <p><a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <p>Thank you,</p>
          <p>Educational Center Website</p>
        `
      }]
    });

    await request;
  } catch (error) {
    console.error('Error sending password reset email:', error.toString());
  }
};

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Case 1: Manager creation by Admin
    if (req.admin) {
      const adminId = req.admin._id;

      const existingManager = await Manager.findOne({ $or: [{ username }, { email }] });

      if (existingManager) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      const newManager = new Manager({ username, password, email, adminId });
      await newManager.save();

      // Add the new manager to the admin's list of managers (assuming you have such a relationship)
      req.admin.managers.push(newManager._id);
      await req.admin.save();

      const token = generateToken(newManager._id);

      res.status(201).json({ token });
    } else {
      // Case 2: Manager creates own account (without admin)
      const existingManager = await Manager.findOne({ $or: [{ username }, { email }] });

      if (existingManager) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      const newManager = new Manager({ username, password, email });
      await newManager.save();

      const token = generateToken(newManager._id);

      res.status(201).json({ token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

const login = async (req, res) => {
  let isAuthenticated = false;
  try {
    const { username, password } = req.body;
    const manager = await Manager.findOne({ username });

    if (!manager) {
      return res.status(401).json({ error: 'Incorrect username' });
    }

    const isPasswordMatch = await manager.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const token = generateToken(manager._id);
    const UserRole = manager.role;
    isAuthenticated = true;
    res.status(200).json({ token, UserRole,isAuthenticated });
  } catch (error) {
    console.error(error);
    isAuthenticated = false;
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' },isAuthenticated);
  }
};

const logout = async (req, res) => {
  try {
    // You may want to perform additional tasks during logout if needed
    res.status(200).json({ message: 'Logout successful' }, );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const managerId = req.manager._id;

    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, manager.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }

    manager.password = newPassword;
    await manager.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Generate reset token using JWT
    const resetToken = jwt.sign({ id: manager._id }, jwtSecretKey, { expiresIn: '15min' });
    // Save the resetToken in the database for verification later
    manager.resetToken = resetToken;
    await manager.save();
    // Send password reset email with resetToken
    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(resetToken, jwtSecretKey);
    const manager = await Manager.findById(decoded.id);

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Update manager's password with the new password
    manager.password = newPassword;
    // Clear the resetToken after password reset
    manager.resetToken = undefined;
    await manager.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid or expired reset token' });
  }
};


module.exports = {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
