'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Thermometer, HeartPulse, Activity, ShieldAlert } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      title: 'Tooth Sensitivity',
      description: 'Discomfort when drinking cold liquids or brushing sensitive areas often gets delayed or overlooked.',
      icon: <Thermometer className="w-6 h-6 text-cyan-600" />,
    },
    {
      title: 'Gum Problems',
      description: 'Occasional bleeding or mild tenderness during brushing can be early signals worth tracking.',
      icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
    },
    {
      title: 'Jaw Discomfort',
      description: 'Morning stiffness or temple tension is frequently dismissed as temporary daily stress.',
      icon: <Activity className="w-6 h-6 text-brand-600" />,
    },
    {
      title: 'Tooth Wear / Grinding',
      description: 'Gradual enamel friction or small chips can develop quietly over long periods without awareness.',
      icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="primary" className="bg-slate-100 text-slate-800 border-slate-200">
            EARLY SYMPTOM AWARENESS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
            Small Dental Symptoms Can Be Easy to Ignore
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Patients may notice symptoms without knowing what they mean, when professional evaluation is needed, or how to explain the symptoms during a dental visit.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, i) => (
            <Card
              key={i}
              className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4 hover:shadow-subtle hover:bg-white transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-subtle border border-slate-100">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-950">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
