'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line } from 'recharts';
import { getStoredTelemetry, simulateNewNightTelemetry, getStoredPatientProfile } from '@/lib/storage';
import { NightlyTelemetry, PatientProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, Play, Zap, ShieldCheck, Battery, Radio, CheckCircle2, Clock, Info, RefreshCw } from 'lucide-react';

export default function MouthguardPage() {
  const [telemetry, setTelemetry] = useState<NightlyTelemetry[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'7d' | '30d'>('7d');
  const [isSimulating, setIsSimulating] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [activeSensorPin, setActiveSensorPin] = useState<'sensors' | 'ble' | 'charger'>('sensors');

  useEffect(() => {
    setTelemetry(getStoredTelemetry());
    setProfile(getStoredPatientProfile());
  }, []);

  const handleSimulateNight = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const freshSession = simulateNewNightTelemetry();
      const updated = getStoredTelemetry();
      setTelemetry(updated);
      setIsSimulating(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3000);
    }, 1000);
  };

  if (!profile || telemetry.length === 0) return null;

  const lastNight = telemetry[0];
  const chartData = (activeTab === '7d' ? telemetry.slice(0, 7) : telemetry)
    .slice()
    .reverse()
    .map((t) => ({
      date: t.date.slice(5),
      events: t.biteEventsCount,
      avgPressure: t.avgPressurePercent,
      peakPressure: t.peakPressurePercent,
      duration: t.avgEventDurationSec,
    }));

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div>
            <div className="text-xs font-bold">New monitoring session synced</div>
            <div className="text-[11px] text-emerald-200">Telemetry updated with new simulated night parameters.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">HARDWARE CONCEPT & TELEMETRY</Badge>
            <Badge variant="success" className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight mt-1">
            Smart Mouthguard Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            disabled={isSimulating}
            onClick={handleSimulateNight}
            icon={isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            className="shadow-premium"
          >
            {isSimulating ? 'Syncing Hardware Signal...' : 'Simulate Night'}
          </Button>
        </div>
      </div>

      {/* Hardware Graphic & Concept Card */}
      <Card className="p-8 shadow-premium border-brand-100 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hardware Visual Blueprint */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative h-64 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-800 shadow-inner overflow-hidden">
              
              {/* Telemetry Wave Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-brand-500/10 to-cyan-500/10 animate-pulse pointer-events-none" />

              {/* Mouthguard Path */}
              <svg viewBox="0 0 240 120" className="w-4/5 h-44 drop-shadow-glow">
                <path
                  d="M 20 100 C 20 30, 220 30, 220 100"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="opacity-90"
                />
                <path
                  d="M 20 100 C 20 30, 220 30, 220 100"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Pressure Sensor Pins */}
                <circle cx="45" cy="65" r="6" fill="#FFFFFF" className="animate-ping" />
                <circle cx="45" cy="65" r="4" fill="#0EA5E9" />
                <circle cx="195" cy="65" r="6" fill="#FFFFFF" className="animate-ping" />
                <circle cx="195" cy="65" r="4" fill="#0EA5E9" />

                {/* BLE Micro Chip */}
                <rect x="110" y="32" width="20" height="10" rx="3" fill="#38BDF8" />
              </svg>

              {/* Active Hotspot Label */}
              <div className="z-10 text-center bg-slate-950/90 text-cyan-300 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                {activeSensorPin === 'sensors' && 'Pressure Sensors: 4x Piezoelectric Gauges'}
                {activeSensorPin === 'ble' && 'BLE 5.2 Micro Controller'}
                {activeSensorPin === 'charger' && 'Inductive Wireless Charging Case'}
              </div>

            </div>

            {/* Pins Control Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveSensorPin('sensors')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  activeSensorPin === 'sensors' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Pressure Sensors
              </button>
              <button
                onClick={() => setActiveSensorPin('ble')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  activeSensorPin === 'ble' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                BLE Module
              </button>
              <button
                onClick={() => setActiveSensorPin('charger')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  activeSensorPin === 'charger' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Charging Case
              </button>
            </div>
          </div>

          {/* Explanation & Hardware Specs */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-bold text-brand-950">Non-Invasive Bite-Pressure Telemetry</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The smart mouthguard concept uses embedded pressure sensors to record bite-pressure events. In this prototype, the sensor data is simulated.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Thickness</span>
                <div className="font-bold text-slate-900 text-sm">0.3 mm Mold</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Battery Life</span>
                <div className="font-bold text-slate-900 text-sm">{profile.mouthguardBatteryPercent}% (14 Days)</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Sync Protocol</span>
                <div className="font-bold text-slate-900 text-sm">BLE 5.2 Auto-Sync</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Materials</span>
                <div className="font-bold text-slate-900 text-sm">Medical Polymer</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Smart mouthguard data shown in this prototype is simulated for presentation purposes.</span>
            </div>
          </div>

        </div>
      </Card>

      {/* Nightly Telemetry Card */}
      <Card className="p-6 sm:p-8 shadow-subtle border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">LATEST CAPTURED SESSION</span>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-950">Last Night Overview ({lastNight.date})</h2>
          </div>
          <Badge variant="primary">7h 42m Sleep</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Bite Events</span>
            <div className="text-3xl font-extrabold text-brand-900 transition-all">{lastNight.biteEventsCount}</div>
            <div className="text-[11px] text-slate-500">Nightly grinding instances</div>
          </div>

          <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Pressure</span>
            <div className="text-3xl font-extrabold text-cyan-900 transition-all">{lastNight.avgPressurePercent}%</div>
            <div className="text-[11px] text-slate-500">Relative force scale</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Peak Pressure</span>
            <div className="text-3xl font-extrabold text-slate-900 transition-all">{lastNight.peakPressurePercent}%</div>
            <div className="text-[11px] text-slate-500">Maximum clench spike</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Event Duration</span>
            <div className="text-3xl font-extrabold text-slate-900 transition-all">{lastNight.avgEventDurationSec}s</div>
            <div className="text-[11px] text-slate-500">Seconds per event</div>
          </div>

        </div>
      </Card>

      {/* Monitoring Charts with 7D / 30D Tabs */}
      <Card className="p-6 sm:p-8 shadow-subtle space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-950">Longitudinal Nocturnal Telemetry</h2>
            <p className="text-xs text-slate-500">Track bite pressure trends over time • Clearly labeled Demo Data</p>
          </div>

          {/* Time range selector tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('7d')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === '7d' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setActiveTab('30d')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === '30d' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* 2 Grid Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          
          {/* Chart 1: Bite Events Per Night */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Events per Night</h3>
            <div className="h-60 w-full bg-slate-50/50 p-3 rounded-2xl border border-slate-200/80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none' }} />
                  <Area type="monotone" dataKey="events" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEvents)" name="Bite Events" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Average & Peak Pressure */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Average vs Peak Pressure (%)</h3>
            <div className="h-60 w-full bg-slate-50/50 p-3 rounded-2xl border border-slate-200/80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none' }} />
                  <Line type="monotone" dataKey="avgPressure" stroke="#06B6D4" strokeWidth={2} name="Avg Pressure %" />
                  <Line type="monotone" dataKey="peakPressure" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" name="Peak Pressure %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </Card>

    </div>
  );
}
