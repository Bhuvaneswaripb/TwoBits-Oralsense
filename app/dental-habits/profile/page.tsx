'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  UserPlus,
  ArrowLeft,
  Save,
  Sparkles,
  Clock,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { getStoredChildProfile, saveChildProfile } from '@/lib/storage';
import { ChildProfile } from '@/types';

const AVATARS = [
  { id: 'star', label: 'Star', icon: '⭐' },
  { id: 'lion', label: 'Lion', icon: '🦁' },
  { id: 'bear', label: 'Bear', icon: '🐻' },
  { id: 'rocket', label: 'Rocket', icon: '🚀' },
];

export default function ChildProfilePage() {
  const router = useRouter();

  const [name, setName] = useState('Leo');
  const [age, setAge] = useState<number>(6);
  const [avatar, setAvatar] = useState('star');
  const [morningReminderTime, setMorningReminderTime] = useState('08:00');
  const [eveningReminderTime, setEveningReminderTime] = useState('20:00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const existing = getStoredChildProfile();
    if (existing) {
      setName(existing.name || 'Leo');
      setAge(existing.age || 6);
      setAvatar(existing.avatar || 'star');
      setMorningReminderTime(existing.morningReminderTime || '08:00');
      setEveningReminderTime(existing.eveningReminderTime || '20:00');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ChildProfile = {
      id: 'child-default-1',
      userId: 'pat-default',
      name: name.trim() || 'Leo',
      age: Number(age) || 6,
      avatar,
      morningReminderTime,
      eveningReminderTime,
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveChildProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/dental-habits/routine');
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div>
        <Link href="/dental-habits" className="text-xs font-bold text-slate-500 hover:text-brand-700 flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dental Habits
        </Link>
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-cyan-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
            Child Profile Setup
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configure child profile preferences and daily routine reminder schedule.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-8 bg-white border-slate-200/80 shadow-premium rounded-3xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Child Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">Child Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Leo"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">Child Age (Years)</label>
              <input
                type="number"
                required
                min={1}
                max={18}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 6)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
            </div>

          </div>

          {/* Avatar Selector */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-700">Choose Profile Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setAvatar(item.id)}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                    avatar === item.id
                      ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="text-[11px] font-bold text-slate-700 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" /> Morning Reminder Time
              </label>
              <input
                type="time"
                value={morningReminderTime}
                onChange={(e) => setMorningReminderTime(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-600" /> Evening Reminder Time
              </label>
              <input
                type="time"
                value={eveningReminderTime}
                onChange={(e) => setEveningReminderTime(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0"
              icon={<Save className="w-5 h-5" />}
            >
              Save Profile Preferences
            </Button>
            {savedSuccess && (
              <div className="text-xs font-bold text-emerald-600 text-center mt-3 flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4" /> Profile saved! Redirecting to routine...
              </div>
            )}
          </div>

        </form>
      </Card>

    </div>
  );
}
