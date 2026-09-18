'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete: () => void;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 700);
    const t2 = setTimeout(() => setStep(3), 1400);
    const t3 = setTimeout(() => onComplete(), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <Card className="p-10 sm:p-14 text-center space-y-8 max-w-xl mx-auto shadow-premium border-brand-100 bg-white">
      
      {/* Animated Glowing Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" />
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 text-cyan-300 flex items-center justify-center shadow-lg relative z-10">
          <Cpu className="w-10 h-10 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-brand-950">
          Analyzing your screening...
        </h2>
        <p className="text-xs text-slate-500">
          AI is synthesizing your symptom inputs and visual data.
        </p>
      </div>

      {/* Progress Step List */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-left max-w-sm mx-auto">
        <div className={`flex items-center gap-2.5 transition-colors ${step >= 1 ? 'text-brand-950 font-bold' : 'text-slate-400'}`}>
          <CheckCircle2 className={`w-4 h-4 ${step >= 1 ? 'text-emerald-500' : 'text-slate-300'}`} />
          <span>Organizing symptom responses</span>
        </div>

        <div className={`flex items-center gap-2.5 transition-colors ${step >= 2 ? 'text-brand-950 font-bold' : 'text-slate-400'}`}>
          <CheckCircle2 className={`w-4 h-4 ${step >= 2 ? 'text-emerald-500' : 'text-slate-300'}`} />
          <span>Evaluating optional visual input status</span>
        </div>

        <div className={`flex items-center gap-2.5 transition-colors ${step >= 3 ? 'text-brand-950 font-bold' : 'text-slate-400'}`}>
          <CheckCircle2 className={`w-4 h-4 ${step >= 3 ? 'text-emerald-500' : 'text-slate-300'}`} />
          <span>Generating non-diagnostic screening summary</span>
        </div>
      </div>

    </Card>
  );
};
