'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Shield, Sparkles, CheckCircle2, Activity, HeartPulse, ShieldCheck, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const Hero: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string>('bruxism');

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-brand-300/15 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subheading, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200/80 text-brand-900 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>DENTAL EARLY-SCREENING & CARE PLATFORM</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-950 leading-[1.12]">
              Understand Your Dental Concern.{' '}
              <span className="gradient-text">Find the Right Care.</span>
            </h1>

            {/* Supporting Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Screen common dental concerns, understand your symptoms, connect with the right dental professional, and continue your care journey.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/screening" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto text-base font-bold shadow-premium hover:shadow-glow"
                >
                  Start Screening
                </Button>
              </Link>

              <Link href="/find-care" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Search className="w-4 h-4 text-brand-600" />}
                  className="w-full sm:w-auto text-base font-bold"
                >
                  Find Care
                </Button>
              </Link>
            </div>

            {/* Core Journey Pathway Bar */}
            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs font-extrabold text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" /> SCREEN
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" /> ANALYZE
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" /> CONNECT
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" /> CARE
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" /> MONITOR
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Care Journey Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl bg-white p-6 shadow-premium border border-slate-200/80 space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      OralSense Patient Journey
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 text-[10px]">Non-Diagnostic</Badge>
                </div>

                {/* Symptom Selection Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSymptom('bruxism')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                      selectedSymptom === 'bruxism'
                        ? 'bg-cyan-50 border border-cyan-300 text-cyan-900 shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Bruxism ⭐
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSymptom('pain')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                      selectedSymptom === 'pain'
                        ? 'bg-cyan-50 border border-cyan-300 text-cyan-900 shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Tooth Pain
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSymptom('gums')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                      selectedSymptom === 'gums'
                        ? 'bg-cyan-50 border border-cyan-300 text-cyan-900 shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Gum Health
                  </button>
                </div>

                {/* Preview Card Body */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-950 text-white space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-mono text-[10px]">AI-ASSISTED SCREENING</span>
                    <span className="text-slate-400 text-[10px]">Step 2 of 5</span>
                  </div>

                  {selectedSymptom === 'bruxism' && (
                    <div className="space-y-1">
                      <div className="text-sm font-bold flex items-center gap-2 text-white">
                        <Activity className="w-4 h-4 text-cyan-400" /> Bruxism & Jaw Health Highlighted
                      </div>
                      <p className="text-xs text-slate-300">
                        Morning stiffness & clenching reported. Connected to TMJ & occlusal specialists.
                      </p>
                    </div>
                  )}

                  {selectedSymptom === 'pain' && (
                    <div className="space-y-1">
                      <div className="text-sm font-bold flex items-center gap-2 text-white">
                        <Thermometer className="w-4 h-4 text-amber-400" /> Tooth Pain / Cavity Assessment
                      </div>
                      <p className="text-xs text-slate-300">
                        Biting pain & cold sensitivity logged. Prefilled summary ready for dentist evaluation.
                      </p>
                    </div>
                  )}

                  {selectedSymptom === 'gums' && (
                    <div className="space-y-1">
                      <div className="text-sm font-bold flex items-center gap-2 text-white">
                        <HeartPulse className="w-4 h-4 text-rose-400" /> Gum Tenderness Assessment
                      </div>
                      <p className="text-xs text-slate-300">
                        Bleeding frequency recorded. Connected with periodontal specialists for care.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                    <span className="text-slate-400">Care Status</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Care Provider Connected
                    </span>
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <Link href="/screening" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
                    Try Interactive Screening →
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
