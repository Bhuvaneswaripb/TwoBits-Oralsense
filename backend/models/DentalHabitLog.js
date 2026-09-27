const mongoose = require('mongoose');

const dentalHabitLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'pat-default',
  },
  childId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true, // YYYY-MM-DD
  },
  morningBrushing: {
    type: Boolean,
    default: false,
  },
  morningTongue: {
    type: Boolean,
    default: false,
  },
  eveningBrushing: {
    type: Boolean,
    default: false,
  },
  eveningFloss: {
    type: Boolean,
    default: false,
  },
  totalBrushingSeconds: {
    type: Number,
    default: 0,
  },
  completedSessions: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

dentalHabitLogSchema.index({ childId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DentalHabitLog', dentalHabitLogSchema);
