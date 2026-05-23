import Link from 'next/link';
import AuthMarketingPanel from '@/components/auth/auth-marketing-panel';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <AuthMarketingPanel />
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
