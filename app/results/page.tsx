'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getStoredScreeningResult } from '@/lib/storage';
import { ScreeningResult } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  Share2,
  Calendar,
  Check,
  ArrowRight,
  Camera,
  Video,
  AlertCircle,
  Stethoscope,
  Sparkles,
  Search,
} from 'lucide-react';

export default function ResultsPage() {
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = getStoredScreeningResult();
    setResult(data);
  }, []);

  if (!result) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-8">
        <Card className="p-8 text-center space-y-4 max-w-md bg-white">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">No Screening Summary Found</h2>
          <p className="text-xs text-slate-500">
            Please complete an AI-assisted screening to generate your summary.
          </p>
          <Link href="/screening">
            <Button variant="primary" size="md" className="font-bold">
              Start Free Screening
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareText = `OralSense AI-Assisted Screening Summary:
Concern: ${result.concern}
Indication Level: ${result.indicationLevel}
Why Highlighted:
${result.whyHighlighted.map((item) => `• ${item}`).join('\n')}

Recommended Next Step: ${result.recommendedNextStep}

Disclaimer: OralSense provides an early screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation.`;

      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getIndicationBadgeStyle = (ind: string) => {
    if (ind === 'HIGHER CONCERN') {
      return { bg: 'bg-amber-100 text-amber-950 border-amber-300', text: 'HIGHER CONCERN' };
    }
    if (ind === 'MODERATE CONCERN') {
      return { bg: 'bg-cyan-100 text-cyan-950 border-cyan-300', text: 'MODERATE CONCERN' };
    }
    return { bg: 'bg-emerald-100 text-emerald-950 border-emerald-300', text: 'LOWER CONCERN' };
  };

  const indStyle = getIndicationBadgeStyle(result.indicationLevel || 'MODERATE CONCERN');

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-bold">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-700" />
          AI-ASSISTED SCREENING SUMMARY
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          AI-Assisted Screening Summary
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
          OralSense organized your responses to help prepare for your professional dental evaluation.
        </p>
      </div>

      {/* Main Screening Summary Card */}
      <Card className="p-8 sm:p-12 shadow-premium text-center border-brand-100 relative overflow-hidden bg-white space-y-8">
        
        {/* Summary ID */}
        <div className="absolute top-4 right-4">
          <Badge variant="neutral" className="font-mono text-[10px]">
            SUMMARY #{result.id}
          </Badge>
        </div>

        {/* Concern & Indication Level */}
        <div className="space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            POSSIBLE AREA OF CONCERN
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950">
            {result.concern}
          </h2>

          <div className="my-6 flex flex-col items-center gap-3">
            <RiskGauge
              score={result.overallScore}
              label={indStyle.text}
              size="lg"
            />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400">INDICATION:</span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${indStyle.bg}`}>
                {indStyle.text}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Media Attached Banner */}
        {result.hasVisualInput && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between text-xs gap-3 max-w-lg mx-auto text-left">
            <div className="flex items-center gap-2.5">
              {result.visualInputType === 'video' ? (
                <Video className="w-5 h-5 text-cyan-400 shrink-0" />
              ) : (
                <Camera className="w-5 h-5 text-cyan-400 shrink-0" />
              )}
              <div>
                <div className="font-bold text-white">
                  Visual input received ({result.visualInputType || 'photo'})
                </div>
                <div className="text-[11px] text-slate-300">
                  Your visual input helps organize information for discussion with a dental professional.
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 shrink-0 font-bold">
              Attached for Dentist
            </Badge>
          </div>
        )}

        {/* "Why this was highlighted" Section */}
        <div className="text-left space-y-4 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
          <h3 className="text-base font-bold text-brand-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            Why it was highlighted:
          </h3>

          <ul className="space-y-3">
            {result.whyHighlighted && result.whyHighlighted.length > 0 ? (
              result.whyHighlighted.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Selected questionnaire answers indicate area for clinician review</span>
              </li>
            )}
          </ul>
        </div>

        {/* Recommended Next Step Box */}
        <div className="text-left space-y-2 p-6 rounded-3xl bg-brand-50/80 border border-brand-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">
            Recommended Next Step
          </h3>
          <p className="text-sm font-semibold text-brand-950 leading-relaxed">
            "Consider discussing these symptoms with a dental professional."
          </p>
          <p className="text-xs text-slate-600">
            {result.recommendedNextStep}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link href={`/find-care?concern=${encodeURIComponent(result.concern)}`}>
            <Button
              variant="primary"
              size="md"
              icon={<Search className="w-4 h-4" />}
              className="w-full text-xs font-bold shadow-subtle"
            >
              Find Relevant Care
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            onClick={handleShare}
            icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-brand-600" />}
            className="w-full text-xs font-bold"
          >
            {copied ? 'Summary Saved & Copied!' : 'Save Summary'}
          </Button>

          <Link href={`/book-appointment?concern=${encodeURIComponent(result.concern)}`}>
            <Button
              variant="secondary"
              size="md"
              icon={<Calendar className="w-4 h-4 text-brand-800" />}
              className="w-full text-xs font-bold bg-brand-100 text-brand-950 hover:bg-brand-200"
            >
              Book Consultation
            </Button>
          </Link>
        </div>

      </Card>

      {/* Mandatory Subtle Medical Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
        <strong>Medical Disclaimer:</strong> OralSense provides an AI-assisted screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation.
      </div>

    </div>
  );
}
