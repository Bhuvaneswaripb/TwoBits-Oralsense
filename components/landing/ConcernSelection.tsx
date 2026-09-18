'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FEATURED_CONCERNS, SECONDARY_CONCERNS } from '@/data/mockData';
import { ConcernType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SecondaryConcernsModal } from '@/components/landing/SecondaryConcernsModal';
import {
  Activity,
  Zap,
  HeartPulse,
  Thermometer,
  ShieldAlert,
  Search,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Scissors,
  Wind,
  AlertCircle,
  Volume2,
  FileText,
  SlidersHorizontal,
  X,
  Smile,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-6 h-6 text-cyan-400" />,
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-500" />,
  Thermometer: <Thermometer className="w-6 h-6 text-cyan-600" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-indigo-600" />,
  Scissors: <Scissors className="w-6 h-6 text-purple-600" />,
  AlertCircle: <AlertCircle className="w-6 h-6 text-emerald-600" />,
  Volume2: <Volume2 className="w-6 h-6 text-blue-600" />,
  Wind: <Wind className="w-6 h-6 text-teal-600" />,
  FileText: <FileText className="w-6 h-6 text-slate-600" />,
};

// Keyword Search Mapping Engine
const SERVICE_ALIASES: Record<string, string> = {
  cleaning: 'Teeth Cleaning & Scaling',
  scaling: 'Teeth Cleaning & Scaling',
  whitening: 'Teeth Whitening',
  bleaching: 'Teeth Whitening',
  veneers: 'Dental Veneers',
  veneer: 'Dental Veneers',
  bonding: 'Dental Bonding',
  contouring: 'Tooth & Gum Contouring',
  implants: 'Dental Implants',
  implant: 'Dental Implants',
  fillings: 'Fillings',
  filling: 'Fillings',
  'root canal': 'Root Canal Consultation',
  crown: 'Crown Consultation',
  crowns: 'Crown Consultation',
  braces: 'Braces Consultation',
  aligners: 'Clear Aligners Consultation',
  aligner: 'Clear Aligners Consultation',
  checkup: 'Routine Dental Check-up',
  'check-up': 'Routine Dental Check-up',
};

const CONCERN_ALIASES: Record<string, ConcernType> = {
  grinding: 'Bruxism & Jaw Health',
  clenching: 'Bruxism & Jaw Health',
  'jaw pain': 'Bruxism & Jaw Health',
  jaw: 'Bruxism & Jaw Health',
  tmj: 'Jaw / TMJ Symptoms',
  'cold tooth': 'Tooth Sensitivity',
  cold: 'Tooth Sensitivity',
  hot: 'Tooth Sensitivity',
  sensitivity: 'Tooth Sensitivity',
  bleeding: 'Gum Health',
  'gum bleeding': 'Gum Health',
  gums: 'Gum Health',
  cavity: 'Tooth Pain & Cavity Concerns',
  toothache: 'Tooth Pain & Cavity Concerns',
  pain: 'Tooth Pain & Cavity Concerns',
  crack: 'Tooth Wear',
  chipped: 'Tooth Wear',
  'cracked tooth': 'Tooth Wear',
  ulcer: 'Oral Ulcer Concerns',
  ulcers: 'Oral Ulcer Concerns',
  'mouth ulcer': 'Oral Ulcer Concerns',
  'mouth ulcers': 'Oral Ulcer Concerns',
  sore: 'Oral Ulcer Concerns',
  sores: 'Oral Ulcer Concerns',
  'mouth sore': 'Oral Ulcer Concerns',
  'mouth sores': 'Oral Ulcer Concerns',
  'bad breath': 'Bad Breath',
  halitosis: 'Bad Breath',
  'dry mouth': 'Dry Mouth',
  wisdom: 'Wisdom Tooth Concerns',
  enamel: 'Enamel Damage',
  discoloration: 'Enamel Damage',
  'tooth discoloration': 'Enamel Damage',
  yellowing: 'Enamel Damage',
  swollen: 'Swollen / Painful Gums',
  'swollen gums': 'Swollen / Painful Gums',
  'loose tooth': 'Other Dental Concern',
};

