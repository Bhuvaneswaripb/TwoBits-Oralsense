'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Cpu, Activity, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export const FutureTechSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          
          {/* Background Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-5">
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 font-bold text-[10px]">
                FLAGSHIP FEATURE • BRUXISM & JAW HEALTH
              </Badge>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Advanced Bruxism Monitoring
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                For patients with ongoing bruxism or clenching concerns, OralSense can support a future smart oral monitoring system that tracks relevant jaw/oral activity and helps patients and dental professionals follow trends over time.
              </p>

              {/* Current vs Smart Monitoring Concept */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <Badge variant="success" className="text-[10px]">CURRENT PROTOTYPE</Badge>
                  <div className="text-sm font-bold text-white pt-1">App-Based Screening & Care</div>
                  <p className="text-xs text-slate-400">
                    Symptom screening questionnaire + daily symptom logging & dentist connection.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 space-y-1">
                  <Badge variant="primary" className="bg-cyan-500/20 text-cyan-300 text-[10px]">SMART MONITORING CONCEPT</Badge>
                  <div className="text-sm font-bold text-cyan-200 pt-1">Smart Oral Device Integration</div>
                  <p className="text-xs text-cyan-300/80">
                    App screening + Optional smart oral device → monitoring data → patient dashboard → dentist review.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-cyan-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>
                  <strong>Optional Feature Notice:</strong> The smart device is specifically designed for bruxism/clenching monitoring. It is not required to use core OralSense screening and does not interpret non-grinding dental conditions.
                </span>
              </div>

              <div className="pt-2">
                <Link href="/mouthguard">
                  <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs font-bold" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Hardware Concept Studio
                  </Button>
                </Link>
              </div>

            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 w-full max-w-sm text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shadow-inner">
                  <Activity className="w-8 h-8 text-cyan-400" />
                </div>
                
                <div className="space-y-1">
                  <Badge variant="neutral" className="text-[10px] uppercase font-mono bg-white/10 text-cyan-300">
                    Smart Monitoring Concept
                  </Badge>
                  <div className="text-xl font-extrabold text-white">Nightly Force Tracker</div>
                  <div className="text-xs text-slate-400">Pressure events & duration tracking</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-left text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 text-[11px]">
                    <span>Sample Telemetry</span>
                    <span className="text-amber-400 font-mono text-[10px]">Demo / Simulated Device Data</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nightly Clenching Events:</span>
                      <strong className="text-white">24 events</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Peak Bite Pressure:</span>
                      <strong className="text-cyan-300">68% max</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Morning Stiffness Level:</span>
                      <strong className="text-emerald-400">Moderate</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
