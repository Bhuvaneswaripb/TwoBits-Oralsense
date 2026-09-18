'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, ShieldCheck, Globe, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIZED_DENTAL_SERVICES } from '@/data/mockData';
import { InsuranceRegion } from '@/types';

export default function ServicesPage() {
  const [selectedRegion, setSelectedRegion] = useState<InsuranceRegion>('US');

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-bold">
          DIRECT SERVICE BOOKING
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight uppercase">
          LOOKING FOR A DENTAL SERVICE?
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Patients who already know what service they need are not forced through medical AI screening. Choose a service below to find a provider directly.
        </p>
      </div>

      {/* Service Categories Sections */}
      <div className="space-y-12">
        {CATEGORIZED_DENTAL_SERVICES.map((cat, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <Badge variant={cat.badgeVariant} className="text-xs font-bold">{cat.badgeText}</Badge>
              <h2 className="text-xl font-extrabold text-brand-950 tracking-wide">{cat.categoryName}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.services.map((serv) => (
                <Card key={serv.id} hoverable className="p-6 bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between space-y-6 group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                        {serv.icon}
                      </div>
                      <Badge variant="success" className="text-[10px] font-bold">DIRECT CARE</Badge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-600 transition-colors">
                        {serv.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{serv.description}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/find-care?service=${encodeURIComponent(serv.id)}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full justify-between font-bold text-xs"
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Find Dentist
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section 3: CHECK COVERAGE BEFORE YOU BOOK */}
      <Card className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6 border border-slate-800 shadow-premium">
        <div className="max-w-3xl space-y-2">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px] font-bold">
            INSURANCE & COVERAGE PREVIEW
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Check Coverage Before You Book
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your dental coverage may vary by country, insurance plan, provider and treatment. Review available coverage information before confirming an appointment.
          </p>
        </div>

        {/* Compact Horizontal Country Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-800 rounded-2xl border border-slate-700 max-w-md">
          <button
            type="button"
            onClick={() => setSelectedRegion('US')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              selectedRegion === 'US'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            🇺🇸 UNITED STATES
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion('UK')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              selectedRegion === 'UK'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            🇬🇧 UNITED KINGDOM
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion('Australia')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              selectedRegion === 'Australia'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            🇦🇺 AUSTRALIA
          </button>
        </div>

        {/* DEMO Coverage Information Cards */}
        {selectedRegion === 'US' && (
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-3">
              <span className="font-bold text-cyan-300">Provider: Demo Dental PPO</span>
              <Badge variant="success" className="text-[10px]">In-network</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Insurance Provider</span>
                <div className="font-semibold text-white">Demo Dental PPO</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Network Status</span>
                <div className="font-semibold text-emerald-400">In-network</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Coverage</span>
                <div className="font-semibold text-white">Demo estimate (80%)</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Patient Cost</span>
                <div className="font-extrabold text-cyan-300">$20 – $40 copay</div>
              </div>
            </div>
          </div>
        )}

        {selectedRegion === 'UK' && (
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-3">
              <span className="font-bold text-cyan-300">Care pathway: NHS / Private</span>
              <Badge variant="neutral" className="text-[10px] bg-slate-700 text-slate-200">UK Demo</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">NHS Band 1 Diagnosis</span>
                <div className="font-semibold text-white">£26.80 fixed NHS fee</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Private Dental Consultation</span>
                <div className="font-semibold text-white">£60 – £120 demo estimate</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 italic">
              Note: NHS and private availability, as well as treatment eligibility, can vary depending on local clinic capacity and patient status.
            </p>
          </div>
        )}

        {selectedRegion === 'Australia' && (
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-3">
              <span className="font-bold text-cyan-300">Private Extras Coverage</span>
              <Badge variant="success" className="text-[10px]">Australian Demo</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Private Extras</span>
                <div className="font-semibold text-white">Bupa / Medibank Extras</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Rebate</span>
                <div className="font-semibold text-emerald-400">Demo rebate ($80–$120)</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Gap</span>
                <div className="font-extrabold text-cyan-300">$30 demo estimate gap</div>
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Safety Disclaimers */}
        <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Important Coverage Notice:</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            <strong>Coverage estimate — demonstration only.</strong> Actual coverage depends on your policy, provider and treatment. OralSense does not provide insurance approval or guarantee reimbursement.
          </p>
        </div>
      </Card>

      {/* Notice Box */}
      <div className="p-6 rounded-3xl bg-brand-50 border border-brand-200 text-center space-y-2 max-w-2xl mx-auto shadow-subtle">
        <h4 className="text-sm font-bold text-brand-950 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          Fast-Track Dental Care Booking
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Selecting a service bypasses medical AI screening and routes you directly to dentist selection, clinic details, and available appointment slots.
        </p>
      </div>

    </div>
  );
}

