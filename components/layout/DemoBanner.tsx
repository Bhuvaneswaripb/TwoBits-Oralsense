'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Sparkles, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { runFullDemoSimulation } from '@/lib/storage';

export const DemoBanner: React.FC = () => {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRunDemo = () => {
    setIsRunning(true);
    setTimeout(() => {
      runFullDemoSimulation();
      setIsRunning(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  const handleNavigateToDashboard = () => {
    setShowSuccessModal(false);
    router.push('/dashboard');
  };

  const handleNavigateToResults = () => {
    setShowSuccessModal(false);
    router.push('/results');
  };

  return (
    <>
      {/* Floating Demo Trigger Badge */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
        <button
          onClick={handleRunDemo}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-full shadow-float hover:shadow-glow hover:scale-105 transition-all duration-300 border border-cyan-500/30 group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold tracking-wide">
            {isRunning ? 'Simulating Demo Flow...' : 'Run Full Demo'}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Demo Completion Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6 relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-brand-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Demo Flow Generated</h3>
                <p className="text-xs text-slate-500">Hackathon End-to-End Simulation</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 border border-slate-200/60">
              <p className="font-semibold text-slate-800">Simulated Actions Completed:</p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Screening questionnaire, audio analysis & facial scanning completed</li>
                <li>Calculated preliminary risk score: <strong className="text-brand-700">78 / 100 (Elevated)</strong></li>
                <li>Booked appointment with <strong className="text-slate-800">Dr. Ananya Menon</strong></li>
                <li>Simulated 1 nightly monitoring session with <strong>9 clenching events</strong></li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" size="md" onClick={handleNavigateToResults}>
                View Screening Result
              </Button>
              <Button variant="primary" size="md" onClick={handleNavigateToDashboard}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
