'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredPatientProfile, getStoredScreeningResult, savePatientProfile } from '@/lib/storage';
import { PatientProfile, ScreeningResult } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, Shield, Activity, Bell, Lock, Smartphone, CheckCircle2, Save, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [screening, setScreening] = useState<ScreeningResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setProfile(getStoredPatientProfile());
    setScreening(getStoredScreeningResult());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      savePatientProfile(profile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleLogoutConfirm = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('oralsense_session');
      localStorage.removeItem('oralsense_session');
    }
    setShowLogoutModal(false);
    router.push('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="primary">PATIENT ACCOUNT CONTROL</Badge>
        <h1 className="text-3xl font-extrabold text-brand-950 tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-slate-600 text-sm">
          Manage your personal details, connected mouthguard hardware, and privacy settings.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="p-6 sm:p-8 shadow-premium border-brand-100 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Personal Information
            </h2>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile Updated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" type="submit" icon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Connected Device & Privacy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Connected Device Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-600" />
            Connected Mouthguard Device
          </h2>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Device Name:</span>
              <span className="font-bold text-slate-900">BruxCare Guard v2 (Simulated)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bluetooth Status:</span>
              <span className="font-bold text-emerald-700">Paired & Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Battery Remaining:</span>
              <span className="font-bold text-brand-800">{profile.mouthguardBatteryPercent}%</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            Re-pair Smart Mouthguard
          </Button>
        </Card>

        {/* Privacy & Notification Settings */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-600" />
            Privacy & Notifications
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
              <span className="font-medium text-slate-700">Nightly Telemetry Sync Reminders</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
              <span className="font-medium text-slate-700">Dental Appointment SMS Alerts</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50">
              <span className="font-medium text-slate-700">Encrypted Cloud Backup</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
            </label>
          </div>
        </Card>

      </div>

      {/* Account Actions Section */}
      <Card className="p-6 sm:p-8 border-rose-100 bg-white space-y-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-600" />
              Account Actions
            </h2>
            <p className="text-xs text-slate-600">
              Sign out of your OralSense patient session safely on this device.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowLogoutModal(true)}
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 font-semibold"
            icon={<LogOut className="w-4 h-4" />}
          >
            Log Out
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-sm w-full p-6 space-y-6 bg-white shadow-2xl rounded-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Log out of OralSense?
              </h3>
              <p className="text-sm text-slate-600">
                You can sign in again anytime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="w-full font-semibold"
                onClick={() => setShowLogoutModal(false)}
              >
                CANCEL
              </Button>
              <Button
                variant="danger"
                size="md"
                className="w-full font-semibold"
                onClick={handleLogoutConfirm}
              >
                LOG OUT
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}

