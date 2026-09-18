'use client';

import React from 'react';
import Link from 'next/link';
import { OpeningSplash } from '@/components/layout/OpeningSplash';
import { Hero } from '@/components/landing/Hero';
import { ConcernSelection } from '@/components/landing/ConcernSelection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FutureTechSection } from '@/components/landing/FutureTechSection';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ArrowRight, ShieldCheck, Stethoscope, Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      
      {/* Opening Splash Experience (Shown once per session) */}
      <OpeningSplash />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. What Brings You Here Today? (6 Primary Concerns + Services) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ConcernSelection showServices={true} />
        </div>
      </section>

      {/* 3. How OralSense Works (SCREEN → ANALYZE → CONNECT → CARE → MONITOR) */}
      <HowItWorksSection />

      {/* 4. Flagship Section: Advanced Bruxism Monitoring */}
      <FutureTechSection />

      {/* 5. Patient Trust & Care Continuity Banner */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
              CARE CONTINUITY
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950">
              Why Patients & Practices Trust OralSense
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              OralSense reduces the friction between noticing a dental concern and getting the right dental care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Organize Your Symptoms', desc: 'Transform scattered feelings into a clear, structured screening summary.' },
              { title: 'Prepare for Dental Visit', desc: 'Know what information your clinician needs beforehand.' },
              { title: 'Add Optional Visual Media', desc: 'Attach photos or jaw movement videos to give your dentist context.' },
              { title: 'Connect to Relevant Care', desc: 'Find dentists and hospitals specialized in your specific concern.' },
              { title: 'Book Appointments Easily', desc: 'Schedule consultations with screening context prefilled.' },
              { title: 'Post-Consultation Monitoring', desc: 'Log daily symptom trends and receive follow-up reminders.' },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-white border border-slate-200/80 shadow-subtle space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-950">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="p-5 rounded-3xl bg-brand-950 text-white text-center space-y-3 max-w-3xl mx-auto shadow-2xl">
            <p className="text-sm sm:text-base font-medium italic text-slate-200">
              "OralSense provides an AI-assisted screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation."
            </p>
            <div className="pt-2 flex items-center justify-center gap-4">
              <Link href="/screening">
                <Button variant="primary" size="md" className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0 text-xs">
                  Start Free Screening
                </Button>
              </Link>
              <Link href="/find-care">
                <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10 text-xs font-bold">
                  Find Care
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
