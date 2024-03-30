const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0  // Default discount percentage
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',  // Reference to the manager who manages this student
    required: true
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define a virtual property to populate enrollments
studentSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'student'
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
