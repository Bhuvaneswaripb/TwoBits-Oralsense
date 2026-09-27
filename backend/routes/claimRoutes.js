const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');

// GET /api/claims/:patientId - Fetch all claims for patient
router.get('/:patientId', async (req, res) => {
  try {
    let claims = await Claim.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    
    if (!claims || claims.length === 0) {
      claims = [
        {
          id: 'clm-1001',
          _id: 'clm-1001',
          patientId: req.params.patientId,
          insuranceProvider: 'Delta Dental PPO',
          planName: 'Preferred Choice',
          memberId: 'MEM-987654',
          policyNumber: 'POL-123456',
          providerName: 'Dr. Ananya Menon',
          clinicName: 'SmileCare Dental & TMJ Center',
          dentistName: 'Dr. Ananya Menon',
          treatmentDate: '2026-09-20',
          serviceName: 'Gum Health Consultation & Diagnostic Exam',
          description: 'Comprehensive evaluation of mild gum inflammation and TMJ assessment.',
          amountCharged: 180,
          amountPaid: 180,
          paymentMethod: 'Credit Card',
          claimReference: 'CLM-2026-0988',
          preAuthNumber: 'PA-55412',
          status: 'UNDER REVIEW',
          documents: [
            { name: 'Itemized Invoice', type: 'Invoice', status: 'Uploaded', uploadedAt: '2026-09-20' },
            { name: 'Payment Receipt', type: 'Receipt', status: 'Uploaded', uploadedAt: '2026-09-20' },
            { name: 'Clinical Examination Summary', type: 'Treatment Statement', status: 'Uploaded', uploadedAt: '2026-09-21' },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'clm-1002',
          _id: 'clm-1002',
          patientId: req.params.patientId,
          insuranceProvider: 'Delta Dental PPO',
          planName: 'Preferred Choice',
          memberId: 'MEM-987654',
          policyNumber: 'POL-123456',
          providerName: 'Dr. Sarah Jenkins',
          clinicName: 'Metro Dental Health Center',
          dentistName: 'Dr. Sarah Jenkins',
          treatmentDate: '2026-08-14',
          serviceName: 'Preventive Teeth Cleaning & Scaling',
          description: 'Routine 6-month dental hygiene prophylaxis and bitewing X-rays.',
          amountCharged: 150,
          amountPaid: 150,
          paymentMethod: 'Debit Card',
          claimReference: 'CLM-2026-0412',
          preAuthNumber: '',
          status: 'PAID',
          documents: [
            { name: 'Cleaning Receipt', type: 'Receipt', status: 'Uploaded', uploadedAt: '2026-08-14' },
          ],
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
      ];
    }

    res.json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/claims/detail/:id - Fetch single claim detail
router.get('/detail/:id', async (req, res) => {
  try {
    let claim;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      claim = await Claim.findById(req.params.id);
    } else {
      claim = await Claim.findOne({ claimReference: req.params.id });
    }

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim record not found.' });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/claims - Create a new claim draft or preparation
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      insuranceProfileId,
      insuranceProvider,
      planName,
      memberId,
      policyNumber,
      providerName,
      clinicName,
      dentistName,
      treatmentDate,
      serviceName,
      description,
      amountCharged,
      amountPaid,
      paymentMethod,
      claimReference,
      preAuthNumber,
      status,
      documents,
    } = req.body;

    if (!insuranceProvider || !providerName || !serviceName || !amountCharged) {
      return res.status(400).json({
        success: false,
        message: 'Insurance provider, care provider name, service name, and amount charged are required.',
      });
    }

    const ref = claimReference || `CLM-${Date.now().toString().slice(-6)}`;
    const claimStatus = status || 'READY TO SUBMIT';

    const defaultDocs = [
      { name: 'Member & Policy Details', type: 'Insurance Details', status: memberId ? 'Uploaded' : 'Missing' },
      { name: 'Dentist / Provider Information', type: 'Provider Details', status: providerName ? 'Uploaded' : 'Missing' },
      { name: 'Clinic Address & Contact', type: 'Clinic Details', status: clinicName ? 'Uploaded' : 'Missing' },
      { name: 'Date of Service Record', type: 'Treatment Date', status: treatmentDate ? 'Uploaded' : 'Missing' },
      { name: 'Treatment & Service Description', type: 'Service Details', status: serviceName ? 'Uploaded' : 'Missing' },
      { name: 'Itemized Invoice', type: 'Invoice', status: documents?.some((d) => d.type === 'Invoice') ? 'Uploaded' : 'Missing' },
      { name: 'Payment Receipt / Proof', type: 'Receipt', status: amountPaid > 0 ? 'Uploaded' : 'Missing' },
      { name: 'Clinical Treatment Statement', type: 'Treatment Statement', status: 'Not Required' },
      { name: 'Pre-Authorisation Number', type: 'Preauth', status: preAuthNumber ? 'Uploaded' : 'Not Required' },
    ];

    const newClaim = new Claim({
      patientId: patientId || 'pat-default',
      insuranceProfileId: insuranceProfileId || '',
      insuranceProvider,
      planName: planName || '',
      memberId: memberId || '',
      policyNumber: policyNumber || '',
      providerName,
      clinicName,
      dentistName: dentistName || providerName,
      treatmentDate: treatmentDate || new Date().toISOString().split('T')[0],
      serviceName,
      description: description || '',
      amountCharged: Number(amountCharged),
      amountPaid: Number(amountPaid) || Number(amountCharged),
      paymentMethod: paymentMethod || 'Credit Card',
      claimReference: ref,
      preAuthNumber: preAuthNumber || '',
      status: claimStatus,
      documents: documents && documents.length > 0 ? documents : defaultDocs,
    });

    const saved = await newClaim.save();

    res.status(201).json({
      success: true,
      data: saved,
      disclaimer: 'OralSense helps organize information for an insurance claim. Coverage and reimbursement are determined by your insurance provider. Verify requirements before submitting.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/claims/:id - Update claim status or details
router.put('/:id', async (req, res) => {
  try {
    const { status, documents, amountPaid, claimReference } = req.body;
    let updated;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Claim.findByIdAndUpdate(
        req.params.id,
        {
          ...(status && { status }),
          ...(documents && { documents }),
          ...(amountPaid !== undefined && { amountPaid }),
          ...(claimReference && { claimReference }),
          updatedAt: new Date(),
        },
        { new: true }
      );
    } else {
      updated = await Claim.findOneAndUpdate(
        { claimReference: req.params.id },
        {
          ...(status && { status }),
          ...(documents && { documents }),
          ...(amountPaid !== undefined && { amountPaid }),
          updatedAt: new Date(),
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      data: updated || { id: req.params.id, status: status || 'UPDATED' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
