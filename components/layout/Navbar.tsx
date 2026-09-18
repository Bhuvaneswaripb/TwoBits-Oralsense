'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Sparkles, Menu, X, ArrowRight, UserCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Screening', href: '/screening' },
    { label: 'Find Care', href: '/find-care' },
    { label: 'Dental Services', href: '/services' },
    { label: 'My Journey', href: '/dashboard' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 transition-all bg-white/90 backdrop-blur-md">
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
            <span className="text-xl font-extrabold tracking-tight text-brand-950 flex items-center gap-1">
              Oral<span className="text-brand-600">Sense</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 -mt-1 hidden sm:block">
              Dental Early-Screening
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white text-brand-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-brand-800 hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchModalOpen(true)}
            icon={<Search className="w-4 h-4 text-slate-600" />}
            className="text-xs font-semibold border border-slate-200/80 bg-slate-50 hover:bg-slate-100"
          >
            Search...
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="sm" icon={<UserCheck className="w-4 h-4 text-slate-600" />}>
              Account
            </Button>
          </Link>
          <Link href="/screening">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Start Screening
            </Button>
          </Link>
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
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 py-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-800 font-bold border-l-4 border-brand-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/screening" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full font-bold">
                Start Screening
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full text-xs font-bold">
                  Account
                </Button>
              </Link>
              <Link href="/find-care" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="md" className="w-full text-xs font-bold">
                  Find Care
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
};
