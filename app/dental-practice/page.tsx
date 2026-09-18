'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DentalPracticeAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dentist');
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Redirecting to Practice Portal...</p>
      </div>
    </div>
  );
}
