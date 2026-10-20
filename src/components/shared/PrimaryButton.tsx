'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  fullWidth?: boolean
  variant?: 'dark' | 'sage' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<PrimaryButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-12 px-8 text-[15px]',
}

const VARIANT_CLASSES: Record<NonNullable<PrimaryButtonProps['variant']>, { base: string; reveal: string }> = {
  dark: { base: 'bg-bark text-cream', reveal: 'text-cream' },
  sage: { base: 'bg-sage text-interactive-text', reveal: 'text-interactive-text' },
  // Outline button for secondary actions; turns white-on-glass over the hero photo from lg up.
  ghost: {
    base: 'border border-bark/30 text-bark hover:bg-bark/5 lg:border-white/60 lg:bg-white/10 lg:text-white lg:backdrop-blur-sm lg:hover:bg-white/20',
    reveal: 'text-bark lg:text-white',
  },
}

const TRAILING_ARROW = /\s*[→⟶➜]\s*$/

/** The hover reveal adds its own arrow, so a literal trailing "→" in a label would show twice. */
function stripTrailingArrow(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') return node.replace(TRAILING_ARROW, '')
  if (Array.isArray(node) && node.length > 0) {
    return [...node.slice(0, -1), stripTrailingArrow(node[node.length - 1])]
  }
  return node
}

export function PrimaryButton({
  children,
  onClick,
  href,
  fullWidth = false,
  variant = 'dark',
  type = 'button',
  disabled,
  size = 'md',
  className: extraClassName,
}: PrimaryButtonProps) {
  const v = VARIANT_CLASSES[variant]
  const label = stripTrailingArrow(children)

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
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {label}
        </span>
      </span>
      <span
        className={cn(
          'absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100',
          v.reveal,
        )}
      >
        <span>{label}</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  )
}
