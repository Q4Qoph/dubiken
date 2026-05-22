'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/auth/login', label: 'Login' },
  { href: '/auth/register', label: 'Register' },
] as const;

export default function AuthModeTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 border border-[#e2e8f0] rounded-lg p-1 mb-8 bg-[#f7f9fc]">
      {tabs.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`py-2.5 rounded-md text-sm font-medium text-center transition-all ${
              active
                ? 'bg-white text-[#1a2d5a] shadow-sm'
                : 'text-[#718096] hover:text-[#1a2d5a]'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
