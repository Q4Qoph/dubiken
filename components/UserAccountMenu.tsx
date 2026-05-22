'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';
import { useCurrentUser, useLogoutMutation } from '@/lib/api/hooks';
import { clearAuthSession } from '@/lib/auth-session';

const BLUE = '#004aad';

export default function UserAccountMenu({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const { user, isLoggedIn, displayName, company, dashboardHref, initials, isLoading } =
    useCurrentUser();
  const mounted = useMounted();
  const logout = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }
  }, [open]);

  if (!mounted || isLoading) {
    return (
      <div className="h-9 w-[88px] rounded-md bg-[#eff4ff] border border-[#c3c6d5] animate-pulse" aria-hidden />
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  async function handleLogout() {
    try {
      await logout.mutateAsync();
    } catch {
      /* still clear local session */
    }
    clearAuthSession();
    setOpen(false);
    router.push('/auth/login');
  }

  if (compact) {
    return (
      <Link
        href={dashboardHref}
        className="w-9 h-9 rounded-md border border-[#c3c6d5] bg-[#eff4ff] flex items-center justify-center text-xs font-bold text-[#434653] hover:opacity-90"
        style={{ color: BLUE }}
        aria-label={`${displayName} account`}
      >
        {initials}
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md border border-[#c3c6d5] bg-[#eff4ff] hover:bg-[#dce9ff] max-w-[200px]"
        aria-expanded={open}
      >
        <span
          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: BLUE }}
        >
          {initials}
        </span>
        <span className="hidden sm:block text-left min-w-0">
          <span className="block text-xs font-bold text-[#0b1c30] truncate">{displayName}</span>
          {company ? (
            <span className="block text-[10px] text-[#737784] truncate">{company}</span>
          ) : null}
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#c3c6d5] rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-[#e5eeff]">
            <p className="text-sm font-bold text-black truncate">{displayName}</p>
            <p className="text-xs text-[#737784] truncate">{user.email}</p>
            {company ? <p className="text-xs text-[#737784] truncate">{company}</p> : null}
          </div>
          <Link
            href={dashboardHref}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#434653] hover:bg-[#f8f9ff]"
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4" />
            {user.role === 'admin' ? 'Admin dashboard' : 'My dashboard'}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
