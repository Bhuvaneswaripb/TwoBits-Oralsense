const mongoose = require('mongoose');

const claimDocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ['Uploaded', 'Missing', 'Not Required'],
    default: 'Missing',
  },
  fileUrl: { type: String, default: '' },
  uploadedAt: { type: String, default: '' },
});

const claimSchema = new mongoose.Schema({
  patientId: {
    type: String,
    default: 'pat-default',
  },
  insuranceProfileId: {
    type: String,
    default: '',
  },
  insuranceProvider: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    default: '',
  },
  memberId: {
    type: String,
    default: '',
  },
  policyNumber: {
    type: String,
    default: '',
  },
  providerName: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
  dentistName: {
    type: String,
    default: '',
  },
  treatmentDate: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  amountCharged: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card',
  },
  claimReference: {
    type: String,
    default: '',
  },
  preAuthNumber: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: [
      'DRAFT',
      'DOCUMENTS NEEDED',
      'READY TO SUBMIT',
      'SUBMITTED',
      'UNDER REVIEW',
      'APPROVED',
      'PARTIALLY REIMBURSED',
      'REJECTED',
      'PAID',
    ],
    default: 'DRAFT',
  },
  documents: [claimDocumentSchema],
  submittedAt: {
    type: Date,
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

module.exports = mongoose.model('Claim', claimSchema);
