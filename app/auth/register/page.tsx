'use client';

import Link from 'next/link';
import AuthModeTabs from '@/components/auth/auth-mode-tabs';
import AuthSocialButtons from '@/components/auth/auth-social-buttons';
import { ContinueToDashboardButton } from '@/components/auth/continue-to-dashboard-button';

const inputClass =
  'w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all';

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#1a2d5a] mb-1">Create your account</h2>
      <p className="text-[#718096] mb-8">Register to start sourcing across Kenya, Dubai, and China.</p>

      <AuthModeTabs />

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="register-company" className="block text-sm font-medium text-[#2d3748] mb-1.5">
            Company Name
          </label>
          <input
            id="register-company"
            type="text"
            autoComplete="organization"
            placeholder="Your company name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-[#2d3748] mb-1.5">
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-[#2d3748] mb-1.5">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <ContinueToDashboardButton label="Create account" />
      </form>

      <AuthSocialButtons />

      <p className="text-center text-sm text-[#718096] mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#1a3a7a] font-semibold hover:underline">
          Log in
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
