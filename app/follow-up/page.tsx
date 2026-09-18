'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredFollowUp, saveFollowUpSubmission } from '@/lib/storage';
import { FollowUpSubmission } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Calendar, ArrowRight, HeartPulse, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FollowUpPage() {
  const [followUp, setFollowUp] = useState<FollowUpSubmission | null>(null);
  const [painLevel, setPainLevel] = useState(1);
  const [sensitivityLevel, setSensitivityLevel] = useState(2);
  const [hasNewSymptoms, setHasNewSymptoms] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const data = getStoredFollowUp();
    setFollowUp(data);
    if (data) {
      setPainLevel(data.painLevel);
      setSensitivityLevel(data.sensitivityLevel);
      setHasNewSymptoms(data.hasNewSymptoms);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: FollowUpSubmission = {
      id: `fol-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      painLevel,
      sensitivityLevel,
      hasNewSymptoms,
      notes: notes || 'Post-consultation follow-up check-in completed.',
      nextFollowUpDate: '24 September 2026',
    };

    saveFollowUpSubmission(submission);
    setFollowUp(submission);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
          POST-VISIT CARE CONTINUITY
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Your Follow-Up
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          How are you feeling after your dental visit?
        </p>
      </div>

      {/* Main Form or Submission Confirmation Card */}
      {!isSubmitted ? (
        <Card className="p-8 shadow-premium border-brand-100 bg-white space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              
              {/* Pain Level 0-10 */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Current Pain Discomfort:</span>
                  <span className="text-brand-600 font-mono">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              {/* Sensitivity Level 0-10 */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Current Sensitivity Level:</span>
                  <span className="text-cyan-600 font-mono">{sensitivityLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={sensitivityLevel}
                  onChange={(e) => setSensitivityLevel(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* New Symptoms Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Have you experienced any new symptoms since your appointment?
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => setHasNewSymptoms(false)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      !hasNewSymptoms
                        ? 'bg-brand-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasNewSymptoms(true)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      hasNewSymptoms
                        ? 'bg-brand-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>

              {/* Additional Comments */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Notes for Your Dental Practice (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Sensitivity has reduced significantly since using the recommended rinse."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full text-base font-bold shadow-premium">
              Submit Check-In
            </Button>
          </form>
        </Card>
      ) : (
        /* Confirmation Card */
        <Card className="p-8 sm:p-12 shadow-premium text-center space-y-6 border-emerald-200 bg-white">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="success">CHECK-IN SUBMITTED</Badge>
            <h2 className="text-2xl font-extrabold text-brand-950">Thank you for your follow-up!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your reported symptoms have been logged into your BruxShield timeline and shared with your care team.
            </p>
          </div>

          {/* Next Follow Up Banner */}
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-sm font-bold text-brand-950 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Next follow-up: {followUp?.nextFollowUpDate || '24 September 2026'}</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Go to Patient Dashboard
              </Button>
            </Link>
            <Link href="/monitoring" className="w-full sm:w-auto">
              <Button variant="outline" size="md">
                View Symptom Monitoring
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-slate-400">
        Follow-up check-ins support continuity of care between patient visits and do not replace emergency dental care.
      </div>

    </div>
  );
}
