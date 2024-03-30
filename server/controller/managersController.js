const jwt = require('jsonwebtoken');
const Manager = require('../models/managersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

require('dotenv').config();

// Generate a random secret key
const jwtSecretKey = crypto.randomBytes(3).toString('hex');

const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  '4fcd2d8f320a07a3c45c5a4227ee9e21',
  'd993624910c1f6edde26b326f529b585',
);

// const generateToken = (managerId) => {
//   return jwt.sign({ id: managerId }, 'your-secret-key', { expiresIn: '2m' });
// };
const generateToken = (managerId) => {
  return jwt.sign({ id: managerId }, 'your-secret-key');
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

    console.log(`Password reset email sent to ${email} with token ${resetToken}`);
  } catch (error) {
    console.error('Error sending password reset email:', error.toString());
  }
};


const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingManager = await Manager.findOne({ $or: [{ username }, { email }] });

    if (existingManager) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newManager = new Manager({ username, password, email });
    await newManager.save();

    const token = generateToken(newManager._id);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const manager = await Manager.findOne({ username });
   
    if (!manager) {
      return res.status(401).json({ error: 'incorrect username' });
    }

    const isPasswordMatch = await manager.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'incorrect password' });
    }

    const token = generateToken(manager._id);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    // You may want to perform additional tasks during logout if needed
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
const resetToken = jwt.sign({ id: manager._id }, jwtSecretKey, { expiresIn: '15m' });
    // Save the resetToken in the database for verification later
    manager.resetToken = resetToken;
    await manager.save();
    // Send password reset email with resetToken
    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

const authenticate = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key');
    const manager = await Manager.findOne({ _id: decoded.id });

    if (!manager) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }

    req.manager = manager;
    req.token = token;

    res.json({ success: true, message: 'Authentication successful' });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};



module.exports = {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  authenticate,

};

