const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    default: 'pat-default',
  },
  providerId: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  doctorSpecialty: {
    type: String,
    default: 'General Dentistry',
  },
  doctorImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  clinicName: {
    type: String,
    required: true,
  },
  clinicAddress: {
    type: String,
    default: 'OralSense Demo Dental Center',
  },
  service: {
    type: String,
    default: 'Dental Consultation',
  },
  concern: {
    type: String,
    default: 'General Oral Symptoms',
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  consultationType: {
    type: String,
    default: 'In-Person',
  },
  bookingSource: {
    type: String,
    enum: ['screening', 'direct-service'],
    default: 'screening',
  },

  // Coverage Breakdown
  coverageType: {
    type: String,
    default: 'PPO Insurance Demo',
  },
  insuranceProvider: {
    type: String,
    default: 'Demo Dental Care',
  },
  estimatedCoverage: {
    type: Number,
    default: 120,
  },
  patientResponsibility: {
    type: Number,
    default: 60,
  },

  // Payment Breakdown
  paymentMethod: {
    type: String,
    enum: ['demo-card', 'demo-wallet', 'pay-at-clinic', 'card', 'wallet', 'clinic', 'pending'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'demo-completed', 'completed'],
    default: 'pending',
  },
  paymentAmount: {
    type: Number,
    default: 60,
  },

  patientNotes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },
  fee: {
    type: Number,
    default: 180,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
