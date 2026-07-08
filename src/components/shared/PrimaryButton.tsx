'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  fullWidth?: boolean
  variant?: 'dark' | 'sage'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<PrimaryButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-12 px-8 text-[15px]',
}

const VARIANT_CLASSES: Record<NonNullable<PrimaryButtonProps['variant']>, { base: string; dot: string; reveal: string }> = {
  dark: { base: 'bg-bark text-cream', dot: 'bg-cream', reveal: 'text-bark' },
  sage: { base: 'bg-sage text-interactive-text', dot: 'bg-bark', reveal: 'text-cream' },
}

export function PrimaryButton({
  children,
  onClick,
  href,
  fullWidth = false,
  variant = 'dark',
  size = 'md',
  className: extraClassName,
}: PrimaryButtonProps) {
  const v = VARIANT_CLASSES[variant]

  const className = cn(
    'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    SIZE_CLASSES[size],
    v.base,
    fullWidth && 'w-full',
    extraClassName,
  )

  const content = (
    <>
      <span className="flex items-center justify-center gap-2">
        <span className={cn('h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-[100.8]', v.dot)} />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </span>
      <span
        className={cn(
          'absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100',
          v.reveal,
        )}
      >
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  )
}
