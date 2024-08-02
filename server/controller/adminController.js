const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Manager = require('../models/managersModel');
const Mailjet = require('node-mailjet');
require('dotenv').config();
// Generate a random secret key

const jwtSecretKey = crypto.randomBytes(3).toString('hex');
const mailjet = Mailjet.apiConnect(
    '4fcd2d8f320a07a3c45c5a4227ee9e21',
    'd993624910c1f6edde26b326f529b585',
);

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, 'your-secret-key', { expiresIn: '2hour' });
};

const addManagerToAdmin = async (req, res) => {
  try {
    const adminId = req.admin._id; // Authenticated admin's ID
    const { managerId } = req.body; // ID of the manager to be added

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).send({ error: 'Admin not found' });
    }

    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res.status(404).send({ error: 'Manager not found' });
    }

    if (!admin.managers.includes(managerId)) {
      admin.managers.push(managerId);
      manager.adminId = adminId; // Update manager's adminId
      await admin.save();
      await manager.save();
    }

    res.status(200).send(admin);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
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
          <p><a href="http://localhost:3000/admin-resetPassword/${resetToken}">Reset Password</a></p>
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

    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newAdmin = new Admin({ username, password, email });
    await newAdmin.save();

    const token = generateToken(newAdmin._id);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

const login = async (req, res) => {
  let isAuthenticated = false;
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: 'Incorrect username' });
    }

    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const token = generateToken(admin._id);
    const UserRole = admin.role;
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
    // Assuming req.token contains the token to be invalidated
    const token = req.token;

    // Invalidate the token by setting it to an expired token or removing it
    // Option 1: Set the token to an expired value (this method requires the secret key)
    const decoded = jwt.decode(token);
    const expiredToken = jwt.sign({ ...decoded, exp: 0 }, 'your-secret-key');

    // Option 2: Remove the token (unset it)
    // const expiredToken = null;

    // Respond with a message indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

// Change Password Function for Admin
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.admin._id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }
    
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
  }
};

const getManagers = async (req, res) => {
    try {
      const adminId = req.admin._id;
      const admin = await Admin.findById(adminId).populate('managers');
  
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      res.status(200).json({ managers: admin.managers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong, check your internet connection and try again' });
    }
  };

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    // Generate reset token using JWT
    const resetToken = jwt.sign({ id: admin._id }, jwtSecretKey, { expiresIn: '15min' });
    // Save the resetToken in the database for verification later
    admin.resetToken = resetToken;
    await admin.save();
    // Send password reset email with resetToken
    await sendResetPasswordEmail(email, resetToken);
    console.log(resetToken);
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
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ error: 'admin not found' });
    }

    // Update manager's password with the new password
    admin.password = newPassword;
    // Clear the resetToken after password reset
    admin.resetToken = undefined;
    await admin.save();

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
  getManagers,
  addManagerToAdmin,
  forgotPassword, // Add this line
  resetPassword, // Add this line
};
