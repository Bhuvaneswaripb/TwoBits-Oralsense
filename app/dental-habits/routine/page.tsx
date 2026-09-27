'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Circle,
  Sun,
  Moon,
  Timer,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  Droplets,
  Smile,
  Check,
  UserPlus,
} from 'lucide-react';
import {
  getStoredChildProfile,
  getTodayHabitLog,
  saveDentalHabitLog,
  calculateStreak,
} from '@/lib/storage';
import { ChildProfile, DentalHabitLog } from '@/types';

export default function DailyRoutinePage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [habitLog, setHabitLog] = useState<DentalHabitLog | null>(null);
  const [waterMorning, setWaterMorning] = useState(false);
  const [tongueEvening, setTongueEvening] = useState(false);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    const childProfile = getStoredChildProfile();
    setProfile(childProfile);

    if (childProfile?.id) {
      const todayLog = getTodayHabitLog(childProfile.id);
      setHabitLog(todayLog);
      const s = calculateStreak(childProfile.id);
      setStreak(s);
    }
  }, []);

  if (!profile) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-8 max-w-md mx-auto text-center">
        <Card className="p-8 space-y-4 bg-white shadow-premium rounded-3xl border-slate-200">
          <UserPlus className="w-12 h-12 text-cyan-600 mx-auto" />
          <h2 className="text-xl font-extrabold text-brand-950">Set Up a Child Profile</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Create a profile to start tracking daily brushing routines, earning streaks, and building healthy habits.
          </p>
          <Link href="/dental-habits/profile">
            <Button variant="primary" size="md" className="w-full font-bold">
              Set Up Child Profile
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const toggleItem = (key: keyof Pick<DentalHabitLog, 'morningBrushing' | 'morningTongue' | 'eveningBrushing' | 'eveningFloss'>) => {
    if (!habitLog || !profile.id) return;

    const newValue = !habitLog[key];
    const updated: DentalHabitLog = {
      ...habitLog,
      [key]: newValue,
    };

    setHabitLog(updated);
    saveDentalHabitLog(updated);

    const updatedStreak = calculateStreak(profile.id);
    setStreak(updatedStreak);
  };

  // Calculate 6 total items
  const morningCount = (habitLog?.morningBrushing ? 1 : 0) + (habitLog?.morningTongue ? 1 : 0) + (waterMorning ? 1 : 0);
  const eveningCount = (habitLog?.eveningBrushing ? 1 : 0) + (habitLog?.eveningFloss ? 1 : 0) + (tongueEvening ? 1 : 0);
  const totalCompleted = morningCount + eveningCount;

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dental-habits" className="text-xs font-bold text-slate-500 hover:text-brand-700 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dental Habits
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
            TODAY'S DENTAL ROUTINE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {profile.name}'s Interactive Checklist • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-2xl shrink-0 shadow-sm border border-slate-800">
          <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
          <div>
            <div className="text-sm font-extrabold text-amber-300">{streak.currentStreak} Day Streak!</div>
            <div className="text-[10px] text-slate-300 font-medium">Keep your smile streak active</div>
          </div>
        </div>
      </div>

      {/* Today's Smile Score Progress Card */}
      <Card className="p-6 bg-white border-brand-100 shadow-premium rounded-3xl space-y-6">
        
        {/* Smile Score Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">TODAY'S SMILE SCORE</div>
            <div className="text-2xl font-black text-brand-950 flex items-center gap-2">
              <Smile className="w-6 h-6 text-cyan-600" />
              <span>{totalCompleted} / 6 Completed</span>
            </div>
          </div>
          
          <Badge
            variant={totalCompleted === 6 ? 'primary' : 'secondary'}
            className={totalCompleted === 6 ? 'bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 text-xs' : 'bg-slate-100 text-slate-700 font-bold text-xs'}
          >
            {totalCompleted === 6 ? '🌟 Perfect Smile Day!' : `${Math.round((totalCompleted / 6) * 100)}% Complete`}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-cyan-500 via-sky-500 to-brand-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(totalCompleted / 6) * 100}%` }}
          />
        </div>

        {/* MORNING ROUTINE SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-amber-700 tracking-wider">
            <Sun className="w-4 h-4 text-amber-500" />
            MORNING ROUTINE (3 TASKS)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Morning Task 1: Brush for 2 minutes */}
            <div
              onClick={() => toggleItem('morningBrushing')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                habitLog?.morningBrushing
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  habitLog?.morningBrushing ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {habitLog?.morningBrushing ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-sm font-extrabold ${habitLog?.morningBrushing ? 'text-emerald-950 line-through' : 'text-brand-950'}`}>
                  Brush 2 Mins
                </div>
              </div>

              <Link
                href="/dental-habits/brushing"
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-100 hover:bg-cyan-200 px-2 py-1 rounded-lg shrink-0 flex items-center justify-center gap-1 w-full"
              >
                <Timer className="w-3.5 h-3.5" /> Start Timer
              </Link>
            </div>

            {/* Morning Task 2: Clean Tongue */}
            <div
              onClick={() => toggleItem('morningTongue')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                habitLog?.morningTongue
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  habitLog?.morningTongue ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {habitLog?.morningTongue ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-sm font-extrabold ${habitLog?.morningTongue ? 'text-emerald-950 line-through' : 'text-brand-950'}`}>
                  Clean Tongue
                </div>
              </div>
              <div className="text-[11px] text-slate-500">Freshen morning breath</div>
            </div>

            {/* Morning Task 3: Drink Water */}
            <div
              onClick={() => setWaterMorning(!waterMorning)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                waterMorning
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  waterMorning ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {waterMorning ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-sm font-extrabold ${waterMorning ? 'text-emerald-950 line-through' : 'text-brand-950'}`}>
                  Drink Water
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" /> Rinse after breakfast
              </div>
            </div>

          </div>
        </div>

        {/* NIGHT ROUTINE SECTION */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-indigo-800 tracking-wider">
            <Moon className="w-4 h-4 text-indigo-600" />
            NIGHT ROUTINE (3 TASKS)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Night Task 1: Brush for 2 minutes */}
            <div
              onClick={() => toggleItem('eveningBrushing')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                habitLog?.eveningBrushing
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  habitLog?.eveningBrushing ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {habitLog?.eveningBrushing ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-sm font-extrabold ${habitLog?.eveningBrushing ? 'text-emerald-950 line-through' : 'text-brand-950'}`}>
                  Brush 2 Mins
                </div>
              </div>

              <Link
                href="/dental-habits/brushing"
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-100 hover:bg-cyan-200 px-2 py-1 rounded-lg shrink-0 flex items-center justify-center gap-1 w-full"
              >
                <Timer className="w-3.5 h-3.5" /> Start Timer
              </Link>
            </div>

            {/* Night Task 2: Floss */}
            <div
              onClick={() => toggleItem('eveningFloss')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                habitLog?.eveningFloss
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  habitLog?.eveningFloss ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {habitLog?.eveningFloss ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-sm font-extrabold ${habitLog?.eveningFloss ? 'text-emerald-950 line-through' : 'text-brand-950'}`}>
                  Floss Teeth
                </div>
              </div>
              <div className="text-[11px] text-slate-500">Clean between back molars</div>
            </div>

            {/* Night Task 3: Clean Tongue */}
            <div
              onClick={() => setTongueEvening(!tongueEvening)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                tongueEvening
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  tongueEvening ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {tongueEvening ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <div className={`text-sm font-extrabold ${tongueEvening ? 'text-emerald-950 line-through' : 'text-brand-950'}`}>
                  Clean Tongue
                </div>
              </div>
              <div className="text-[11px] text-slate-500">Bedtime tongue clean</div>
            </div>

          </div>
        </div>

      </Card>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link href="/dental-habits/brushing" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0" icon={<Timer className="w-5 h-5" />}>
            Start 2-Min Brushing Timer
          </Button>
        </Link>
        <Link href="/dental-habits/weekly-report" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full font-bold">
            View Weekly Parent Report
          </Button>
        </Link>
      </div>

    </div>
  );
}
