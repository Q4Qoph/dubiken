'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuthSession } from '@/hooks/use-auth-session';

export function SidebarLogoutLink() {
  const router = useRouter();
  const { logout } = useAuthSession();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#4a5568] hover:bg-[#f0f4f9] hover:text-[#1a2d5a] transition-colors"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      Logout
    </button>
  );
}
