const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: String,
    default: '1997-05-15',
  },
  age: {
    type: Number,
    default: 29,
  },
  mode: {
    type: String,
    enum: ['kid', 'adult'],
    default: 'adult',
  },
  country: {
    type: String,
    default: 'India',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Patient', patientSchema);
