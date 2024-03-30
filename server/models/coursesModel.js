const mongoose = require('mongoose');

// Define Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  percentOfProfit: {
    type: Number,
    required: true
  }
});

// Define Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
  },
  
  teachers: [teacherSchema],
  cost: {
    type: Number,
    required: true
  },
  operationalCosts: [{
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  schedule: {
    recurrence: {
      type: String,
      required: true
    },
    days: [{
      type: String,
      required: true
    }],
    time: {
      type: String,
      required: true
    }
  }
});

// Define Course Model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
