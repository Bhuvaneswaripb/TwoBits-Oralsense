'use client';

import React from 'react';
import { ClipboardList, Cpu, Share2, Stethoscope, LineChart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'SCREEN',
      description: 'Answer a short, personalized set of questions based on what you are experiencing.',
      icon: <ClipboardList className="w-6 h-6 text-brand-600" />,
    },
    {
      number: '02',
      title: 'ANALYZE',
      description: 'AI organizes your responses and identifies possible areas of concern.',
      icon: <Cpu className="w-6 h-6 text-cyan-600" />,
    },
    {
      number: '03',
      title: 'CONNECT',
      description: 'Share your screening summary with a dental professional before your visit.',
      icon: <Share2 className="w-6 h-6 text-indigo-600" />,
    },
    {
      number: '04',
      title: 'CARE',
      description: 'Book and attend a professional dental consultation with verified clinicians.',
      icon: <Stethoscope className="w-6 h-6 text-emerald-600" />,
    },
    {
      number: '05',
      title: 'MONITOR',
      description: 'Track symptoms over time and receive post-consultation follow-up reminders.',
      icon: <LineChart className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
            SIMPLE 5-STEP PATHWAY
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
            How BruxShield Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From preliminary symptom screening to professional care and continuous monitoring.
          </p>
        </div>

        {/* 5 Step Workflow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              
              {/* Card Container */}
              <Card className="p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl h-full flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-premium transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-brand-900 text-cyan-300">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-subtle">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-brand-950 tracking-wide">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting arrow indicator for larger screens */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </Card>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
