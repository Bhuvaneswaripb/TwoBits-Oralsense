const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    default: 'BDS, MDS (Orofacial Pain & TMJ Specialist)',
  },
  specialization: {
    type: String,
    required: true,
  },
  clinic: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  consultationType: {
    type: [String],
    default: ['In-Person', 'Video Consultation'],
  },
  services: {
    type: [String],
    default: ['Teeth Cleaning & Scaling', 'Dental Consultation', 'Night Guard / Bruxism Care'],
  },
  country: {
    type: String,
    default: 'US',
  },
  demoCoverage: {
    providerFee: { type: Number, default: 180 },
    estimatedCoverage: { type: Number, default: 120 },
    patientResponsibility: { type: Number, default: 60 },
  },
  availableSlots: [
    {
      date: String,
      slots: [String],
    },
  ],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  rating: {
    type: Number,
    default: 4.9,
  },
  reviewCount: {
    type: Number,
    default: 128,
  },
});

module.exports = mongoose.model('Provider', providerSchema);
