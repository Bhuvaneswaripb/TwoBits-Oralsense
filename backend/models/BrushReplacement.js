const mongoose = require('mongoose');

const brushReplacementSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'pat-default',
  },
  childId: {
    type: String,
    required: true,
  },
  lastReplacementDate: {
    type: String,
    required: true, // YYYY-MM-DD
  },
  nextReminderDate: {
    type: String,
    required: true, // YYYY-MM-DD
  },
  notes: {
    type: String,
    default: 'Suggested 3-month brush head replacement interval.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BrushReplacement', brushReplacementSchema);
