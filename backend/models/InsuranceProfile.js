const mongoose = require('mongoose');

const insuranceProfileSchema = new mongoose.Schema({
  patientId: {
    type: String,
    default: 'pat-default',
  },
  country: {
    type: String,
    enum: ['United States', 'United Kingdom', 'Australia', 'Other', 'US', 'UK'],
    default: 'United States',
  },
  provider: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    default: 'Standard Dental Plan',
  },
  memberId: {
    type: String,
    default: '',
  },
  policyNumber: {
    type: String,
    default: '',
  },
  coverageType: {
    type: String,
    default: 'Comprehensive Dental',
  },
  policyStartDate: {
    type: String,
    default: '',
  },
  policyEndDate: {
    type: String,
    default: '',
  },
  dentalCoverage: {
    type: [String],
    default: ['Preventive', 'Basic'],
  },
  annualLimit: {
    type: Number,
    default: 1500,
  },
  remainingBenefit: {
    type: Number,
    default: 1200,
  },
  deductible: {
    type: Number,
    default: 50,
  },
  copayment: {
    type: Number,
    default: 25,
  },
  waitingPeriod: {
    type: String,
    default: 'None',
  },
  preAuthorizationRequired: {
    type: String,
    enum: ['Yes', 'No', 'Unknown'],
    default: 'No',
  },
  isUserProvided: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InsuranceProfile', insuranceProfileSchema);
