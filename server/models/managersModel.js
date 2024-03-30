const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const managerSchema = new mongoose.Schema({
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
  resetToken: String,
  resetTokenExpiration: Date,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  centerOperationalCosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CenterOperationalCosts' }]
});

managerSchema.pre('save', async function (next) {
  const manager = this;
  if (manager.isModified('password')) {
    manager.password = await bcrypt.hash(manager.password, 8);
  }
  next();
});

managerSchema.methods.comparePassword = async function (password) {
  const manager = this;
  return bcrypt.compare(password, manager.password);
};

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;
