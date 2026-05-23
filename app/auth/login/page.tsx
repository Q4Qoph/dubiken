'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { safeRedirectPath } from '@/lib/safe-redirect';
import AuthModeTabs from '@/components/auth/auth-mode-tabs';
import PasswordField from '@/components/auth/password-field';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';

const inputClass =
  'w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';
  const prefilledEmail = searchParams.get('email') ?? '';
  const redirect = safeRedirectPath(searchParams.get('redirect'));
  const registerHref = redirect
    ? `/auth/register?redirect=${encodeURIComponent(redirect)}`
    : '/auth/register';

  return (
    <>
      <h2 className="text-2xl font-bold text-[#1a2d5a] mb-1">Welcome back</h2>
      <p className="text-[#718096] mb-8">Log in to manage your orders and sourcing requests.</p>

      {justRegistered ? (
        <p
          className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6"
          role="status"
        >
          Account created. Sign in with your email and password.
        </p>
      ) : null}

      <AuthModeTabs />

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[#2d3748] mb-1.5">
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            defaultValue={prefilledEmail}
            className={inputClass}
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-[#2d3748]">
              Password
            </label>
            <Link href="#" className="text-xs font-medium text-[#1a3a7a] hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordField id="login-password" name="password" autoComplete="current-password" />
        </div>

        <AuthSubmitButton mode="login" label="Log in" />
      </form>

      <p className="text-center text-sm text-[#718096] mt-6">
        Don&apos;t have an account?{' '}
        <Link href={registerHref} className="text-[#1a3a7a] font-semibold hover:underline">
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
