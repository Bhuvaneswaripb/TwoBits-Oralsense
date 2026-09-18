'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { MOCK_DOCTORS } from '@/data/mockData';
import { Appointment, ConcernType } from '@/types';
import { addAppointment, getStoredScreeningResult } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Calendar, Clock, MapPin, ShieldCheck, ArrowRight, UserCheck, FileText, Sparkles, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const doctorId = searchParams?.get('doctorId') || MOCK_DOCTORS[0].id;
  const initialDate = searchParams?.get('date') || 'Tomorrow';
  const initialSlot = searchParams?.get('slot') || '10:30 AM';
  const concernParam = searchParams?.get('concern') as ConcernType | null;
  const serviceParam = searchParams?.get('service') || null;

  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId) || MOCK_DOCTORS[0];
  const lastScreening = getStoredScreeningResult();

  const isServiceBooking = !!serviceParam;
  const activeConcern = concernParam || lastScreening?.concern || 'Bruxism & Jaw Health';

  // Construct default prefilled reason
  const defaultReason = isServiceBooking
    ? `Direct appointment request for ${serviceParam}.`
    : `Follow-up for symptoms reported during the OralSense screening (${activeConcern}).`;

  const [patientNotes, setPatientNotes] = useState(defaultReason);
  const [paymentOption, setPaymentOption] = useState<'ppo' | 'self' | 'extras'>('ppo');
  const [demoPaymentMethod, setDemoPaymentMethod] = useState<'card' | 'wallet' | 'clinic'>('card');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Simple Insurance Calculation for Booking
  const estOutofPocket = paymentOption === 'ppo' 
    ? Math.round(doctor.consultationFee * 0.2) 
    : paymentOption === 'extras' 
    ? Math.round(doctor.consultationFee * 0.3) 
    : doctor.consultationFee;

  const handleSimulatePayment = () => {
    setPaymentCompleted(true);
  };

  const handleConfirmBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setBookingError(null);

    const aptId = `BRX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApt: Appointment = {
      id: aptId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.image,
      clinicName: doctor.clinic,
      clinicAddress: doctor.clinicAddress,
      date: initialDate,
      time: initialSlot,
      type: 'In-Person',
      status: 'Upcoming',
      patientNotes,
      screeningContext: isServiceBooking 
        ? `Direct Service: ${serviceParam}` 
        : `Screening: ${activeConcern} (${lastScreening?.indicationLevel || 'MODERATE CONCERN'})`,
      fee: doctor.consultationFee,
      insuranceEstimate: {
        region: 'US',
        providerName: paymentOption === 'ppo' ? 'Demo Dental PPO' : paymentOption === 'extras' ? 'Demo Extras Rebate' : 'Self-Pay',
        tierOrPlan: paymentOption === 'ppo' ? 'In-Network' : 'Self-Pay',
        coveragePercent: paymentOption === 'ppo' ? 80 : paymentOption === 'extras' ? 70 : 0,
        estimatedOutofPocket: estOutofPocket,
        isDemoEstimate: true,
        notes: `Demo Payment (${demoPaymentMethod.toUpperCase()}) completed.`,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Send POST request to backend API
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: 'pat-default',
          providerId: doctor.id,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          doctorImage: doctor.image,
          clinicName: doctor.clinic,
          clinicAddress: doctor.clinicAddress,
          service: isServiceBooking ? serviceParam : 'Dental Consultation',
          concern: activeConcern,
          date: initialDate,
          time: initialSlot,
          consultationType: 'In-Person',
          bookingSource: isServiceBooking ? 'direct-service' : 'screening',
          fee: doctor.consultationFee,
          estimatedCoverage: doctor.consultationFee - estOutofPocket,
          patientNotes,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const errMsg = errorJson?.message || `Server returned error (${response.status})`;
        setBookingError(`Booking failed: ${errMsg}`);
        setIsSubmitting(false);
        return;
      }

      // API request succeeded -> save locally for Journey UI & render confirmation
      addAppointment(newApt);
      setConfirmedApt(newApt);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      setBookingError(`Connection error: Unable to reach backend server at http://localhost:5000 (${err.message}).`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Updated 5-Step Stepper Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>1. PROVIDER</span>
          <span>2. DATE</span>
          <span>3. COVERAGE</span>
          <span className={paymentCompleted ? 'text-emerald-600 font-extrabold' : ''}>4. PAYMENT</span>
          <span className="text-brand-700 font-extrabold">5. CONFIRM</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-brand-700 h-2 rounded-full w-full" />
        </div>
      </div>

      {!confirmedApt ? (
        /* Booking Confirmation Card */
        <Card className="p-8 shadow-premium space-y-6 border-brand-100 bg-white">
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
              APPOINTMENT BOOKING & DEMO PAYMENT
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950">Review & Confirm Consultation</h1>
            <p className="text-xs text-slate-500">Review consultation details, coverage estimate, demo payment, and reason for visit.</p>
          </div>

          {/* Doctor Summary Box */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-brand-950">{doctor.name}</h3>
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-xs font-bold text-brand-700">{doctor.specialty}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {doctor.clinic}
              </p>
            </div>
          </div>

          {/* Date, Time & Consultation Type Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-brand-50/80 rounded-2xl border border-brand-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Date</span>
              <div className="text-sm font-extrabold text-brand-900 mt-0.5">{initialDate}</div>
            </div>
            <div className="p-3 bg-brand-50/80 rounded-2xl border border-brand-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Time Slot</span>
              <div className="text-sm font-extrabold text-brand-900 mt-0.5">{initialSlot}</div>
            </div>
            <div className="p-3 bg-brand-50/80 rounded-2xl border border-brand-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Type</span>
              <div className="text-sm font-extrabold text-brand-900 mt-0.5">In-Person</div>
            </div>
          </div>

          {/* SCREENING CONTEXT BANNER (IF FROM SCREENING) */}
          {!isServiceBooking && lastScreening && (
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-1">
              <div className="font-bold text-cyan-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Screening Summary Included
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="font-semibold text-slate-700">Concern: {activeConcern}</span>
                <Badge variant="secondary" className="text-[10px] bg-cyan-100 text-cyan-800">
                  {lastScreening.indicationLevel}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                "{lastScreening.whyHighlighted?.[0] || 'Reported oral symptoms'}"
              </p>
            </div>
          )}

          {/* COVERAGE / COST BREAKDOWN STEP */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600" /> Step 3: Coverage / Cost Estimate
              </span>
              <Badge variant="secondary" className="text-[10px] bg-cyan-100 text-cyan-800 font-bold">
                DEMO ESTIMATE
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Select Insurance / Payment Option</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentOption('ppo')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentOption === 'ppo'
                      ? 'bg-white border-cyan-500 ring-2 ring-cyan-500/20 text-brand-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>Demo Dental PPO</div>
                  <div className="text-[10px] text-emerald-600 font-bold">In-Network (80% Cov.)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption('extras')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentOption === 'extras'
                      ? 'bg-white border-cyan-500 ring-2 ring-cyan-500/20 text-brand-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>Private Extras / NHS</div>
                  <div className="text-[10px] text-cyan-600 font-bold">Rebate / Gap Plan</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption('self')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentOption === 'self'
                      ? 'bg-white border-cyan-500 ring-2 ring-cyan-500/20 text-brand-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>Self-Pay / Direct</div>
                  <div className="text-[10px] text-slate-500 font-bold">Full Out-of-Pocket</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Standard Consultation Fee</span>
                <div className="font-bold text-slate-800">{formatCurrency(doctor.consultationFee)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Patient Out-of-Pocket</span>
                <div className="font-extrabold text-brand-950 text-base">
                  {formatCurrency(estOutofPocket)}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: DEMO PAYMENT */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Step 4: Demo Payment
              </span>
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px] font-bold">
                PROTOTYPE PAYMENT — NO REAL CHARGE
              </Badge>
            </div>

            {!paymentCompleted ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      demoPaymentMethod === 'card'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    💳 Demo Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoPaymentMethod('wallet')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      demoPaymentMethod === 'wallet'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    📱 Demo Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoPaymentMethod('clinic')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      demoPaymentMethod === 'clinic'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    🏥 Pay at Clinic
                  </button>
                </div>

                {demoPaymentMethod === 'card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Cardholder Name</label>
                      <input type="text" readOnly value="Mahesh Kumar (Demo)" className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Demo Card Number</label>
                      <input type="text" readOnly value="•••• •••• •••• 4242" className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Amount Due</span>
                    <div className="text-base font-extrabold text-cyan-300">{formatCurrency(estOutofPocket)}</div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSimulatePayment}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold border-0 text-xs"
                  >
                    Complete Demo Payment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-extrabold text-white">Demo Payment Completed</div>
                    <div className="text-[11px] text-emerald-300">Amount: {formatCurrency(estOutofPocket)} via {demoPaymentMethod.toUpperCase()}</div>
                  </div>
                </div>
                <Badge variant="success" className="bg-emerald-500 text-slate-950 font-bold text-[10px]">
                  VERIFIED DEMO
                </Badge>
              </div>
            )}
          </div>

          {/* Reason for Visit / Patient Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" />
                Reason for Visit
              </label>
              <span className="text-[10px] text-brand-600 font-semibold">Editable</span>
            </div>

            <textarea
              rows={3}
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-800 font-medium"
            />
          </div>

          {/* Patient-Controlled Data Sharing Consent */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Information to Share with Your Dental Professional
              </span>
              <Badge variant="success" className="text-[10px]">Your Consent</Badge>
            </div>
            
            <p className="text-xs text-slate-500">
              Select which details you authorize to share with {doctor.name} prior to your visit (shared only with your consent):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                <span>Basic Profile & Symptoms</span>
              </label>
              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                <span>AI Screening Summary</span>
              </label>
              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                <span>Relevant Symptom History</span>
              </label>
              <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                <span>Uploaded Media (Photo/Video)</span>
              </label>
            </div>
          </div>

          {/* CTA */}
          {bookingError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 text-center">
              {bookingError}
            </div>
          )}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              icon={<CheckCircle2 className="w-5 h-5" />}
              className="w-full text-base font-bold shadow-premium"
            >
              {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment Booking'}
            </Button>
          </div>

        </Card>
      ) : (
        /* Success Screen */
        <Card className="p-8 sm:p-12 shadow-2xl text-center space-y-6 border-emerald-200 bg-white animate-in fade-in zoom-in-95 duration-300">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <Badge variant="success" className="text-xs py-1 px-3">APPOINTMENT CONFIRMED</Badge>
            <h1 className="text-3xl font-extrabold text-brand-950">Appointment Confirmed!</h1>
            <p className="text-xs text-slate-500">
              Booking Reference ID: <strong className="text-slate-800 font-mono">#{confirmedApt.id}</strong>
            </p>
          </div>

          {/* Detailed Appointment Box */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
              <div>
                <div className="text-base font-bold text-slate-900">{doctor.name}</div>
                <div className="text-xs text-brand-700 font-bold">{doctor.specialty}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div><strong>Clinic / Hospital:</strong> <br /><span className="text-slate-900 font-semibold">{doctor.clinic}</span></div>
              <div><strong>Consultation Type:</strong> <br /><span className="text-slate-900 font-semibold">{confirmedApt.type}</span></div>
              <div><strong>Date:</strong> <br /><span className="text-slate-900 font-semibold">{confirmedApt.date}</span></div>
              <div><strong>Time Slot:</strong> <br /><span className="text-slate-900 font-semibold">{confirmedApt.time}</span></div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800">Reason for Visit:</div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] leading-relaxed italic">
                "{confirmedApt.patientNotes}"
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/appointments')}
              icon={<Calendar className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold text-xs"
            >
              View My Appointments
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/dashboard')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold text-xs"
            >
              Go to My Dental Journey
            </Button>
          </div>

        </Card>
      )}

    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading appointment confirmation...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
