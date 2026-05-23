'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Plus,
  Store,
} from 'lucide-react';
import { SidebarLogoutLink } from '@/components/dashboard/sidebar-logout-link';
import UserAccountMenu from '@/components/UserAccountMenu';
import { useAuthSession } from '@/hooks/use-auth-session';
import { useCurrentUser } from '@/lib/api/hooks';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Shop', href: '/marketplace', icon: Store },
  { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Sourcing Requests', href: '/dashboard/sourcing', icon: FileText },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, isLoggedIn } = useAuthSession();
  const { displayName, user, initials } = useCurrentUser();

  useEffect(() => {
    if (ready && !isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [ready, isLoggedIn, router]);

  if (!ready || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] text-sm text-[#737784]">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      <header className="bg-white border-b border-[#e5eeff] h-14 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-20">
        <Link href="/" className="text-xl font-bold tracking-tight shrink-0" style={{ color: '#004aad' }}>
          Dubiken
        </Link>
        <div className="flex-1" />
        <UserAccountMenu />
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className="fixed left-0 top-14 bottom-0 w-52 border-r border-[#e5eeff] flex flex-col overflow-hidden z-10"
          style={{ backgroundColor: '#eff4ff' }}
        >
          <div className="p-4 border-b border-[#dce9ff] shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-md border border-[#b8bcc8] shrink-0 flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: '#004aad' }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-black truncate">{displayName}</p>
                <p className="text-xs text-[#737784] truncate">{user?.email ?? ''}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href === '/marketplace' && pathname.startsWith('/marketplace')) ||
                (href !== '/dashboard' && href !== '/marketplace' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#ff924d] text-white'
                      : 'text-[#434653] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 p-3 border-t border-[#e2e8f0]">
            <Link
              href="/dashboard/sourcing/new"
              className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Quote
            </Link>
          </div>

          <div className="shrink-0 py-2 px-2 border-t border-[#e2e8f0]">
            <SidebarLogoutLink />
          </div>
        </aside>

        <div className="flex-1 min-h-0 ml-52 overflow-y-auto bg-[#f8f9ff]">{children}</div>
      </div>
    </div>
  );
}
