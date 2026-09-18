'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_CLINICS } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Phone, Clock, Building2, ArrowLeft, Star, ShieldCheck, ChevronRight, Stethoscope } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ClinicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clinicId = params?.id as string;

  const clinic = MOCK_CLINICS.find((c) => c.id === clinicId) || MOCK_CLINICS[0];

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Back Link */}
      <button
        onClick={() => router.push('/clinics')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dental Clinics Directory
      </button>

      {/* Main Clinic Header Card */}
      <Card className="p-6 sm:p-8 shadow-premium border-brand-100 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 relative h-64 rounded-3xl overflow-hidden border border-slate-200">
            <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-slate-900/80 text-white backdrop-blur-md">
                {clinic.type}
              </Badge>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="primary">{clinic.location}</Badge>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {clinic.rating} ({clinic.reviewCount} reviews)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
                {clinic.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                {clinic.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Opening Hours</span>
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" /> {clinic.openingHours}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Contact Option</span>
                <a href={`tel:${clinic.phone}`} className="font-bold text-brand-700 hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-600" /> {clinic.phone}
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{clinic.about}</p>

            <div className="flex items-center gap-2 pt-1">
              {clinic.consultationTypes.map((t, i) => (
                <Badge key={i} variant="neutral" className="text-xs">{t}</Badge>
              ))}
            </div>

          </div>

        </div>
      </Card>

      {/* Departments & Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dental Departments */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            Dental Departments
          </h2>
          <div className="space-y-2">
            {clinic.departments.map((dept, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>{dept}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Dental Services Available */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-cyan-600" />
            Services Provided
          </h2>
          <div className="flex flex-wrap gap-2">
            {clinic.services.map((serv, i) => (
              <Badge key={i} variant="secondary" className="text-xs py-1.5 px-3">
                {serv}
              </Badge>
            ))}
          </div>
        </Card>

      </div>

      {/* Available Dental Professionals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="primary" className="mb-1">CLINIC STAFF</Badge>
            <h2 className="text-2xl font-extrabold text-brand-950">Available Dental Professionals</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {clinic.doctors.length} clinicians at this location
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinic.doctors.map((doc) => (
            <Card key={doc.id} hoverable className="p-6 border border-slate-200 flex flex-col justify-between space-y-4 shadow-subtle group">
              <div className="flex items-start gap-4">
                <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-600 transition-colors">
                      {doc.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">{doc.title}</div>
                  <div className="text-xs text-brand-700 font-bold">{doc.specialty}</div>
                </div>
              </div>

              <div className="py-2 border-y border-slate-100 text-xs flex items-center justify-between text-slate-600">
                <span>Fee: <strong className="text-brand-900">{formatCurrency(doc.consultationFee)}</strong></span>
                <span>Exp: <strong className="text-slate-800">{doc.experienceYears} yrs</strong></span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-bold">Slots Available Today</span>
                <Link href={`/doctors/${doc.id}`}>
                  <Button variant="primary" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                    Select Slots & Book
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
