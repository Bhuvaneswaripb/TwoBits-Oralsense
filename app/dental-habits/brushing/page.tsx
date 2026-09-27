'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Award,
  Star,
  Check,
} from 'lucide-react';
import { getStoredChildProfile, getTodayHabitLog, saveDentalHabitLog } from '@/lib/storage';
import { ChildProfile, DentalHabitLog } from '@/types';

const TOTAL_SECONDS = 120; // 2 minutes

const ZONES = [
  {
    range: [0, 30],
    name: 'Outer Surfaces',
    instruction: 'Brush gently along the outer gumline at a 45° angle.',
    encouragement: 'Great start! Move in soft circular motions along your outer teeth.',
  },
  {
    range: [30, 60],
    name: 'Inner Surfaces',
    instruction: 'Angle the brush bristles towards the inside teeth surfaces.',
    encouragement: 'Great! Now clean the inside surfaces of your teeth.',
  },
  {
    range: [60, 90],
    name: 'Chewing Surfaces',
    instruction: 'Scrub back and forth along the top chewing surfaces of back molars.',
    encouragement: 'Awesome job! Scrub the top chewing surfaces back and forth.',
  },
  {
    range: [90, 120],
    name: 'Final Gentle Clean',
    instruction: 'Gently brush your tongue from back to front and polish all surfaces.',
    encouragement: 'Almost done! Give your tongue a gentle swipe and polish all surfaces.',
  },
];

export default function BrushingTimerPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [logUpdated, setLogUpdated] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const p = getStoredChildProfile();
    setProfile(p);
  }, []);

  // Web Audio API chime tone
  const playChime = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.4);
      }
    } catch (e) {
      // Audio fallback ignored
    }
  };

  // Timer Interval Hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsElapsed < TOTAL_SECONDS) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          if (next === 30 || next === 60 || next === 90) {
            playChime();
          }
          if (next >= TOTAL_SECONDS) {
            setIsActive(false);
            setIsCompleted(true);
            playChime();
          }
          return next;
        });
      }, 1000);
    } else if (secondsElapsed >= TOTAL_SECONDS) {
      setIsActive(false);
      setIsCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsElapsed, isMuted]);

  // Current zone calculation
  const currentZoneIndex = Math.min(Math.floor(secondsElapsed / 30), ZONES.length - 1);
  const currentZone = ZONES[currentZoneIndex];

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setLogUpdated(false);
  };

  const handleMarkRoutineComplete = () => {
    if (!profile?.id) return;
    const todayLog = getTodayHabitLog(profile.id);
    const isMorningNow = new Date().getHours() < 13;

    const updated: DentalHabitLog = {
      ...todayLog,
      morningBrushing: isMorningNow ? true : todayLog.morningBrushing,
      eveningBrushing: !isMorningNow ? true : todayLog.eveningBrushing,
      totalBrushingSeconds: (todayLog.totalBrushingSeconds || 0) + secondsElapsed,
      completedSessions: (todayLog.completedSessions || 0) + 1,
    };

    saveDentalHabitLog(updated);
    setLogUpdated(true);
  };

  // Format mm:ss
  const remainingSeconds = TOTAL_SECONDS - secondsElapsed;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const progressPercent = Math.min(Math.round((secondsElapsed / TOTAL_SECONDS) * 100), 100);

  // SVG Circular parameters
  const strokeWidth = 14;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dental-habits/routine" className="text-xs font-bold text-slate-500 hover:text-brand-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Routine
        </Link>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          <span>{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>
      </div>

      {/* Main Brushing Timer Card */}
      <Card className="p-8 bg-white border-brand-100 shadow-premium rounded-3xl text-center space-y-8 relative overflow-hidden">
        
        {/* Child Header */}
        <div className="space-y-1">
          <Badge variant="primary" className="bg-cyan-100 text-cyan-900 border-cyan-200 font-bold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-700" />
            2-MINUTE GUIDED TIMER
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-950">
            {profile?.name ? `${profile.name.split(' ')[0]}'s Brushing Countdown` : 'Daily Brushing Countdown'}
          </h1>
        </div>

        {/* Circular Timer Visual */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              className="text-slate-100 stroke-current"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              className="text-cyan-500 stroke-current transition-all duration-1000 ease-linear"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl font-black text-brand-950 font-mono tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              {isCompleted ? 'COMPLETE' : `${progressPercent}% DONE`}
            </span>
          </div>
        </div>

        {/* Zone Guidance Banner */}
        {!isCompleted ? (
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2 max-w-md mx-auto text-left shadow-subtle border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                ZONE {currentZoneIndex + 1} OF 4 • {currentZone.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {currentZone.range[0]}s – {currentZone.range[1]}s
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{currentZone.encouragement}"
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3 max-w-md mx-auto text-center shadow-subtle animate-in zoom-in-95 duration-300">
            <Award className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-extrabold text-emerald-950">Great job! 2 minutes completed! 🎉</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              You completed a full 2-minute brushing session today and earned +20 Smile Points!
            </p>
            {!logUpdated ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleMarkRoutineComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark Today's Routine Complete (+20 Pts)
              </Button>
            ) : (
              <Badge variant="primary" className="bg-emerald-200 text-emerald-900 font-extrabold py-2 px-4 text-xs">
                ✓ Recorded in Daily Routine Log!
              </Badge>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!isActive && !isCompleted && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0 px-8"
              icon={<Play className="w-5 h-5 fill-brand-950" />}
            >
              {secondsElapsed > 0 ? 'Resume' : 'Start Timer'}
            </Button>
          )}

          {isActive && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePause}
              className="border-slate-300 text-slate-800 font-bold px-8"
              icon={<Pause className="w-5 h-5" />}
            >
              Pause
            </Button>
          )}

          <Button
            variant="ghost"
            size="md"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>

      </Card>

      {/* Habit Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
        <strong>Habit Tool Disclaimer:</strong> This 2-minute timer provides visual zone guidance to encourage healthy routine duration. It does not replace professional dental cleaning or clinical evaluation.
      </div>

    </div>
  );
}
