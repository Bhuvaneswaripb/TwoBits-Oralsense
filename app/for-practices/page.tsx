'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  QrCode,
  Globe,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  CalendarCheck,
  Activity,
  BellRing,
  Sparkles,
} from 'lucide-react';

export default function ForPracticesPage() {
  const benefits = [
    {
      title: '1. Patient Screening',
      description: 'Understand patient-reported symptoms before their consultation starts.',
      icon: <ClipboardList className="w-6 h-6 text-brand-600" />,
    },
    {
      title: '2. Structured Information',
      description: 'Receive an organized screening summary highlighting key symptom triggers.',
      icon: <FileCheck className="w-6 h-6 text-cyan-600" />,
    },
    {
      title: '3. Appointment Conversion',
      description: 'Allow patients to move directly from screening to booking a consultation.',
      icon: <CalendarCheck className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: '4. Continuous Monitoring',
      description: 'Track patient-reported symptoms over 7-day periods after their visit.',
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: '5. Automated Follow-Up',
      description: 'Keep patients engaged after their appointment with scheduled check-ins.',
      icon: <BellRing className="w-6 h-6 text-amber-600" />,
    },
  ];

  const workflowSteps = [
    'Dental Practice',
    'Patient receives BruxShield link',
    'Patient completes screening',
    'AI-assisted summary',
    'Patient books consultation',
    'Dentist reviews information',
    'Patient receives care',
    'Patient monitors symptoms',
    'Practice follows up',
  ];

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="primary" className="bg-brand-100 text-brand-800 border-brand-200">
          <Building2 className="w-3.5 h-3.5 mr-1 text-brand-600" />
          FOR DENTAL PRACTICES & CLINICS
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-950 tracking-tight leading-[1.15]">
          Turn Patient Symptoms Into Connected Dental Care
        </h1>
        
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          BruxShield bridges the gap between patient-reported symptoms and professional clinical consultations. Enable early screening, structured summaries, and post-visit continuity.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dentist">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Explore Practice Dashboard
            </Button>
          </Link>
          <Link href="/screening">
            <Button variant="outline" size="lg">
              Try Patient Screening Flow
            </Button>
          </Link>
        </div>
      </div>

      {/* How Dental Practices Introduce BruxShield */}
      <Card className="p-8 sm:p-10 shadow-premium border-slate-200 bg-white space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-brand-950">
            How Dental Practices Introduce BruxShield
          </h2>
          <p className="text-xs text-slate-500">
            Multiple seamless patient touchpoints for early engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-brand-950">Practice Website</div>
            <div className="text-[11px] text-slate-500">Embedded screening widget for site visitors</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-brand-950">QR Codes in Reception</div>
            <div className="text-[11px] text-slate-500">Patients scan while waiting in clinic</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-brand-950">Patient Portal</div>
            <div className="text-[11px] text-slate-500">Pre-appointment check-in link</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-brand-950">Appointment Comms</div>
            <div className="text-[11px] text-slate-500">SMS / Email screening reminders</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-brand-950">Follow-Up Messages</div>
            <div className="text-[11px] text-slate-500">Automated post-treatment check-ins</div>
          </div>

        </div>
      </Card>

      {/* 5 Benefit Cards Section */}
      <div id="benefits" className="space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
            5 CORE PRACTICE BENEFITS
          </Badge>
          <h2 className="text-3xl font-extrabold text-brand-950">
            Why Dental Practices Choose BruxShield
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <Card key={i} className="p-6 bg-white border border-slate-200/80 shadow-subtle space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                {b.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-950">{b.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Visual Practice Workflow Section */}
      <div id="workflow" className="space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="primary" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            PRACTICE WORKFLOW
          </Badge>
          <h2 className="text-3xl font-extrabold text-brand-950">
            End-to-End Care Workflow
          </h2>
          <p className="text-xs text-slate-500">From initial patient link to post-consultation follow-up</p>
        </div>

        <Card className="p-8 shadow-premium bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 text-white rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4 items-center">
            {workflowSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
                  <div className="text-[10px] font-mono font-bold text-cyan-300">0{idx + 1}</div>
                  <div className="text-xs font-bold text-slate-100 leading-tight">{step}</div>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:flex justify-center text-cyan-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </div>

      {/* Call to Action Card */}
      <div className="p-10 rounded-3xl bg-brand-900 text-white text-center space-y-6">
        <h2 className="text-3xl font-extrabold">Ready to connect patient screening with your clinic?</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Explore the interactive practice dashboard and see how BruxShield simplifies symptom collection and patient follow-up.
        </p>
        <Link href="/dentist" className="inline-block">
          <Button variant="primary" size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0">
            Explore Practice Dashboard Now
          </Button>
        </Link>
      </div>

    </div>
  );
}
