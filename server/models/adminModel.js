const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'admin'
  },
  resetToken: String,
  resetTokenExpiration: Date,
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manager' }]
});

adminSchema.pre('save', async function (next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

adminSchema.methods.comparePassword = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
