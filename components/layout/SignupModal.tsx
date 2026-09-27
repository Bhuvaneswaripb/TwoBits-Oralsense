'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, UserPlus, LogIn, CheckCircle2, Shield, Lock, Calendar } from 'lucide-react';
import { calculateAgeFromDOB, calculateUserMode } from '@/lib/modeUtils';
import { savePatientProfile, getStoredPatientProfile } from '@/lib/storage';
import { saveApiPatientProfile } from '@/lib/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signup' | 'signin';
  onAccountCreated?: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onAccountCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAge = calculateAgeFromDOB(dob);
  const currentMode = calculateUserMode(currentAge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'signup') {
      if (!name || !email || !dob) {
        setErrorMsg('Please complete all required fields.');
        return;
      }

      if (password && confirmPassword && password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      const existing = getStoredPatientProfile();
      const newProfile = {
        ...existing,
        name: name.trim(),
        email: email.trim(),
        dateOfBirth: dob,
        age: currentAge,
        mode: currentMode,
      };

      savePatientProfile(newProfile);
      saveApiPatientProfile(newProfile).catch((err) => console.warn('[Signup API]', err.message));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onAccountCreated) onAccountCreated();
        window.location.reload();
      }, 1000);
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter your email address and password.');
        return;
      }

      const existing = getStoredPatientProfile();
      const updatedProfile = {
        ...existing,
        email: email.trim(),
        name: name.trim() ? name.trim() : existing.name || email.split('@')[0],
      };

      savePatientProfile(updatedProfile);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onAccountCreated) onAccountCreated();
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="p-6 sm:p-8 bg-white max-w-md w-full rounded-3xl shadow-2xl space-y-6 relative text-left">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === 'signin'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
        </div>

        <div className="space-y-1">
          <Badge variant="primary" className="bg-brand-100 text-brand-900 font-bold text-[10px]">
            {activeTab === 'signup' ? 'ORALSENSE REGISTRATION' : 'PATIENT ACCESS'}
          </Badge>
          <h2 className="text-2xl font-extrabold text-brand-950 flex items-center gap-2">
            {activeTab === 'signup' ? (
              <>
                <UserPlus className="w-6 h-6 text-brand-600" /> Create Your Account
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6 text-brand-600" /> Sign In to Account
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'signup'
              ? 'Sign up to save screening history, care appointments, and habits.'
              : 'Enter your credentials to access your saved screening history and preferences.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe or Leo Smith"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> Date of Birth
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
              {dob && (
                <div className="text-[11px] text-slate-500 font-medium">
                  Age: {currentAge} years (Experience automatically tailored)
                </div>
              )}
            </div>
          )}

          {activeTab === 'signup' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {errorMsg && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-brand-900 hover:bg-brand-950 text-white font-extrabold border-0 mt-2 shadow-subtle"
          >
            {activeTab === 'signup' ? 'Create OralSense Account' : 'Sign In to OralSense'}
          </Button>

          {success && (
            <div className="text-xs font-bold text-emerald-600 text-center flex items-center justify-center gap-1.5 pt-2">
              <CheckCircle2 className="w-4 h-4" /> {activeTab === 'signup' ? 'Account created successfully! Setting up your experience...' : 'Signed in successfully! Loading your profile...'}
            </div>
          )}
        </form>

      </Card>
    </div>
  );
};
