const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// POST /api/patients - Create new patient profile
router.post('/', async (req, res) => {
  try {
    const { name, email, age, country } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const patient = await Patient.create({
      name,
      email,
      age: age || 29,
      country: country || 'India',
    });

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/patients/:id - Fetch patient details
router.get('/:id', async (req, res) => {
  try {
    let patient;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(req.params.id);
    }
    
    if (!patient) {
      // Default demo profile fallback
      return res.json({
        success: true,
        data: {
          _id: req.params.id,
          name: 'Mahesh Kumar',
          email: 'mahesh.kumar@example.com',
          age: 29,
          country: 'India',
          location: 'Bengaluru, Karnataka',
          phone: '+91 98765 43210',
        },
      });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
