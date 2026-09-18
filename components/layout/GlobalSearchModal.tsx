'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Activity, Stethoscope, Building2, User, ChevronRight, Sparkles } from 'lucide-react';
import { MOCK_DOCTORS, MOCK_CLINICS, FEATURED_CONCERNS, SECONDARY_CONCERNS, DENTAL_SERVICES } from '@/data/mockData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingConcerns = q
    ? [...FEATURED_CONCERNS, ...SECONDARY_CONCERNS].filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      )
    : [];

  const matchingServices = q
    ? DENTAL_SERVICES.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      )
    : [];

  const matchingDoctors = q
    ? MOCK_DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.clinic.toLowerCase().includes(q)
      )
    : [];

  const matchingClinics = q
    ? MOCK_CLINICS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.departments.some((dept) => dept.toLowerCase().includes(q))
      )
    : [];

  const totalHits =
    matchingConcerns.length + matchingServices.length + matchingDoctors.length + matchingClinics.length;

  const handleSelectRoute = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search concern, service, dentist, clinic, or hospital... (e.g. bleeding gums, whitening, Dr. Ananya)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-medium focus:outline-none text-brand-950 placeholder:text-slate-400"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1">
              ESC
            </button>
          )}
        </div>

        {/* Search Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!q ? (
            <div className="space-y-4 text-center py-6">
              <Sparkles className="w-8 h-8 text-cyan-500 mx-auto animate-pulse" />
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900">Type to search OralSense Platform</div>
                <div className="text-xs text-slate-500">
                  Search dental concerns, symptoms, direct services, verified dentists, or clinics.
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['Bruxism', 'Tooth Pain', 'Teeth Cleaning', 'Teeth Whitening', 'Periodontist', 'Dr. Ananya'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalHits === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-slate-400 text-xs font-mono">No direct matches for "{query}"</div>
              <p className="text-xs text-slate-500">Try searching for keywords like "pain", "cleaning", "whitening", or "gums".</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Concerns */}
              {matchingConcerns.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-600" /> Screening Concerns ({matchingConcerns.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingConcerns.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectRoute(`/screening?concern=${encodeURIComponent(c.id)}`)}
                        className="w-full p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-300 text-left flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-brand-950 group-hover:text-cyan-900">{c.title}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md">{c.description}</div>
                        </div>
                        <Badge variant="primary" className="text-[10px] shrink-0">Screen Now →</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Services */}
              {matchingServices.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Direct Services ({matchingServices.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingServices.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectRoute(`/find-care?service=${encodeURIComponent(s.id)}`)}
                        className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-left flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-brand-950 group-hover:text-emerald-900">{s.title}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md">{s.description}</div>
                        </div>
                        <Badge variant="success" className="text-[10px] shrink-0">Direct Booking →</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors */}
              {matchingDoctors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-600" /> Verified Dentists ({matchingDoctors.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingDoctors.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleSelectRoute(`/doctors/${d.id}`)}
                        className="w-full p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-left flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={d.image} alt={d.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="text-xs font-bold text-brand-950 group-hover:text-brand-700">{d.name}</div>
                            <div className="text-[11px] text-slate-500">{d.specialty} • {d.clinic}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinics & Hospitals */}
              {matchingClinics.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Clinics & Hospitals ({matchingClinics.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchingClinics.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectRoute(`/clinics/${c.id}`)}
                        className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 text-left flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-brand-950 group-hover:text-indigo-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.type} • {c.location}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
