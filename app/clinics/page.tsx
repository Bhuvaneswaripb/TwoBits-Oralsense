'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CLINICS } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Phone, Clock, Building2, ChevronRight, Star, Stethoscope } from 'lucide-react';

export default function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClinics = MOCK_CLINICS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
          PARTNER DENTAL HOSPITALS & CENTERS
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Dental Hospitals & Clinics
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Browse verified dental practices, departments, and available dental specialists.
        </p>
      </div>

      {/* Search Input */}
      <Card className="p-4 shadow-subtle border-slate-200 max-w-xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clinic/hospital name, department, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>
      </Card>

      {/* Clinic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <Card key={clinic.id} hoverable className="flex flex-col justify-between p-6 shadow-subtle border-slate-200/80 group">
            <div className="space-y-4">
              
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-slate-900/80 text-white border-slate-700 backdrop-blur-md">
                    {clinic.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-950 group-hover:text-brand-600 transition-colors">
                  {clinic.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {clinic.address}
                </p>
              </div>

              <div className="py-2 border-y border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rating:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {clinic.rating} ({clinic.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Available Doctors:</span>
                  <span className="font-bold text-brand-900">{clinic.doctors.length} Dentists</span>
                </div>
              </div>

              {/* Department Badges */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Departments</div>
                <div className="flex flex-wrap gap-1.5">
                  {clinic.departments.slice(0, 3).map((dept, i) => (
                    <Badge key={i} variant="neutral" className="text-[10px]">{dept}</Badge>
                  ))}
                  {clinic.departments.length > 3 && (
                    <Badge variant="neutral" className="text-[10px]">+{clinic.departments.length - 3} more</Badge>
                  )}
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href={`/clinics/${clinic.id}`}>
                <Button variant="primary" size="sm" className="w-full justify-between" icon={<ChevronRight className="w-4 h-4" />}>
                  View Clinic & Dentists
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
