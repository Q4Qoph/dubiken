'use client';

import Link from 'next/link';
import AuthModeTabs from '@/components/auth/auth-mode-tabs';
import AuthSocialButtons from '@/components/auth/auth-social-buttons';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';

const inputClass =
  'w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all';

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#1a2d5a] mb-1">Welcome back</h2>
      <p className="text-[#718096] mb-8">Log in to manage your global sourcing orders.</p>

      <AuthModeTabs />

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[#2d3748] mb-1.5">
            Email Address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-[#2d3748] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${inputClass} pr-20`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a3a7a] text-sm font-medium hover:underline"
            >
              Forgot?
            </button>
          </div>
        </div>

        <AuthSubmitButton mode="login" label="Log in" />
      </form>

      <AuthSocialButtons />

      <p className="text-center text-sm text-[#718096] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-[#1a3a7a] font-semibold hover:underline">
          Sign up
        </Link>
      </p>

      <p className="text-center text-xs text-[#a0aec0] mt-4">
        By continuing, you agree to Dubiken&apos;s{' '}
        <Link href="#" className="text-[#1a3a7a] hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="text-[#1a3a7a] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
