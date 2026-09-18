'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const OpeningSplash: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Check if user has seen splash in this session
    try {
      const hasSeen = sessionStorage.getItem('oralsense_splash_seen');
      if (hasSeen) {
        return;
      }
    } catch (e) {
      // ignore storage error
    }

    // Show splash briefly
    setVisible(true);

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1100); // Start fade at 1.1s

    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('oralsense_splash_seen', 'true');
      } catch (e) {}
    }, 1500); // Fully hide at 1.5s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 text-white transition-opacity duration-600 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ripple & Wave Glow Effect */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-500/20 blur-2xl animate-ping pointer-events-none duration-1000" />

      {/* Centered Logo & Branding Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
        
        {/* Animated Logo Shield */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-brand-600 to-brand-800 flex items-center justify-center shadow-glow border border-cyan-300/30 transform transition-transform duration-500 hover:scale-105">
            <Shield className="w-12 h-12 text-white" />
            <Sparkles className="w-6 h-6 text-cyan-300 absolute -top-2 -right-2 animate-bounce" />
          </div>
          {/* Concentric Wave Rings */}
          <div className="absolute -inset-4 rounded-3xl border border-cyan-400/20 animate-ping pointer-events-none" />
        </div>

        {/* Wordmark */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Oral<span className="text-cyan-400">Sense</span>
          </h1>
          <div className="text-xs uppercase font-extrabold tracking-[0.3em] text-cyan-300">
            DENTAL EARLY-SCREENING
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base font-semibold text-slate-300 tracking-wide">
          Understand. Screen. Connect. Care.
        </p>

        {/* Subtle Loading Pulse Bar */}
        <div className="w-36 bg-white/10 rounded-full h-1 overflow-hidden mt-4">
          <div className="bg-gradient-to-r from-cyan-400 to-brand-500 h-1 rounded-full animate-pulse w-full" />
        </div>

      </div>
    </div>
  );
};
