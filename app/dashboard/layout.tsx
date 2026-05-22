'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Plus,
  Search,
  User,
} from 'lucide-react';
import { SidebarLogoutLink } from '@/components/dashboard/sidebar-logout-link';
import { useAuthSession } from '@/hooks/use-auth-session';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Sourcing Requests', href: '/dashboard/sourcing', icon: FileText },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, isLoggedIn } = useAuthSession();

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
        <div className="flex-1 max-w-sm ml-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search orders..."
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs font-medium text-[#1a3a6b] hover:underline hidden sm:inline">
            Admin
          </Link>
          <Link
            href="/dashboard"
            className="p-1.5 hover:bg-gray-100 rounded-md"
            aria-label="Dashboard"
          >
            <User className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className="fixed left-0 top-14 bottom-0 w-52 border-r border-[#e5eeff] flex flex-col overflow-hidden z-10"
          style={{ backgroundColor: '#eff4ff' }}
        >
          <div className="p-4 border-b border-[#dce9ff] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-md bg-[#c3c6d5] border border-[#b8bcc8] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-black truncate">John Doe</p>
                <p className="text-xs text-[#737784] truncate">Premium Sourcing</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== '/dashboard' && pathname.startsWith(href));
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
