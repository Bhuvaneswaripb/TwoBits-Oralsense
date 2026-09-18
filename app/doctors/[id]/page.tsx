'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MOCK_DOCTORS } from '@/data/mockData';
import { ConcernType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, MapPin, Calendar, Clock, Star, Award, CheckCircle2, ArrowLeft, Video, Building2, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getStoredScreeningResult } from '@/lib/storage';

import { InsuranceCoverageWidget } from '@/components/ui/InsuranceCoverageWidget';

function DoctorProfileContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const docId = params?.id as string;
  const concernParam = searchParams?.get('concern') as ConcernType | null;

  const doctor = MOCK_DOCTORS.find((d) => d.id === docId) || MOCK_DOCTORS[0];
  const lastScreening = getStoredScreeningResult();

  const activeConcern = concernParam || lastScreening?.concern || 'Bruxism & Jaw Health';

  const [selectedDate, setSelectedDate] = useState(doctor.availableSlots[0]?.date || 'Today');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(doctor.availableSlots[0]?.slots[0] || null);

  const currentSlotObj = doctor.availableSlots.find((s) => s.date === selectedDate);
  const slotsList = currentSlotObj ? currentSlotObj.slots : ['09:00 AM', '10:30 AM', '12:00 PM', '03:30 PM', '05:00 PM'];

  const handleBook = () => {
    if (!selectedSlot) return;
    router.push(
      `/book-appointment?doctorId=${doctor.id}&date=${encodeURIComponent(selectedDate)}&slot=${encodeURIComponent(selectedSlot)}&concern=${encodeURIComponent(activeConcern)}`
    );
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Back Link */}
      <button
        onClick={() => router.push('/doctors')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dentist Directory
      </button>

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 shadow-premium border-brand-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Doctor Photo */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
              {doctor.isVerified && (
                <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 flex items-center gap-1 text-xs font-bold text-cyan-700">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Badge variant="primary">{doctor.specialty}</Badge>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-slate-400 font-normal">({doctor.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
                {doctor.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">{doctor.title}</p>
            </div>

            {/* WHY THIS DENTIST MAY BE RELEVANT */}
            <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-cyan-900">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Why this dentist may be relevant:
              </div>
              <p className="text-slate-700">
                Relevant to your <strong className="text-brand-900">{activeConcern}</strong> screening and clinical care needs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-slate-100 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Experience</span>
                <div className="font-bold text-slate-900">{doctor.experienceYears} Years</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Consultation Fee</span>
                <div className="font-bold text-brand-800">{formatCurrency(doctor.consultationFee)}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Clinic</span>
                <div className="font-bold text-slate-900 truncate">{doctor.clinic}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{doctor.clinicAddress}</span>
            </div>

          </div>

        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: About & Education */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-950">About {doctor.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{doctor.about}</p>
            
            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Areas of Specialty Care</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.areasOfCare.map((area, i) => (
                  <Badge key={i} variant="secondary">{area}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              Qualifications & Education
            </h2>
            <ul className="space-y-2">
              {doctor.education.map((edu, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Compact Coverage Information Box */}
          <Card className="p-5 bg-white border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              Coverage Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Demo insurance accepted</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>In-network status available</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Coverage estimate available</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Coverage estimates are provided for demonstration purposes only. Final coverage depends on your policy and provider.
            </p>
          </Card>

          {/* International Insurance Estimator Widget */}
          <InsuranceCoverageWidget baseConsultationFee={doctor.consultationFee} />

        </div>

        {/* Right Column: Appointment Slot Picker Widget */}
        <div className="lg:col-span-5">
          <Card className="p-6 shadow-premium border-brand-200 sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Select Appointment Slot
              </h2>
            </div>

            {/* Date Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Choose Date</label>
              <div className="grid grid-cols-3 gap-2">
                {doctor.availableSlots.map((slotGroup) => (
                  <button
                    key={slotGroup.date}
                    onClick={() => {
                      setSelectedDate(slotGroup.date);
                      setSelectedSlot(slotGroup.slots[0] || null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedDate === slotGroup.date
                        ? 'bg-brand-800 border-brand-800 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {slotGroup.date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Times</label>
              <div className="grid grid-cols-2 gap-2">
                {slotsList.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 ring-2 ring-cyan-500/20 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300'
                      }`}
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`} />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking CTA Button */}
            <div className="pt-2 space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base font-bold shadow-premium"
                disabled={!selectedSlot}
                onClick={handleBook}
              >
                Book Appointment ({selectedDate} at {selectedSlot})
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                Instant confirmation • Reason for visit prefilled from screening
              </p>
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
}

export default function DoctorProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading dentist profile...</p>
          </div>
        </div>
      }
    >
      <DoctorProfileContent />
    </Suspense>
  );
}
