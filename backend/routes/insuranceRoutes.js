const express = require('express');
const router = express.Router();
const InsuranceProfile = require('../models/InsuranceProfile');

// GET /api/insurance/:patientId - Fetch insurance profile for patient
router.get('/:patientId', async (req, res) => {
  try {
    const profile = await InsuranceProfile.findOne({ patientId: req.params.patientId }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      data: profile || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/insurance - Create or update insurance profile
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      country,
      provider,
      planName,
      memberId,
      policyNumber,
      coverageType,
      policyStartDate,
      policyEndDate,
      dentalCoverage,
      annualLimit,
      remainingBenefit,
      waitingPeriod,
      preAuthorizationRequired,
    } = req.body;

    if (!provider) {
      return res.status(400).json({ success: false, message: 'Insurance provider is required.' });
    }

    const pid = patientId || 'pat-default';

    let profile = await InsuranceProfile.findOne({ patientId: pid });
    if (profile) {
      profile.country = country || profile.country;
      profile.provider = provider;
      profile.planName = planName || profile.planName;
      profile.memberId = memberId || profile.memberId;
      profile.policyNumber = policyNumber || profile.policyNumber;
      profile.coverageType = coverageType || profile.coverageType;
      profile.policyStartDate = policyStartDate || profile.policyStartDate;
      profile.policyEndDate = policyEndDate || profile.policyEndDate;
      profile.dentalCoverage = dentalCoverage || profile.dentalCoverage;
      profile.annualLimit = annualLimit !== undefined ? Number(annualLimit) : profile.annualLimit;
      profile.remainingBenefit = remainingBenefit !== undefined ? Number(remainingBenefit) : profile.remainingBenefit;
      profile.waitingPeriod = waitingPeriod || profile.waitingPeriod;
      profile.preAuthorizationRequired = preAuthorizationRequired || profile.preAuthorizationRequired;
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      profile = await InsuranceProfile.create({
        patientId: pid,
        country: country || 'United States',
        provider,
        planName: planName || 'Standard Dental Plan',
        memberId: memberId || '',
        policyNumber: policyNumber || '',
        coverageType: coverageType || 'Comprehensive Dental',
        policyStartDate: policyStartDate || '',
        policyEndDate: policyEndDate || '',
        dentalCoverage: dentalCoverage || ['Preventive', 'Basic'],
        annualLimit: Number(annualLimit) || 1500,
        remainingBenefit: Number(remainingBenefit) || 1200,
        waitingPeriod: waitingPeriod || 'None',
        preAuthorizationRequired: preAuthorizationRequired || 'No',
        isUserProvided: true,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
      disclaimer: 'User-provided insurance information. Verify with official insurance provider before treatment.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/insurance/:id - Update existing insurance profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await InsuranceProfile.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
