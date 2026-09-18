'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getStoredSymptomLogs, addSymptomLog } from '@/lib/storage';
import { SymptomLogEntry, FeaturedConcernType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, Plus, CheckCircle2, ArrowLeft, HeartPulse, SlidersHorizontal } from 'lucide-react';

export default function SymptomMonitoringPage() {
  const [logs, setLogs] = useState<SymptomLogEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FeaturedConcernType>('Bruxism & Jaw Health');
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states (0-10)
  const [primaryVal, setPrimaryVal] = useState(3);
  const [secondaryVal, setSecondaryVal] = useState(2);
  const [tertiaryVal, setTertiaryVal] = useState(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setLogs(getStoredSymptomLogs());
  }, []);

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const newEntry: SymptomLogEntry = {
      id: `log-${Date.now()}`,
      date: today.toISOString().split('T')[0],
      dayLabel: dayNames[today.getDay()],
      concernCategory: selectedCategory,
      primaryValue: primaryVal,
      secondaryValue: secondaryVal,
      tertiaryValue: tertiaryVal,
      notes: notes || 'Daily patient check-in completed.',
    };

    const updated = addSymptomLog(newEntry);
    setLogs(updated);
    setSubmitted(true);
    setTimeout(() => {
      setShowCheckInForm(false);
      setSubmitted(false);
    }, 1500);
  };

  const getMetricLabels = (cat: FeaturedConcernType) => {
    switch (cat) {
      case 'Bruxism & Jaw Health':
        return { p: 'Jaw Discomfort', s: 'Morning Stiffness', t: 'Temple Headache' };
      case 'Tooth Pain & Cavity Concerns':
        return { p: 'Chewing Discomfort', s: 'Lingering Pain', t: 'Tooth Severity' };
      case 'Gum Health':
        return { p: 'Bleeding Frequency', s: 'Gum Swelling', t: 'Tenderness' };
      case 'Tooth Sensitivity':
        return { p: 'Cold Trigger Severity', s: 'Brushing Zinging', t: 'Episode Frequency' };
      case 'Tooth Wear':
        return { p: 'Tooth Sensitivity', s: 'Chewing Friction', t: 'Appearance Change' };
      default:
        return { p: 'Primary Symptom', s: 'Secondary Symptom', t: 'Tertiary Symptom' };
    }
  };

  const labels = getMetricLabels(selectedCategory);

  const chartData = [...logs].reverse().slice(-7).map((l) => ({
    day: l.dayLabel,
    [labels.p]: l.primaryValue,
    [labels.s]: l.secondaryValue,
    [labels.t]: l.tertiaryValue,
  }));

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 mb-2">
            CONDITION-SPECIFIC MONITORING
          </Badge>
          <h1 className="text-3xl font-extrabold text-brand-950 tracking-tight">
            Your Dental Health Journey
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track daily patient-reported symptom trends for your specific concern.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCheckInForm(!showCheckInForm)}
            icon={<Plus className="w-4 h-4" />}
          >
            {showCheckInForm ? 'Close Check-In' : 'New Check-In'}
          </Button>
        </div>
      </div>

      {/* Condition Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">SELECT CONDITION TO MONITOR</div>
        <div className="flex flex-wrap gap-2">
          {(['Bruxism & Jaw Health', 'Tooth Pain / Cavity Concerns', 'Gum Health', 'Tooth Sensitivity', 'Tooth Wear'] as FeaturedConcernType[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Check-In Form */}
      {showCheckInForm && (
        <Card className="p-6 sm:p-8 shadow-premium border-brand-200 bg-white space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-brand-950">Daily Check-In ({selectedCategory})</h2>
            <span className="text-xs text-slate-400 font-mono">Scale 0 (None) to 10 (High)</span>
          </div>

          {!submitted ? (
            <form onSubmit={handleSaveCheckIn} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{labels.p}:</span>
                    <span className="text-brand-600 font-mono">{primaryVal}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={primaryVal}
                    onChange={(e) => setPrimaryVal(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{labels.s}:</span>
                    <span className="text-cyan-600 font-mono">{secondaryVal}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={secondaryVal}
                    onChange={(e) => setSecondaryVal(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{labels.t}:</span>
                    <span className="text-indigo-600 font-mono">{tertiaryVal}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={tertiaryVal}
                    onChange={(e) => setTertiaryVal(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Notes / Observations (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Symptoms felt lighter today after rest."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Save Check-In
              </Button>
            </form>
          ) : (
            <div className="p-6 text-center text-emerald-600 font-bold space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto" />
              <div>Check-in saved successfully!</div>
            </div>
          )}
        </Card>
      )}

      {/* 7-Day Symptom Chart & Summary */}
      <Card className="p-6 shadow-subtle bg-white space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-950">7-Day Symptom Trend ({selectedCategory})</h2>
            <p className="text-xs text-slate-500">Patient-reported ratings (0–10 scale)</p>
          </div>
          <Badge variant="neutral">7-DAY HISTORY</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your reported discomfort for {selectedCategory} has decreased over the last 7 days.</span>
        </div>

        {/* Recharts Bar Graph */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 10]} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none' }} />
              <Bar dataKey={labels.p} fill="#0284C7" radius={[4, 4, 0, 0]} />
              <Bar dataKey={labels.s} fill="#06B6D4" radius={[4, 4, 0, 0]} />
              <Bar dataKey={labels.t} fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
        <strong>Important Note:</strong> Symptom trends are patient-reported monitoring for personal tracking and sharing with your dentist. They do not constitute a medical diagnosis.
      </div>

    </div>
  );
}
