'use client';

import React from 'react';
import Link from 'next/link';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Cpu, Stethoscope, Activity, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-bold">
          COMPLETE PATIENT CARE PATHWAY
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          How OralSense Connects Your Care
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Combining AI-assisted symptom screening, direct service booking, international coverage estimates, and continuous post-visit care tracking into ONE simple journey.
        </p>
      </div>

      {/* 6-Step Visual Pathway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { step: '1', title: 'IDENTIFY', desc: 'Choose your dental concern or select a service directly for fast-track booking.' },
          { step: '2', title: 'SCREEN', desc: 'Answer relevant questions when screening is useful. Optional photo/video check.' },
          { step: '3', title: 'CONNECT', desc: 'Connect with verified dental professionals, clinics, and hospitals specialized in your care category.' },
          { step: '4', title: 'UNDERSTAND COST', desc: 'Review international coverage estimates (US PPO, UK NHS/Private, AU Extras gap) before booking.' },
          { step: '5', title: 'BOOK & PAY DEMO', desc: 'Choose your preferred appointment slot and simulate demo payment.' },
          { step: '6', title: 'CONTINUE CARE', desc: 'Log symptom updates and view provider reports through My Dental Journey.' },
        ].map((item, idx) => (
          <Card key={idx} className="p-6 bg-white border border-slate-200/80 shadow-subtle space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-brand-900 text-white font-extrabold text-xs flex items-center justify-center">
                {item.step}
              </span>
              <Badge variant="neutral" className="text-[10px]">STEP {item.step}</Badge>
            </div>
            <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      {/* Section 23: International Market Positioning */}
      <Card className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6 border border-slate-800 shadow-premium">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px] font-bold">
            GLOBAL ADAPTABILITY
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Designed Around Real-World Dental Care Frictions
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            OralSense adapts to different healthcare and payment environments while maintaining the same simple patient journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* US */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">🇺🇸 United States</span>
              <Badge variant="primary" className="bg-cyan-500/20 text-cyan-300 text-[10px]">COST TRANSPARENCY</Badge>
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Problem:</span>
              <p className="text-slate-300">High cost uncertainty and confusing out-of-pocket PPO deductibles.</p>
            </div>
            <div className="space-y-1 text-xs pt-1 border-t border-slate-700">
              <span className="text-[10px] text-cyan-400 font-bold uppercase">How OralSense Helps:</span>
              <p className="text-slate-200 font-semibold">Estimates network coverage & copays before appointment confirmation.</p>
            </div>
          </div>

          {/* UK */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">🇬🇧 United Kingdom</span>
              <Badge variant="primary" className="bg-cyan-500/20 text-cyan-300 text-[10px]">CARE NAVIGATION</Badge>
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Problem:</span>
              <p className="text-slate-300">Confusion between NHS availability and Private dental options.</p>
            </div>
            <div className="space-y-1 text-xs pt-1 border-t border-slate-700">
              <span className="text-[10px] text-cyan-400 font-bold uppercase">How OralSense Helps:</span>
              <p className="text-slate-200 font-semibold">Clarifies NHS Band charges vs Private booking pathways.</p>
            </div>
          </div>

          {/* AU */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">🇦🇺 Australia</span>
              <Badge variant="primary" className="bg-cyan-500/20 text-cyan-300 text-[10px]">GAP-COST TRANSPARENCY</Badge>
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Problem:</span>
              <p className="text-slate-300">Unexpected out-of-pocket gap payments after private extras rebates.</p>
            </div>
            <div className="space-y-1 text-xs pt-1 border-t border-slate-700">
              <span className="text-[10px] text-cyan-400 font-bold uppercase">How OralSense Helps:</span>
              <p className="text-slate-200 font-semibold">Calculates estimated extras rebate and remaining patient gap.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action CTA */}
      <div className="p-8 rounded-3xl bg-brand-900 text-white text-center space-y-6 shadow-premium">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Start your personalized care journey today</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Screen your symptoms or select a direct service in less than 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/screening">
            <Button variant="primary" size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0 text-xs">
              Start Free Screening
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-xs font-bold">
              Browse Dental Services
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

