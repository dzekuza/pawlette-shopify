'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  fullWidth?: boolean
  variant?: 'dark' | 'sage'
  size?: 'sm' | 'md' | 'lg'
}

export function PrimaryButton({
  children,
  onClick,
  href,
  fullWidth = false,
  variant = 'dark',
  size = 'md',
}: PrimaryButtonProps) {
  const buttonVariant = variant === 'dark' ? 'bark' : 'sage'
  const buttonSize = size === 'sm' ? 'pill-sm' : size === 'lg' ? 'pill-lg' : 'pill'
  const widthClass = fullWidth ? 'w-full' : undefined

  if (href) {
    return (
      <Button asChild variant={buttonVariant} size={buttonSize} className={widthClass}>
        <Link href={href}>{children}</Link>
      </Button>
    )
  }

  return (
    <Button onClick={onClick} variant={buttonVariant} size={buttonSize} className={widthClass}>
      {children}
    </Button>
  )
}
