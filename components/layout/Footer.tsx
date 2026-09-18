'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-950 text-slate-300 border-t border-slate-800">
      
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-brand-600 flex items-center justify-center text-brand-950 shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Oral<span className="text-cyan-400">Sense</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              OralSense is a Dental Early-Screening & Care Navigation Platform connecting patients from symptom notice to dentist evaluation and follow-up care.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span>CONCERN / SERVICE</span> • <span>SCREEN</span> • <span>SUMMARY</span> • <span>CONNECT</span> • <span>CARE</span> • <span>MONITOR</span>
            </div>
          </div>

          {/* Column 1: Patient Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Patient Care</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/screening" className="hover:text-white transition-colors">
                  AI-Assisted Screening
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  Find a Dentist
                </Link>
              </li>
              <li>
                <Link href="/clinics" className="hover:text-white transition-colors">
                  Clinics & Hospitals
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Dental Services
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Dental Journey
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Practices */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">For Dental Practices</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/for-practices" className="hover:text-white transition-colors">
                  Practice Overview
                </Link>
              </li>
              <li>
                <Link href="/dentist" className="hover:text-white transition-colors">
                  Practice Portal
                </Link>
              </li>
              <li>
                <Link href="/for-practices#workflow" className="hover:text-white transition-colors">
                  Practice Workflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Company & Support</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-white transition-colors">
                  Insurance & Coverage
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy & Data Control
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Medical Disclaimer:</strong> OralSense provides an early screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation.
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 OralSense. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Built for patients & dental care continuity</span>
          </div>
        </div>

      </div>

    </footer>
  );
};