interface ConcernSelectionProps {
  onSelectConcern?: (concern: ConcernType) => void;
  showServices?: boolean;
}

export const ConcernSelection: React.FC<ConcernSelectionProps> = ({
  onSelectConcern,
  showServices = true,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allConcerns = [...FEATURED_CONCERNS, ...SECONDARY_CONCERNS];

  const qClean = searchQuery.toLowerCase().trim();

  // Check service hit
  const matchedServiceEntry = Object.entries(SERVICE_ALIASES).find(([alias]) =>
    qClean.includes(alias)
  );
  const matchedServiceName = matchedServiceEntry ? matchedServiceEntry[1] : null;

  // Intelligently filter concerns based on text or alias map
  const getFilteredConcerns = () => {
    if (!qClean || matchedServiceName) return [];

    const aliasHit = Object.entries(CONCERN_ALIASES).find(([alias]) => qClean.includes(alias));
    if (aliasHit) {
      return allConcerns.filter((c) => c.id === aliasHit[1]);
    }

    return allConcerns.filter(
      (c) =>
        c.title.toLowerCase().includes(qClean) ||
        c.description.toLowerCase().includes(qClean) ||
        c.id.toLowerCase().includes(qClean)
    );
  };

  const filtered = getFilteredConcerns();

  const handleConcernClick = (id: ConcernType) => {
    if (onSelectConcern) {
      onSelectConcern(id);
    } else {
      router.push(`/screening?concern=${encodeURIComponent(id)}`);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Search & Header Section */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-brand-100 text-brand-800 border-brand-200">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-600" />
          AI-ASSISTED SCREENING & CARE NAVIGATION
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          WHAT BRINGS YOU HERE TODAY?
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Select a primary oral concern or search for dental services.
        </p>

        {/* Looking for something else? Search Bar */}
        <div className="pt-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Looking for something else?
          </div>
          <div className="relative max-w-lg mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search a dental concern or service... (e.g. mouth ulcers, bad breath, whitening, root canal)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 shadow-subtle rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS VIEW */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          
          {matchedServiceName ? (
            /* Service Search Hit */
            <Card className="p-6 bg-cyan-50/80 border border-cyan-200 text-center space-y-4 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center mx-auto text-2xl font-bold">
                ✨
              </div>
              <h3 className="text-lg font-bold text-brand-950">
                Looking for {matchedServiceName}?
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Direct service booking available. Patients seeking direct dental treatments do not need to go through medical AI screening.
              </p>
              <Link href={`/find-care?service=${encodeURIComponent(matchedServiceName)}`}>
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Find Dentist for {matchedServiceName}
                </Button>
              </Link>
            </Card>
          ) : filtered.length > 0 ? (
            /* Matching Concern Cards */
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                Matching Screening Categories ({filtered.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleConcernClick(item.id)}
                    className="p-5 rounded-2xl bg-white border border-brand-200 shadow-subtle hover:shadow-premium hover:border-brand-500 text-left transition-all duration-200 flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                      {ICON_MAP[item.iconName] || <Activity className="w-6 h-6 text-brand-600" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="text-sm font-bold text-brand-950 group-hover:text-brand-600 transition-colors flex items-center justify-between">
                        <span>{item.title}</span>
                        <ArrowRight className="w-4 h-4 text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-slate-600">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* No Match Fallback */
            <Card className="p-8 text-center space-y-4 max-w-md mx-auto bg-white border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No matching concern found for "{searchQuery}"</h3>
                <p className="text-xs text-slate-500">
                  You can start with a general screening or search for a dental professional.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleConcernClick('Other Dental Concern')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Start with Other Dental Concern
              </Button>
            </Card>
          )}

        </div>
      ) : (
        /* STANDARD 6 PRIMARY CONCERNS GRID ONLY */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_CONCERNS.map((item) => (
              <Card
                key={item.id}
                hoverable
                className={`p-6 border flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-premium group cursor-pointer ${
                  item.isFlagship
                    ? 'bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white border-brand-800'
                    : 'bg-white border-slate-200/80 shadow-subtle'
                }`}
                onClick={() => handleConcernClick(item.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        item.isFlagship
                          ? 'bg-white/10 text-cyan-300 border border-white/10'
                          : 'bg-slate-100/80 border border-slate-200/60'
                      }`}
                    >
                      {ICON_MAP[item.iconName] || <Activity className="w-6 h-6 text-brand-600" />}
                    </div>
                    {item.isFlagship && (
                      <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-300 border-cyan-400/30 font-bold text-[10px]">
                        ⭐ FLAGSHIP
                      </Badge>
                    )}
                  </div>

                  <h3
                    className={`text-lg font-bold ${
                      item.isFlagship ? 'text-white' : 'text-brand-950 group-hover:text-brand-600'
                    } transition-colors`}
                  >
                    {item.title}
                  </h3>

                  <p className={`text-xs leading-relaxed ${item.isFlagship ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100/20">
                  <Button
                    variant={item.isFlagship ? 'primary' : 'outline'}
                    size="sm"
                    className={`w-full justify-between font-bold ${
                      item.isFlagship
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-brand-950 border-0'
                        : 'group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600'
                    }`}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start Screening
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* VIEW ALL DENTAL CONCERNS BUTTON */}
          <div className="text-center pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(true)}
              icon={<SlidersHorizontal className="w-4 h-4 text-brand-600" />}
              className="font-bold text-xs"
            >
              View All Dental Concerns (Oral Ulcers, Bad Breath, Dry Mouth, TMJ, etc.)
            </Button>
          </div>
        </div>
      )}

      {/* LOOKING FOR A DENTAL SERVICE? SECTION */}
      {showServices && (
        <div className="pt-8 border-t border-slate-200/80 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
              DIRECT SERVICE BOOKING
            </Badge>
            <h3 className="text-2xl font-extrabold text-brand-950 tracking-tight uppercase">
              LOOKING FOR A DENTAL SERVICE?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Routine cleaning and teeth whitening do not require AI medical screening. Select a service to connect directly with available dentists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Service 1: Teeth Cleaning */}
            <Card
              hoverable
              className="p-6 bg-white border-2 border-emerald-100 hover:border-emerald-500 rounded-3xl space-y-4 shadow-subtle hover:shadow-premium group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-3xl flex items-center justify-center border border-emerald-100">
                  🦷
                </div>
                <Badge variant="success">DIRECT BOOKING</Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-brand-950 group-hover:text-emerald-700 transition-colors">
                  Teeth Cleaning
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Professional dental plaque, tartar scaling, and preventative oral hygiene care with a verified dentist.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/find-care?service=Teeth+Cleaning">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-0"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Find Dentist for Cleaning
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 2: Teeth Whitening */}
            <Card
              hoverable
              className="p-6 bg-white border-2 border-cyan-100 hover:border-cyan-500 rounded-3xl space-y-4 shadow-subtle hover:shadow-premium group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-3xl flex items-center justify-center border border-cyan-100">
                  ✨
                </div>
                <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
                  COSMETIC CARE
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-brand-950 group-hover:text-cyan-700 transition-colors">
                  Teeth Whitening
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Safe professional enamel stain removal and teeth brightening treatments performed by dental clinicians.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/find-care?service=Teeth+Whitening">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold border-0"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Find Dentist for Whitening
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Secondary Concerns Modal Drawer */}
      <SecondaryConcernsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Subtle Disclaimer */}
      <div className="text-center text-xs text-slate-400 italic">
        "OralSense provides an early screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation."
      </div>
    </div>
  );
};
