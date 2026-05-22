'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ContinueToDashboardButton({ label = 'Sign in to continue' }: { label?: string }) {
  return (
    <Link
      href="/auth/login"
      className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-3 text-sm font-semibold transition-colors mt-2"
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
