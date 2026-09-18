'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function DoctorsRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paramsString = searchParams?.toString();
    router.replace(`/find-care${paramsString ? `?${paramsString}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-8">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Redirecting to Find Care directory...</p>
      </div>
    </div>
  );
}

export default function DoctorsRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center p-8"><div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" /></div>}>
      <DoctorsRedirectContent />
    </Suspense>
  );
}

