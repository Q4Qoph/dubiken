'use client';

import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useMounted } from '@/hooks/use-mounted';
import { useCurrentUser } from '@/lib/api/hooks';
import DubikenLogo from '@/components/DubikenLogo';
import UserAccountMenu from '@/components/UserAccountMenu';

export interface SiteHeaderProps {
  searchPlaceholder?: string;
  className?: string;
}

function HeaderSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const [query, setQuery] = useState(urlSearch);

  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  function goToMarketplaceSearch(term: string) {
    const params = new URLSearchParams();
    const q = term.trim();
    if (q) params.set('search', q);
    if (pathname.startsWith('/marketplace')) {
      const category = searchParams.get('category');
      const hub = searchParams.get('hub');
      if (category) params.set('category', category);
      if (hub) params.set('hub', hub);
    }
    const qs = params.toString();
    router.push(qs ? `/marketplace?${qs}` : '/marketplace');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    goToMarketplaceSearch(query);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#737784] pointer-events-none" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 border border-[#c3c6d5] rounded bg-[#f8f9ff] text-sm text-[#0b1c30] placeholder:text-[#737784] focus:outline-none focus:border-[#004aad]"
        aria-label="Search products"
      />
    </form>
  );
}

export default function SiteHeader({
  searchPlaceholder = 'Search products and categories…',
  className = '',
}: SiteHeaderProps) {
  const mounted = useMounted();
  const { isLoggedIn } = useCurrentUser();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const showLoggedIn = mounted && isLoggedIn;
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="h-[72px] flex items-center gap-3 sm:gap-4 lg:gap-8">
          <DubikenLogo href="/" size="header" />

          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <Suspense
              fallback={
                <div className="h-[42px] rounded bg-[#f8f9ff] border border-[#c3c6d5] animate-pulse" />
              }
            >
              <HeaderSearch placeholder={searchPlaceholder} />
            </Suspense>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0 ml-auto">
            <Link
              href="/marketplace"
              className="px-2 py-1.5 text-sm font-semibold text-[#434653] hover:text-[#004aad] shrink-0"
            >
              Shop
            </Link>
            <Link href="/checkout" className="relative p-2 text-[#0b1c30] hover:bg-[#f8f9ff] rounded">
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {!mounted ? (
              <div
                className="h-9 w-[88px] rounded-md bg-[#eff4ff] border border-[#c3c6d5] animate-pulse"
                aria-hidden
              />
            ) : showLoggedIn ? (
              <UserAccountMenu />
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="px-3 py-2 text-xs font-bold rounded-md border border-[#c3c6d5] bg-[#eff4ff] text-[#434653] hover:bg-[#dce9ff]"
                  aria-expanded={menuOpen}
                >
                  Sign in
                </button>
                {menuOpen ? (
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
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="pb-3 sm:hidden">
          <Suspense
            fallback={
              <div className="h-[42px] rounded bg-[#f8f9ff] border border-[#c3c6d5] animate-pulse" />
            }
          >
            <HeaderSearch placeholder={searchPlaceholder} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
