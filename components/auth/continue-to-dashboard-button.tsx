'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { setAuthSession } from '@/lib/auth-session';

export function ContinueToDashboardButton({ label = 'Continue' }: { label?: string }) {
  const router = useRouter();

  function handleContinue(e: React.MouseEvent) {
    e.preventDefault();
    setAuthSession();
    router.push('/dashboard');
  }

  return (
    <button
      type="button"
      onClick={handleContinue}
      className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-3 text-sm font-semibold transition-colors mt-2"
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
