import React from 'react';
import { Clock, Cpu, UserCheck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustItems = [
    {
      icon: Clock,
      title: '2-Minute Screening',
      description: 'Quick & intuitive at-home assessment tailored for busy routines.',
    },
    {
      icon: Cpu,
      title: 'AI-Assisted Analysis',
      description: 'Combines symptom inputs, audio signals & facial dynamics.',
    },
    {
      icon: UserCheck,
      title: 'Dental Professional Follow-Up',
      description: 'Direct connection with verified dentists for clinical care.',
    },
  ];

  return (
    <section className="py-10 bg-white border-y border-slate-100 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-brand-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100/80 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-950">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
