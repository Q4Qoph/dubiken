import Link from 'next/link';
import AuthMarketingPanel from '@/components/auth/auth-marketing-panel';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-[#e2e8f0] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-[#1a2d5a] font-bold text-xl tracking-tight hover:opacity-90">
          Dubiken
        </Link>
        <nav className="flex gap-6 text-sm text-[#718096]">
          <Link href="#" className="hover:text-[#1a2d5a] transition-colors">
            Help Center
          </Link>
          <Link href="#" className="hover:text-[#1a2d5a] transition-colors">
            Safety &amp; Security
          </Link>
        </nav>
      </header>

      <div className="flex flex-1">
        <AuthMarketingPanel />
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
