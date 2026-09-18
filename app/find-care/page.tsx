'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_DOCTORS, MOCK_CLINICS } from '@/data/mockData';
import { Doctor, DentalClinic, ConcernType, ServiceType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Calendar, Clock, ShieldCheck, Filter, Star, ChevronRight, Building2, Stethoscope, Phone } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function FindCareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const concernParam = searchParams?.get('concern') as ConcernType | null;
  const serviceParam = searchParams?.get('service') as ServiceType | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Doctors' | 'Clinics'>('All');
  const [filterByScreening, setFilterByScreening] = useState<boolean>(!!concernParam || !!serviceParam);

  // Concern to Specialty Mapping
  const getRecommendedSpecialtyForConcern = (c: ConcernType): string => {
    switch (c) {
      case 'Bruxism & Jaw Health':
      case 'Jaw / TMJ Symptoms':
        return 'TMJ / Orofacial Pain / Occlusal Care';
      case 'Gum Health':
      case 'Bad Breath':
      case 'Swollen / Painful Gums':
      case 'Oral Ulcer Concerns':
        return 'Periodontal / Gum Care';
      case 'Tooth Wear':
      case 'Enamel Damage':
        return 'Restorative / Prosthodontic / Occlusal Care';
      case 'Tooth Pain & Cavity Concerns':
      case 'Tooth Sensitivity':
      case 'Cracked / Chipped Tooth':
      case 'Wisdom Tooth Concerns':
        return 'General / Restorative Dentistry';
      default:
        return 'General / Restorative Dentistry';
    }
  };

  const getRecommendedSpecialtyForService = (s: ServiceType): string => {
    switch (s) {
      case 'Teeth Cleaning & Scaling':
      case 'Teeth Cleaning':
      case 'Routine Dental Check-up':
        return 'General / Preventive Dentist';
      case 'Teeth Whitening':
      case 'Dental Veneers':
      case 'Dental Bonding':
      case 'Tooth & Gum Contouring':
        return 'Cosmetic Dentistry';
      case 'Dental Implants':
      case 'Crown Consultation':
      case 'Night Guard / Bruxism Care':
        return 'Restorative / Prosthodontic / Occlusal Care';
      case 'Fillings':
      case 'Root Canal Consultation':
      case 'Tooth Restoration':
        return 'General / Restorative Dentistry';
      case 'Braces Consultation':
      case 'Clear Aligners Consultation':
        return 'Orthodontic Care';
      default:
        return 'General / Restorative Dentistry';
    }
  };

  const activeRecommendation = concernParam
    ? { title: concernParam, specialty: getRecommendedSpecialtyForConcern(concernParam), type: 'screening' }
    : serviceParam
    ? { title: serviceParam, specialty: getRecommendedSpecialtyForService(serviceParam), type: 'service' }
    : null;

  // Filter Doctors List
  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.clinic.toLowerCase().includes(q) ||
      doc.clinicAddress.toLowerCase().includes(q) ||
      doc.areasOfCare.some((a) => a.toLowerCase().includes(q));

    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesType = selectedType === 'All' || doc.consultationType.includes(selectedType as any);
    const matchesToday = !onlyAvailableToday || doc.availableToday;

    let matchesScreening = true;
    if (filterByScreening && activeRecommendation) {
      if (activeRecommendation.type === 'screening' && doc.relevantConcerns) {
        matchesScreening = doc.relevantConcerns.includes(concernParam!);
      } else if (activeRecommendation.type === 'service' && doc.relevantServices) {
        matchesScreening = doc.relevantServices.includes(serviceParam!) || doc.relevantServices.some(s => s.toLowerCase().includes(serviceParam!.toLowerCase()));
      }
    }

    return matchesSearch && matchesSpecialty && matchesType && matchesToday && matchesScreening;
  });

  // Filter Clinics List
  const filteredClinics = MOCK_CLINICS.filter((clinic) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      clinic.name.toLowerCase().includes(q) ||
      clinic.location.toLowerCase().includes(q) ||
      clinic.departments.some((d) => d.toLowerCase().includes(q)) ||
      clinic.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-bold">
          VERIFIED DENTAL CARE NETWORK
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Find the Right Dental Care
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Connect with verified dental professionals, clinics, and hospitals for in-person consultations or video assessments.
        </p>
      </div>

      {/* SCREENING OR SERVICE RECOMMENDATION BANNER */}
      {activeRecommendation && (
        <div className="p-6 rounded-3xl bg-brand-950 text-white border border-brand-800 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px]">
                {activeRecommendation.type === 'service' ? 'DIRECT SERVICE SELECTION' : 'RELEVANT CARE CATEGORY'}
              </Badge>
              <span className="text-xs text-slate-300 font-mono">
                {activeRecommendation.title}
              </span>
            </div>
            
            {activeRecommendation.type === 'service' ? (
              <>
                <div className="text-base font-bold text-white">
                  Finding dental professionals for: <span className="text-cyan-300">{activeRecommendation.title}</span>
                </div>
                <p className="text-xs text-slate-300">
                  Direct service booking. Choose a provider below to schedule your appointment.
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-bold text-white">
                  Relevant Care Category: <span className="text-cyan-300">{activeRecommendation.specialty}</span>
                </div>
                <p className="text-xs text-slate-300">
                  Consider discussing your symptoms with a dental professional.
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {filterByScreening ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterByScreening(false)}
                className="border-white/30 text-white hover:bg-white/10 text-xs font-bold"
              >
                View All Care Providers
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setFilterByScreening(true)}
                className="bg-cyan-500 text-brand-950 font-bold border-0 text-xs"
              >
                Filter for {activeRecommendation.title}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Prominent Multi-Field Search & Filter Bar */}
      <Card className="p-4 sm:p-6 shadow-subtle border-slate-200/80 space-y-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dentist, clinic, hospital, specialty or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Specialty Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Specialties</option>
              <option value="TMJ / Orofacial Pain / Occlusal Care">TMJ & Orofacial Pain</option>
              <option value="Periodontal / Gum Care">Periodontal & Gum Care</option>
              <option value="Restorative / Prosthodontic / Occlusal Care">Prosthodontics & Restorative</option>
              <option value="General / Restorative Dentistry">General / Restorative Dentistry</option>
              <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
            </select>
          </div>

          {/* Consultation Type Selector */}
          <div className="md:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="In-Person">In-Person Only</option>
              <option value="Video Consultation">Video Consultation</option>
            </select>
          </div>

          {/* Available Today Toggle */}
          <div className="md:col-span-3 flex items-center justify-end">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors w-full justify-center">
              <input
                type="checkbox"
                checked={onlyAvailableToday}
                onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Available Today</span>
            </label>
          </div>

        </div>
      </Card>

      {/* Tabs: All / Dentists / Hospitals & Clinics */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('All')}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'All'
                ? 'border-brand-600 text-brand-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Care ({filteredDoctors.length + filteredClinics.length})
          </button>
          <button
            onClick={() => setActiveTab('Doctors')}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'Doctors'
                ? 'border-brand-600 text-brand-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Dentists ({filteredDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('Clinics')}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'Clinics'
                ? 'border-brand-600 text-brand-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Hospitals & Clinics ({filteredClinics.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:block">Bengaluru Region</span>
      </div>

      {/* DOCTOR CARDS GRID */}
      {(activeTab === 'All' || activeTab === 'Doctors') && (
        <div className="space-y-4">
          {activeTab === 'All' && (
            <h2 className="text-lg font-extrabold text-brand-950 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-600" /> Verified Dental Professionals
            </h2>
          )}

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <Card key={doc.id} hoverable className="flex flex-col justify-between p-6 shadow-subtle border-slate-200/80 group bg-white">
                  <div className="space-y-4">
                    
                    {/* Photo & Main Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-600 transition-colors">
                            {doc.name}
                          </h3>
                          {doc.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-slate-600">{doc.title}</div>
                        <div className="text-xs text-brand-700 font-bold">{doc.specialty}</div>
                      </div>
                    </div>

                    {/* Clinic & Location */}
                    <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-semibold text-slate-800">{doc.clinic}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.clinicAddress}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{doc.rating}</span>
                          <span className="text-slate-400 font-normal">({doc.reviewCount} reviews)</span>
                        </div>
                        <span className="text-slate-500 font-medium">{doc.experienceYears} yrs exp</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {doc.availableToday && (
                        <Badge variant="success" className="text-[10px]">Available Today</Badge>
                      )}
                      {doc.consultationType.map((t, i) => (
                        <Badge key={i} variant="neutral" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>

                  </div>

                  {/* Fee & View Profile CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Fee</div>
                      <div className="text-base font-extrabold text-brand-900">{formatCurrency(doc.consultationFee)}</div>
                    </div>

                    <Link href={`/doctors/${doc.id}${concernParam ? `?concern=${encodeURIComponent(concernParam)}` : ''}`}>
                      <Button variant="primary" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                        View Profile
                      </Button>
                    </Link>
                  </div>

                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-xs text-slate-500">
              No doctors match your search filters.
            </Card>
          )}
        </div>
      )}

      {/* HOSPITALS & CLINICS GRID */}
      {(activeTab === 'All' || activeTab === 'Clinics') && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-extrabold text-brand-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" /> Dental Hospitals & Clinics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id} hoverable className="flex flex-col justify-between p-6 shadow-subtle border-slate-200/80 group bg-white">
                <div className="space-y-4">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-slate-900/80 text-white backdrop-blur-md">
                        {clinic.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-600 transition-colors">
                      {clinic.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {clinic.address}
                    </p>
                  </div>

                  <div className="py-2 border-y border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Available Doctors:</span>
                      <strong className="text-brand-900">{clinic.doctors.length} Dentists</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Rating:</span>
                      <strong className="text-amber-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> {clinic.rating} ({clinic.reviewCount})
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href={`/clinics/${clinic.id}`}>
                    <Button variant="outline" size="sm" className="w-full justify-between font-bold" icon={<ChevronRight className="w-4 h-4" />}>
                      View Clinic & Dentists
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default function FindCarePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading Find Care directory...</p>
          </div>
        </div>
      }
    >
      <FindCareContent />
    </Suspense>
  );
}
