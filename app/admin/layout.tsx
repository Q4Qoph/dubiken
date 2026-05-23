'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/lib/api/hooks';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Tags,
  Plus,
} from 'lucide-react';
import { SidebarLogoutLink } from '@/components/dashboard/sidebar-logout-link';
import UserAccountMenu from '@/components/UserAccountMenu';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Sourcing Requests', href: '/admin/sourcing', icon: FileText },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tags },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  // { label: 'Logistics', href: '/admin/logistics', icon: Truck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { displayName, company, initials, role, mounted, isLoading } = useCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9]">
      <header className="bg-white border-b border-[#e2e8f0] h-14 flex items-center px-4 gap-4 z-20 sticky top-0">
        <Link href="/admin" className="text-[#1a2d5a] font-bold text-lg tracking-tight w-48 shrink-0">
          Dubiken
        </Link>
        
        <div className="flex-1 max-w-sm ml-auto">
         
        </div>
        <div className="flex items-center gap-2 ml-4">
          <UserAccountMenu />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className="fixed left-0 top-14 bottom-0 w-52 border-r border-[#e5eeff] flex flex-col overflow-hidden z-10"
          style={{ backgroundColor: '#eff4ff' }}
        >
          <div className="p-4 border-b border-[#e2e8f0] shrink-0">
            <div className="flex items-center gap-3">
              {!mounted || isLoading ? (
                <>
                  <div className="w-9 h-9 rounded-lg bg-[#dce9ff] animate-pulse shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3.5 w-24 bg-[#dce9ff] rounded animate-pulse" />
                    <div className="h-3 w-16 bg-[#dce9ff] rounded animate-pulse" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-lg bg-[#1a2d5a] flex items-center justify-center text-white shrink-0 text-xs font-bold">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1a2d5a] truncate">{displayName}</p>
                    <p className="text-xs text-[#718096] truncate">
                      {role === 'admin' ? company || 'Admin' : 'Operations'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <nav className="flex-1 min-h-0 py-3 px-2 space-y-0.5 overflow-hidden">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== '/admin' &&
                  pathname.startsWith(href) &&
                  !(href === '/admin/inventory' && pathname.startsWith('/admin/categories')));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#f07c00] text-white'
                      : 'text-[#4a5568] hover:bg-[#f0f4f9] hover:text-[#1a2d5a]'
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
              href="/admin/inventory/new"
              className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>

          <div className="shrink-0 py-2 px-2 border-t border-[#e2e8f0] space-y-0.5">
            <SidebarLogoutLink />
          </div>
        </aside>

        <main className="flex-1 min-h-0 ml-52 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
