'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Truck, BarChart3, Settings, HelpCircle, Plus, Search, ShoppingBag, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { label: 'Logistics', href: '/dashboard/logistics', icon: Truck },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9]">
      {/* Top header */}
      <header className="bg-white border-b border-[#e2e8f0] h-14 flex items-center px-4 gap-4 z-20 sticky top-0">
        <Link href="/dashboard" className="text-[#1a2d5a] font-bold text-lg tracking-tight w-48 shrink-0">
          Dubiken
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {['Kenya', 'Dubai', 'China'].map(region => (
            <button key={region} className="px-3 py-1.5 text-sm text-[#4a5568] hover:text-[#1a2d5a] hover:bg-[#f0f4f9] rounded-md transition-colors">
              {region}
            </button>
          ))}
        </nav>
        <div className="flex-1 max-w-sm ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0aec0]" />
            <input
              type="text"
              placeholder="Search operations..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#e2e8f0] rounded-lg bg-[#f7f9fc] focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/20 focus:border-[#1a3a7a]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button className="p-2 rounded-lg hover:bg-[#f0f4f9] text-[#4a5568] relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#f07c00] rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#f0f4f9] text-[#4a5568]">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-[#e2e8f0] flex flex-col shrink-0">
          {/* User badge */}
          <div className="p-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1a2d5a] flex items-center justify-center text-white text-xs font-bold shrink-0">
                img
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a2d5a] truncate">Admin Panel</p>
                <p className="text-xs text-[#718096] truncate">Global Operations</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
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

          {/* New Quote CTA */}
          <div className="p-3 border-t border-[#e2e8f0]">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
              <Plus className="w-4 h-4" />
              New Quote
            </button>
          </div>

          {/* Bottom links */}
          <div className="py-2 px-2 border-t border-[#e2e8f0] space-y-0.5">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#718096] hover:bg-[#f0f4f9] hover:text-[#1a2d5a] transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#718096] hover:bg-[#f0f4f9] hover:text-[#1a2d5a] transition-colors">
              <HelpCircle className="w-4 h-4" /> Support
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
          <footer className="mt-8 border-t border-[#e2e8f0] bg-white py-5 px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#a0aec0]">
            <div>
              <p className="font-semibold text-[#4a5568]">Dubiken Global</p>
              <p>© 2024 Dubiken Global. All rights reserved.</p>
            </div>
            <nav className="flex flex-wrap gap-4 justify-end">
              {['Sourcing Guide', 'Shipping Policy', 'Tracking', 'Contact Support', 'Terms of Service'].map(l => (
                <a key={l} href="#" className="hover:text-[#1a2d5a] transition-colors">{l}</a>
              ))}
            </nav>
          </footer>
        </main>
      </div>
    </div>
  );
}
