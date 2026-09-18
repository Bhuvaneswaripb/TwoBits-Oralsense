'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Stethoscope, Calendar, Activity, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Screen', href: '/screening', icon: Stethoscope },
    { label: 'Appointments', href: '/appointments', icon: Calendar },
    { label: 'Monitor', href: '/mouthguard', icon: Activity },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                active
                  ? 'text-brand-700 font-semibold bg-brand-50/80 scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-brand-600' : 'text-slate-500'}`} />
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
