import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { DemoBanner } from '@/components/layout/DemoBanner';

export const metadata: Metadata = {
  title: 'OralSense | AI-Assisted Dental Early-Screening & Care Navigation',
  description: 'OralSense helps users screen dental concerns, understand preliminary indication levels, connect with verified dentists and clinics, and track care continuity.',
  keywords: ['OralSense', 'dental screening', 'oral health', 'bruxism', 'dentist finder', 'teeth cleaning', 'dental care navigation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className="flex flex-col min-h-screen bg-healthBg text-slate-900 antialiased selection:bg-brand-200 selection:text-brand-900">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <DemoBanner />
      </body>
    </html>
  );
}
