const express = require('express');
const router = express.Router();
const Screening = require('../models/Screening');

// POST /api/screenings - Save new AI-assisted screening summary
router.post('/', async (req, res) => {
  try {
    const { patientId, concern, score, indicationLevel, summary, recommendedNextStep } = req.body;

    if (!concern) {
      return res.status(400).json({ success: false, message: 'Screening concern is required.' });
    }

    const screeningScore = typeof score === 'number' ? score : 68;
    const level = indicationLevel || (screeningScore >= 70 ? 'HIGHER CONCERN' : screeningScore >= 40 ? 'MODERATE CONCERN' : 'LOWER CONCERN');

    const screening = await Screening.create({
      patientId: patientId || 'pat-default',
      concern,
      score: screeningScore,
      indicationLevel: level,
      summary: summary || 'AI-assisted screening summary generated based on patient symptoms.',
      recommendedNextStep: recommendedNextStep || 'Consider discussing persistent symptoms with a dental professional.',
    });

    res.status(201).json({ success: true, data: screening });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/screenings/:patientId - Get latest screening for patient
router.get('/:patientId', async (req, res) => {
  try {
    const screenings = await Screening.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });

    if (!screenings || screenings.length === 0) {
      return res.json({
        success: true,
        data: {
          id: 'scr-demo-default',
          patientId: req.params.patientId,
          date: new Date().toISOString().split('T')[0],
          concern: 'Bruxism & Jaw Health',
          overallScore: 68,
          indicationLevel: 'HIGHER CONCERN',
          summary: 'AI-assisted screening summary',
          recommendedNextStep: 'Consider scheduling a consultation for an in-person TMJ evaluation.',
          whyHighlighted: [
            'Morning jaw tightness reported consistently',
            'Frequent daytime clenching reported',
            'Temple discomfort upon waking reported',
          ],
        },
      });
    }

    res.json({ success: true, data: screenings[0], history: screenings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
