'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="primary" className="bg-brand-100 text-brand-800 border-brand-200">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-600" />
          ABOUT BRUXSHIELD
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-950 tracking-tight">
          Our Mission
        </h1>
      </div>

      {/* Mission Statement Card */}
      <Card className="p-8 sm:p-12 shadow-premium bg-gradient-to-b from-white to-slate-50 border-brand-100 space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <blockquote className="text-xl sm:text-2xl font-bold text-brand-950 text-center leading-relaxed">
          "Make dental care more connected, understandable and proactive by helping patients communicate symptoms clearly and helping dental practices maintain continuity of care."
        </blockquote>

        <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          
          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-900">Patient Understanding</h3>
            <p className="text-xs text-slate-600">Empowering patients to recognize and articulate early symptoms.</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-900">Clinical Collaboration</h3>
            <p className="text-xs text-slate-600">Providing structured screening data to dental professionals.</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-900">Care Continuity</h3>
            <p className="text-xs text-slate-600">Sustaining patient engagement and symptom monitoring over time.</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/screening">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Start Free Screening
            </Button>
          </Link>
          <Link href="/for-practices">
            <Button variant="outline" size="lg">
              For Dental Practices
            </Button>
          </Link>
        </div>

      </Card>

      {/* Mandatory Disclaimer */}
      <div className="text-center text-xs text-slate-400">
        BruxShield is an early-screening platform and does not provide medical diagnosis or replace licensed dental treatment.
      </div>

    </div>
  );
}
