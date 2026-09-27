'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Sparkles, Menu, X, Search, ChevronDown, User, HeartPulse, Activity, ShieldCheck, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { SignupModal } from '@/components/layout/SignupModal';
import { getStoredPatientProfile } from '@/lib/storage';
import { PatientProfile } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [myDentalOpen, setMyDentalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(getStoredPatientProfile());

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMyDentalOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const isMyDentalActive = pathname?.startsWith('/dental-habits') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/insurance');

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 transition-all bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 via-brand-700 to-cyan-600 flex items-center justify-center text-white shadow-subtle group-hover:shadow-glow transition-all duration-300">
            <div className="relative">
              <Shield className="w-5 h-5 text-white" />
              <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1 -right-1" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-brand-950">
              Oral<span className="text-brand-600">Sense</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 -mt-0.5 hidden sm:block">
              Dental Early-Screening
            </span>
          </div>
        </Link>

        {/* Clean Standard Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
          
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/')
                ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
            }`}
          >
            Home
          </Link>

          <Link
            href="/how-it-works"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/how-it-works')
                ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
            }`}
          >
            How It Works
          </Link>

          <Link
            href="/screening"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/screening')
                ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
            }`}
          >
            Screening
          </Link>

          <Link
            href="/find-care"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/find-care')
                ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
            }`}
          >
            Find Care
          </Link>

          <Link
            href="/services"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/services')
                ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
            }`}
          >
            Dental Services
          </Link>

          {/* My Dental Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMyDentalOpen(!myDentalOpen)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                isMyDentalActive
                  ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
              }`}
            >
              <span>My Dental</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${myDentalOpen ? 'rotate-180' : ''}`} />
            </button>

            {myDentalOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                <Link
                  href="/dental-habits"
                  onClick={() => setMyDentalOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <HeartPulse className="w-4 h-4 text-cyan-600" />
                  <span>Dental Habits</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMyDentalOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <Activity className="w-4 h-4 text-brand-600" />
                  <span>My Journey</span>
                </Link>
                <Link
                  href="/insurance"
                  onClick={() => setMyDentalOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Insurance</span>
                </Link>
              </div>
            )}
          </div>

        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* Global Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchModalOpen(true)}
            icon={<Search className="w-4 h-4 text-slate-600" />}
            className="text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3"
          >
            Search
          </Button>

          {/* Account Menu Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-brand-900 text-white flex items-center justify-center text-[10px] font-black">
                {profile?.name ? profile.name.charAt(0) : 'U'}
              </div>
              <span>{profile?.name ? profile.name.split(' ')[0] : 'Account'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {accountMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 text-left">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-extrabold text-brand-950 line-clamp-1">{profile?.name || 'OralSense Patient'}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{profile?.email || 'Patient Account'}</div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Profile & Preferences</span>
                </Link>

                <Link
                  href="/results"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span>Screening Results</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <HeartPulse className="w-4 h-4 text-indigo-600" />
                  <span>My Journey</span>
                </Link>

                <Link
                  href="/dental-habits"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Dental Habits</span>
                </Link>

                <Link
                  href="/insurance"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 hover:bg-slate-50 rounded-xl"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Insurance</span>
                </Link>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setSignupModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-brand-800 hover:bg-brand-50 rounded-xl"
                  >
                    <UserPlus className="w-4 h-4 text-brand-700" />
                    <span>Create Account / Sign In</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200 text-left">
          <div className="flex flex-col space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
              Home
            </Link>
            <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
              How It Works
            </Link>
            <Link href="/screening" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
              Screening
            </Link>
            <Link href="/find-care" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
              Find Care
            </Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">
              Dental Services
            </Link>

            {/* My Dental Mobile Accordion */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <div className="px-4 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">My Dental</div>
              <Link href="/dental-habits" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50">
                <HeartPulse className="w-4 h-4 text-cyan-600" /> Dental Habits
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50">
                <Activity className="w-4 h-4 text-brand-600" /> My Journey
              </Link>
              <Link href="/insurance" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Insurance
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 bg-slate-50"
            >
              <Search className="w-4 h-4" /> Search OralSense
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSignupModalOpen(true);
                }}
                className="w-full p-2.5 rounded-xl bg-brand-900 text-white text-xs font-bold text-center"
              >
                Sign Up / Login
              </button>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full text-xs font-bold">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Signup / Create Account Modal */}
      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
    </header>
  );
};
