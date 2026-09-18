const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  patientId: {
    type: String,
    default: 'pat-default',
  },
  concern: {
    type: String,
    required: [true, 'Screening concern is required'],
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  indicationLevel: {
    type: String,
    enum: ['LOWER CONCERN', 'MODERATE CONCERN', 'HIGHER CONCERN'],
    default: 'MODERATE CONCERN',
  },
  summary: {
    type: String,
    default: 'AI-assisted screening summary generated based on patient symptoms.',
  },
  recommendedNextStep: {
    type: String,
    default: 'Consider discussing these symptoms with a dental professional during your consultation.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Screening', screeningSchema);
