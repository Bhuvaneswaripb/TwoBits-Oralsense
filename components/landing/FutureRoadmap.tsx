'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const FutureRoadmap: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="neutral" className="text-[10px] uppercase font-bold tracking-wider">
            PRODUCT ROADMAP
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
            BruxShield Platform Evolution
          </h2>
        </div>

        {/* 3 Simple Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* NOW */}
          <Card className="p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-brand-900 text-cyan-300">
                STAGE 1 • NOW
              </span>
              <Badge variant="success">Active Core</Badge>
            </div>
            
            <h3 className="text-base font-bold text-brand-950">Core Early-Screening Platform</h3>
            
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Digital multi-condition screening</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>AI-assisted symptom organization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Appointment booking & patient dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Symptom monitoring & post-visit follow-up</span>
              </li>
            </ul>
          </Card>

          {/* NEXT */}
          <Card className="p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-900 border border-cyan-200">
                STAGE 2 • NEXT
              </span>
              <Badge variant="neutral">In Progress</Badge>
            </div>

            <h3 className="text-base font-bold text-brand-950">Expanded Practice Integration</h3>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Dental practice EHR/PMS integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Advanced AI assistance & pattern matching</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Personalized care journeys</span>
              </li>
            </ul>
          </Card>

          {/* FUTURE */}
          <Card className="p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200">
                STAGE 3 • FUTURE
              </span>
              <Badge variant="neutral">Hardware Concept</Badge>
            </div>

            <h3 className="text-base font-bold text-brand-950">Smart Hardware Integration</h3>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Optional smart monitoring hardware</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Bruxism pressure & clenching sensor telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Additional validated clinical technologies</span>
              </li>
            </ul>
          </Card>

        </div>

      </div>
    </section>
  );
};
