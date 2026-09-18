const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// POST /api/appointments - Book a new appointment
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      providerId,
      doctorName,
      doctorSpecialty,
      doctorImage,
      clinicName,
      clinicAddress,
      service,
      concern,
      date,
      time,
      consultationType,
      bookingSource,
      fee,
      estimatedCoverage,
      patientNotes,
    } = req.body;

    if (!providerId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Provider ID, date, and time are required.' });
    }

    const providerFee = Number(fee) || 180;
    const estCoverage = Number(estimatedCoverage) || 120;
    const patientResponsibility = Math.max(0, providerFee - estCoverage);

    const source = bookingSource === 'direct-service' ? 'direct-service' : 'screening';

    const newAppointment = new Appointment({
      patientId: patientId || 'pat-default',
      providerId,
      doctorName: doctorName || 'Dr. Ananya Menon',
      doctorSpecialty: doctorSpecialty || 'Orofacial Pain & TMJ Specialist',
      doctorImage: doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      clinicName: clinicName || 'SmileCare Advanced Dental Center',
      clinicAddress: clinicAddress || 'Indiranagar 100ft Rd, Bengaluru',
      service: service || 'Dental Consultation',
      concern: concern || 'General Dental Symptoms',
      date,
      time,
      consultationType: consultationType || 'In-Person',
      bookingSource: source,
      fee: providerFee,
      estimatedCoverage: estCoverage,
      patientResponsibility,
      paymentMethod: 'pending',
      paymentStatus: 'pending',
      paymentAmount: patientResponsibility,
      patientNotes: patientNotes || '',
      status: 'Upcoming',
    });

    let savedApt;
    try {
      savedApt = await newAppointment.save();
    } catch (dbErr) {
      savedApt = newAppointment.toObject();
    }

    res.status(201).json({
      success: true,
      data: savedApt,
      disclaimer: {
        estimate: 'Coverage estimate — demonstration only.',
        policyNote: 'Actual coverage depends on your policy, provider and treatment.',
        guarantee: 'OralSense does not provide insurance approval or guarantee reimbursement.',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/appointments/:patientId - Fetch appointments for patient
router.get('/:patientId', async (req, res) => {
  try {
    let appointments = [];
    try {
      appointments = await Appointment.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    } catch (e) {
      appointments = [];
    }

    if (!appointments || appointments.length === 0) {
      appointments = [
        {
          id: 'apt-101',
          patientId: req.params.patientId,
          providerId: 'doc-1',
          doctorName: 'Dr. Ananya Menon',
          doctorSpecialty: 'TMJ / Orofacial Pain / Occlusal Care',
          doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          clinicName: 'SmileCare Advanced Dental & TMJ Center',
          clinicAddress: 'Indiranagar 100ft Rd, Bengaluru',
          date: 'Tomorrow',
          time: '10:30 AM',
          consultationType: 'In-Person',
          bookingSource: 'screening',
          status: 'Upcoming',
          fee: 180,
          estimatedCoverage: 120,
          patientResponsibility: 60,
          paymentStatus: 'demo-completed',
          paymentAmount: 60,
          patientNotes: 'Screening follow-up for Bruxism & Jaw Health.',
          createdAt: new Date().toISOString(),
        },
      ];
    }

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/appointments/:id/payment - Process demo payment
router.post('/:id/payment', async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const allowedMethods = ['demo-card', 'demo-wallet', 'pay-at-clinic', 'card', 'wallet', 'clinic'];
    const selectedMethod = allowedMethods.includes(paymentMethod) ? paymentMethod : 'demo-card';

    let appointment;
    try {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        appointment = await Appointment.findById(req.params.id);
      } else {
        appointment = await Appointment.findOne({ id: req.params.id });
      }
    } catch (e) {
      appointment = null;
    }

    const amountPaid = appointment ? appointment.patientResponsibility : 60;

    if (appointment) {
      appointment.paymentStatus = 'demo-completed';
      appointment.paymentMethod = selectedMethod;
      appointment.paymentAmount = amountPaid;
      try {
        await appointment.save();
      } catch (e) {
        // memory fallback
      }
    }

    res.json({
      success: true,
      message: 'Demo payment completed successfully.',
      paymentStatus: 'demo-completed',
      paymentMethod: selectedMethod,
      amount: amountPaid,
      disclaimer: 'Prototype payment — no real financial charge occurred.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/appointments/:id - Update appointment status or notes
router.patch('/:id', async (req, res) => {
  try {
    const { status, patientNotes } = req.body;
    let appointment;
    try {
      appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { ...(status && { status }), ...(patientNotes && { patientNotes }) },
        { new: true }
      );
    } catch (e) {
      appointment = null;
    }

    res.json({ success: true, data: appointment || { id: req.params.id, status: status || 'Upcoming' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
