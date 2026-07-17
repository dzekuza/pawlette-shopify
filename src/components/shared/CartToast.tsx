'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWindowWidth } from '@/hooks/useWindowWidth'

export interface CartToastItem {
  id: string
  title: string
  image?: string
}

interface CartToastProps {
  items: CartToastItem[] | null
  onClose: () => void
  duration?: number
}

export function CartToast ({ items, onClose, duration = 3500 }: CartToastProps) {
  const w = useWindowWidth() ?? 1200
  const isDesktop = w >= 768

  useEffect(() => {
    if (!items || items.length === 0) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [items, duration, onClose])

  return (
    <AnimatePresence>
      {items && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 'calc(88px + env(safe-area-inset-top, 0px))',
            ...(isDesktop
              ? { right: 24, left: 'auto', transform: 'none' }
              : { left: '50%', transform: 'translateX(-50%)' }),
            zIndex: 900,
            width: 'min(360px, calc(100vw - 24px))',
            background: 'var(--color-cream)',
            borderRadius: 18,
            boxShadow: '0 14px 40px rgba(61,53,48,0.18)',
            border: '1px solid var(--color-border)',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span
              aria-hidden="true"
              style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'var(--color-sage)', color: 'var(--color-interactive-text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-bark)' }}>
              {items.length > 1 ? 'Pridėta į krepšelį' : 'Pridėta į krepšelį'}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Uždaryti pranešimą"
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: 'var(--color-bark-muted)', padding: 4 }}
            >
              ×
            </button>
          </div>

          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 56, flexShrink: 0 }}>
                <div
                  className="bg-surface-2"
                  style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}
                >
                  {item.image
                    ? <Image src={item.image} alt="" aria-hidden="true" width={40} height={40} style={{ objectFit: 'contain' }} />
                    : null}
                </div>
                <span
                  style={{
                    fontSize: 10, fontWeight: 500, textAlign: 'center', lineHeight: 1.2,
                    color: 'var(--color-bark-light)',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/cart"
            style={{ display: 'block', marginTop: 10, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-interactive-text)' }}
          >
            Peržiūrėti krepšelį →
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
