'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  autoComplete,
  className,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-bark-muted">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full rounded-[10px] border px-3.5 py-2.5 font-sans text-sm text-bark outline-none transition-colors',
          focused ? 'border-bark' : 'border-border',
          disabled ? 'cursor-not-allowed bg-surface-2 text-bark-muted' : 'bg-white'
        )}
      />
    </div>
  );
}
