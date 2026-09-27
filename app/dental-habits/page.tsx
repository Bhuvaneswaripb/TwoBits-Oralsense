'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Timer,
  CheckCircle2,
  Trophy,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Calendar,
  Flame,
  Clock,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Smile,
  Zap,
} from 'lucide-react';
import { getStoredChildProfile, calculateStreak, getTodayHabitLog, calculateAchievements } from '@/lib/storage';
import { ChildProfile, AchievementBadge } from '@/types';

const ROTATING_TIPS = [
  {
    title: 'Gumline Angle',
    text: 'Brush gently along the gumline at a 45-degree angle to sweep away plaque safely.',
  },
  {
    title: 'Replace Toothbrush Periodically',
    text: 'Replace your toothbrush or electric head every 3 months or when bristles appear worn.',
  },
  {
    title: 'Flossing Cleans Hidden Spaces',
    text: 'Flossing reaches tight spaces between teeth that toothbrush bristles cannot reach.',
  },
  {
    title: 'Tooth-Friendly Water Choice',
    text: 'Drinking water after meals rinses away remaining food particles between brushings.',
  },
];

export default function DentalHabitsLandingPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0 });
  const [achievements, setAchievements] = useState<AchievementBadge[]>([]);
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const childProfile = getStoredChildProfile();
    setProfile(childProfile);
    if (childProfile?.id) {
      const s = calculateStreak(childProfile.id);
      setStreak(s);
      const achs = calculateAchievements(childProfile.id);
      setAchievements(achs);
      const log = getTodayHabitLog(childProfile.id);
      let count = 0;
      if (log.morningBrushing) count++;
      if (log.morningTongue) count++;
      if (log.eveningBrushing) count++;
      if (log.eveningFloss) count++;
      setCompletedTodayCount(count);
    }
  }, []);

  const totalPoints = achievements.reduce((acc, item) => (item.unlocked ? acc + item.points : acc), 0);

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      
      {/* Playful Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-cyan-900 via-brand-950 to-slate-900 p-8 sm:p-12 text-white shadow-premium overflow-hidden border border-cyan-800/40">
        
        {/* Background Sparkles / Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              PERSONALIZED DENTAL HYGIENE HABITS
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Make Every Brush Count! 🦷
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Build healthy daily routines with interactive 2-minute brushing, fun streak rewards, and progress reports parents can trust.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link href="/dental-habits/routine">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0 px-8 shadow-subtle hover:shadow-premium"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Today's Routine
                </Button>
              </Link>
            </div>
          </div>

          {/* Mascot / Hero Character Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-brand-600 flex items-center justify-center text-4xl shadow-glow">
              {profile?.avatar === 'lion' ? '🦁' : profile?.avatar === 'bear' ? '🐻' : profile?.avatar === 'rocket' ? '🚀' : '🦸‍♂️'}
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold text-cyan-300 tracking-wider">HERO COMPANION</div>
              <h3 className="text-xl font-black text-white">
                {profile?.name ? `${profile.name.split(' ')[0]}'s Routine` : 'Your Dental Routine'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">"You're doing awesome! Let's complete today's smile streak."</p>
            </div>

            {/* Live Stats Pill */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="p-2 rounded-xl bg-white/10">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-sm">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{streak.currentStreak} Days</span>
                </div>
                <div className="text-[9px] text-slate-300 uppercase font-bold">Streak</div>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <div className="flex items-center justify-center gap-1 text-yellow-300 font-extrabold text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{totalPoints} Pts</span>
                </div>
                <div className="text-[9px] text-slate-300 uppercase font-bold">Smile Score</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Interactive Brushing */}
        <Card className="p-6 bg-white border-slate-200/80 shadow-subtle hover:shadow-premium transition-all rounded-3xl flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 group-hover:scale-110 transition-transform">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-brand-950">2-Min Brushing Timer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guided 4-zone countdown with real-time surface prompts and finish celebration.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/dental-habits/brushing">
              <Button variant="secondary" size="sm" className="w-full text-xs font-bold justify-between">
                Launch Timer <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Card 2: Daily Routine Checklist */}
        <Card className="p-6 bg-white border-slate-200/80 shadow-subtle hover:shadow-premium transition-all rounded-3xl flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-brand-950">Daily Routine Checklist</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track morning & night brushing, flossing, and tongue cleaning with instant score progress.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/dental-habits/routine">
              <Button variant="secondary" size="sm" className="w-full text-xs font-bold justify-between">
                Open Checklist <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Card 3: Dental Essentials */}
        <Card className="p-6 bg-white border-slate-200/80 shadow-subtle hover:shadow-premium transition-all rounded-3xl flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-brand-950">Dental Essentials Shop</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse age-appropriate toothbrushes, toothpaste, flossers, and replacement head reminders.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/dental-habits/products">
              <Button variant="secondary" size="sm" className="w-full text-xs font-bold justify-between">
                Browse Shop <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

      </div>

      {/* Gamification Achievements Section */}
      <Card className="p-8 bg-white border-slate-200/80 shadow-premium rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="primary" className="bg-amber-100 text-amber-900 border-amber-200 font-bold text-xs">
              <Trophy className="w-3.5 h-3.5 mr-1 text-amber-600" />
              REWARDS & BADGES
            </Badge>
            <h2 className="text-2xl font-extrabold text-brand-950">Smile Achievements</h2>
            <p className="text-xs text-slate-600">Earn badges and smile points by completing consistent daily routines.</p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-amber-900 font-extrabold text-sm self-start sm:self-auto">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Total Smile Points: {totalPoints} Pts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="text-3xl">{ach.icon}</div>
                <div className="text-sm font-extrabold text-brand-950">{ach.title}</div>
                <p className="text-[11px] text-slate-600 leading-tight">{ach.description}</p>
              </div>
              <div className="pt-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ach.unlocked ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                }`}>
                  {ach.unlocked ? `+${ach.points} Pts Unlocked` : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rotating Interactive Today's Tip Card */}
      <Card className="p-6 bg-cyan-50/80 border-cyan-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-subtle">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-extrabold text-cyan-900 tracking-wider">
              TODAY'S DENTAL TIP #{tipIdx + 1} OF {ROTATING_TIPS.length}
            </div>
            <h4 className="text-base font-extrabold text-brand-950">
              {ROTATING_TIPS[tipIdx].title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              "{ROTATING_TIPS[tipIdx].text}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTipIdx((prev) => (prev > 0 ? prev - 1 : ROTATING_TIPS.length - 1))}
            className="p-2 rounded-xl bg-white border border-cyan-200 text-cyan-800 hover:bg-cyan-100"
            aria-label="Previous tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTipIdx((prev) => (prev < ROTATING_TIPS.length - 1 ? prev + 1 : 0))}
            className="p-2 rounded-xl bg-white border border-cyan-200 text-cyan-800 hover:bg-cyan-100"
            aria-label="Next tip"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Health Tech Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
        <strong>Routine & Habit Disclaimer:</strong> OralSense Dental Habits is designed as an educational habit-building tool to guide daily brushing routines. It is not a clinical assessment, diagnostic tool, or replacement for professional pediatric dental evaluations.
      </div>

    </div>
  );
}
