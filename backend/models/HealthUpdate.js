const mongoose = require('mongoose');

const healthUpdateSchema = new mongoose.Schema({
  patientId: {
    type: String,
    default: 'pat-default',
  },
  type: {
    type: String,
    enum: ['New Symptom', 'Worsened', 'Improved', 'Routine Note', 'Worse', 'No Change'],
    default: 'New Symptom',
  },
  concern: {
    type: String,
    default: 'Gum Health',
  },
  note: {
    type: String,
    required: [true, 'Health update note is required'],
  },
  sharedWithProvider: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthUpdate', healthUpdateSchema);
