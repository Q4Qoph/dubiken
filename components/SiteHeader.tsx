'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Bell, User } from 'lucide-react';
import { useAuthSession } from '@/hooks/use-auth-session';
import { useCart } from '@/hooks/use-cart';

const BLUE = '#004aad';

export interface SiteHeaderProps {
  searchPlaceholder?: string;
  className?: string;
}

export default function SiteHeader({
  searchPlaceholder = 'Search for products, vendors or categories...',
  className = '',
}: SiteHeaderProps) {
  const { ready, isLoggedIn } = useAuthSession();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <header
      className={`bg-white border-b border-[#c3c6d5] sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center gap-4 lg:gap-8">
        <Link href="/" className="font-bold text-xl shrink-0" style={{ color: BLUE }}>
          Dubiken
        </Link>

        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#737784]" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 py-2.5 border border-[#c3c6d5] rounded bg-[#f8f9ff] text-sm text-[#0b1c30] placeholder:text-[#737784] focus:outline-none focus:border-[#004aad]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto sm:ml-0">
          <button
            type="button"
            className="p-2 text-[#0b1c30] hover:bg-[#f8f9ff] rounded"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <Link href="/checkout" className="relative p-2 text-[#0b1c30] hover:bg-[#f8f9ff] rounded">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={menuRef}>
            {ready && isLoggedIn ? (
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-md overflow-hidden border border-[#c3c6d5] bg-[#eff4ff] flex items-center justify-center hover:opacity-90"
                aria-label="Go to dashboard"
              >
                <User className="w-5 h-5 text-[#434653]" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="w-9 h-9 rounded-md overflow-hidden border border-[#c3c6d5] bg-[#eff4ff] flex items-center justify-center hover:bg-[#dce9ff]"
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                >
                  <User className="w-5 h-5 text-[#434653]" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-[#c3c6d5] rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2.5 text-sm font-bold text-[#434653] hover:bg-[#f8f9ff]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-4 py-2.5 text-sm font-bold text-[#434653] hover:bg-[#f8f9ff]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
