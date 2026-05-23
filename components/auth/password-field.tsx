'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const inputClass =
  'w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all';

type PasswordFieldProps = {
  id: string;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
};

export default function PasswordField({
  id,
  name = 'password',
  autoComplete = 'current-password',
  placeholder = '••••••••',
  className,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass} pr-11 ${className ?? ''}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#2d3748] p-0.5"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
      </button>
    </div>
  );
}
