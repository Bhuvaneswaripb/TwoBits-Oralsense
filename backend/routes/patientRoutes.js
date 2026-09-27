const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

const calculateAgeFromDOB = (dobStr) => {
  if (!dobStr) return 29;
  const birthDate = new Date(dobStr);
  if (isNaN(birthDate.getTime())) {
    const num = parseInt(dobStr, 10);
    return isNaN(num) ? 29 : num;
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
};

// POST /api/patients - Create new patient profile
router.post('/', async (req, res) => {
  try {
    const { name, email, dateOfBirth, age, country } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const calculatedAge = dateOfBirth ? calculateAgeFromDOB(dateOfBirth) : (Number(age) || 29);
    const calculatedMode = calculatedAge < 16 ? 'kid' : 'adult';

    const patient = await Patient.create({
      name,
      email,
      dateOfBirth: dateOfBirth || '',
      age: calculatedAge,
      mode: calculatedMode,
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
      const age = 29;
      return res.json({
        success: true,
        data: {
          _id: req.params.id,
          name: 'Mahesh Kumar',
          email: 'mahesh.kumar@example.com',
          dateOfBirth: '1997-05-15',
          age: age,
          mode: age < 16 ? 'kid' : 'adult',
          country: 'India',
          location: 'Bengaluru, Karnataka',
          phone: '+91 98765 43210',
        },
      });
    }

    const age = patient.dateOfBirth ? calculateAgeFromDOB(patient.dateOfBirth) : (patient.age || 29);
    const mode = age < 16 ? 'kid' : 'adult';

    res.json({
      success: true,
      data: {
        ...patient.toObject(),
        age,
        mode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
