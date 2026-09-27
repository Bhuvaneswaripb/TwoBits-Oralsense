const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'pat-default',
  },
  name: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Child age is required'],
    min: 1,
    max: 18,
  },
  avatar: {
    type: String,
    default: 'star',
  },
  morningReminderTime: {
    type: String,
    default: '08:00',
  },
  eveningReminderTime: {
    type: String,
    default: '20:00',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);
