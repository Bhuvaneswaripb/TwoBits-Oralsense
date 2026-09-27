'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WeeklyReportRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dental-habits');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center text-slate-500 text-sm">
      Redirecting to Dental Habits...
    </div>
  );
}
