const express = require('express');
const router = express.Router();
const Screening = require('../models/Screening');

// POST /api/screenings - Save new AI-assisted screening summary
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      concern,
      score,
      overallScore,
      indicationLevel,
      safety,
      symptoms,
      answers,
      visualInputs,
      hasVisualInput,
      visualInputType,
      whyHighlighted,
      summary,
      recommendedNextStep,
      recommendations,
    } = req.body;

    if (!concern) {
      return res.status(400).json({ success: false, message: 'Screening concern is required.' });
    }

    const screeningScore = typeof score === 'number' ? score : typeof overallScore === 'number' ? overallScore : 50;
    const level =
      indicationLevel ||
      (screeningScore > 60 ? 'HIGHER CONCERN' : screeningScore > 30 ? 'MODERATE CONCERN' : 'LOWER CONCERN');

    const screening = await Screening.create({
      patientId: patientId || 'pat-default',
      concern,
      score: screeningScore,
      overallScore: screeningScore,
      indicationLevel: level,
      safety: safety || {},
      symptoms: symptoms || whyHighlighted || [],
      answers: answers || {},
      visualInputs: visualInputs || [],
      hasVisualInput: Boolean(hasVisualInput || (visualInputs && visualInputs.length > 0)),
      visualInputType: visualInputType || '',
      whyHighlighted: whyHighlighted || symptoms || [],
      summary: summary || recommendedNextStep || `AI-assisted screening summary for ${concern}.`,
      recommendedNextStep:
        recommendedNextStep || `Consider discussing persistent ${concern.toLowerCase()} symptoms with a dental professional.`,
      recommendations: recommendations || [],
    });

    res.status(201).json({ success: true, data: screening });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/screenings/:patientId - Get latest screening and full history for patient
router.get('/:patientId', async (req, res) => {
  try {
    const screenings = await Screening.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });

    if (!screenings || screenings.length === 0) {
      return res.json({
        success: true,
        data: null,
        history: [],
      });
    }

    res.json({ success: true, data: screenings[0], history: screenings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
