'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useLoginMutation, useRegisterMutation } from '@/lib/api/hooks';
import { ApiError } from '@/lib/api/client';
import { setAuthSessionFromTokens } from '@/lib/auth-session';
import type { LoginRequest, RegisterRequest } from '@/lib/contracts';

type Mode = 'login' | 'register';

export function AuthSubmitButton({
  mode,
  label,
}: {
  mode: Mode;
  label: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const loading = loginMutation.isPending || registerMutation.isPending;

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    setError(null);

    const form = (e.currentTarget as HTMLButtonElement).closest('form');
    if (!form) return;

    const fd = new FormData(form);
    const email = String(fd.get('email') ?? '').trim();
    const password = String(fd.get('password') ?? '');

    try {
      if (mode === 'login') {
        const body: LoginRequest = { email, password };
        const res = await loginMutation.mutateAsync(body);
        setAuthSessionFromTokens(res);
        router.push(res.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        const company_name = String(fd.get('company_name') ?? '').trim();
        const body: RegisterRequest = { company_name, email, password };
        const res = await registerMutation.mutateAsync(body);
        setAuthSessionFromTokens(res);
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Could not reach the API. Is the backend running on port 3001?');
      }
    }
  }

  return (
    <div>
      {error ? (
        <p className="text-sm text-red-600 mb-2" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] disabled:opacity-60 text-white rounded-lg py-3 text-sm font-semibold transition-colors mt-2"
      >
        {loading ? 'Please wait…' : label}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
