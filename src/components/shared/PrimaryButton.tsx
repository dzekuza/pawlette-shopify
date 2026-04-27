'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

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
  const bg = variant === 'dark' ? 'var(--color-bark)' : 'var(--color-sage)'
  const color = variant === 'dark' ? 'var(--color-cream)' : 'var(--color-bark)'
  const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 45
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14

  const sharedStyle = {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: fullWidth ? '100%' : undefined,
    height,
    borderRadius: 100,
    background: bg,
    color,
    border: 'none',
    fontSize,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.01em',
    padding: '0 24px',
    textDecoration: 'none',
    boxSizing: 'border-box' as const,
  }

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, opacity: 0.92 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25 }}
        style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : undefined }}
      >
        <Link href={href} style={sharedStyle}>
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      animate={{ background: bg, color }}
      whileHover={{ scale: 1.02, opacity: 0.92 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25 }}
      style={sharedStyle}
    >
      {children}
    </motion.button>
  )
}
