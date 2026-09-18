'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, Eye, Download, Trash2, CheckCircle2, FileText, Info } from 'lucide-react';

export default function PrivacyPage() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDownloadData = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleDeleteData = () => {
    setDeleteSuccess(true);
    setTimeout(() => setDeleteSuccess(false), 4000);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold">
          PATIENT DATA CONTROL
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Privacy & Trust Architecture
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Your dental screening summaries, symptom history, and uploaded media are strictly patient-controlled. You decide what information is shared with care providers.
        </p>
      </div>

      {/* Regional Privacy Standards Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-slate-200 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            🇺🇸
          </div>
          <h2 className="text-base font-bold text-brand-950">HIPAA-Aware Data Handling</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Designed around US healthcare privacy principles, ensuring encrypted transit and patient-authorized data sharing with verified practices.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            🇬🇧
          </div>
          <h2 className="text-base font-bold text-brand-950">UK GDPR & Explicit Consent</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fully aligned with UK Data Protection principles. Your screening summary and photos are stored locally and shared only when explicitly authorized during booking.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            🇦🇺
          </div>
          <h2 className="text-base font-bold text-brand-950">Privacy & Professional Standards</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Complies with Australian Privacy Principles (APPs). Patient health records remain under patient ownership at every stage of the care journey.
          </p>
        </Card>
      </div>

      {/* Patient Data Control Panel (Simulated Actions) */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-premium space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-brand-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              Manage Your Personal Health Data
            </h2>
            <p className="text-xs text-slate-500">
              Control storage, export your records, or purge local session data at any time.
            </p>
          </div>
          <Badge variant="success" className="text-[10px]">PATIENT CONTROLLED</Badge>
        </div>

        {downloadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Demo Data Export Generated:</strong> Your JSON record summary has been prepared. (Prototype action)</span>
          </div>
        )}

        {deleteSuccess && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
            <span><strong>Demo Data Purge Completed:</strong> Session screening records reset. (Prototype action)</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-brand-950 text-sm">
              <Download className="w-4 h-4 text-brand-600" />
              Download My Data
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export a JSON copy of your screening summaries, symptom history, and appointment notes.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadData}
              className="text-xs font-bold border-brand-200 text-brand-900 hover:bg-brand-50"
            >
              Export JSON Package
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-rose-950 text-sm">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Delete My Data
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Purge your stored local screening history, attached media references, and appointment drafts.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteData}
              className="text-xs font-bold"
            >
              Purge Local Session
            </Button>
          </div>
        </div>

        {/* Informational Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Architecture & Deployment Notice:</strong> OralSense is presented as a demonstration platform designed around privacy-first healthcare principles. Production deployments require standard HIPAA Business Associate Agreements (BAA) and UK GDPR Data Processing Agreements.
          </p>
        </div>
      </Card>

    </div>
  );
}
