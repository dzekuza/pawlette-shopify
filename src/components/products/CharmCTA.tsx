'use client'

import { useTranslations } from 'next-intl'
import { FREE_SHIPPING_COPY } from '@/lib/site-config'
import { MAX_CHARMS, TEXT_MUTED } from '@/components/products/pdpConstants'

export function CharmCTA ({ added, count, onClick }: { added: boolean; count: number; onClick: () => void }) {
  const t = useTranslations('products.pdp')
  const label = added
    ? t('addedToCart')
    : count > 0
      ? t('buyWithCharms', { count })
      : t('chooseUpToCharms', { max: MAX_CHARMS })
  return (
    <div>
      <button
        onClick={onClick}
        disabled={!count}
        className="p-3.5 md:p-4"
        style={{
          width: '100%', borderRadius: 50, border: 'none',
          cursor: count ? 'pointer' : 'not-allowed',
          fontWeight: 600, fontSize: 16, letterSpacing: '0.01em',
          background: count ? 'var(--color-sage)' : '#E8E3DC',
          color: count ? 'var(--color-interactive-text)' : TEXT_MUTED,
          transition: 'background-color 150ms ease-out, transform 80ms ease-out',
          boxShadow: count ? '0 4px 20px rgba(168,213,162,0.45)' : 'none',
        }}
        onMouseEnter={(e) => { if (count) { e.currentTarget.style.background = '#8fc489'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
        onMouseLeave={(e) => { if (count) { e.currentTarget.style.background = 'var(--color-sage)'; e.currentTarget.style.transform = 'translateY(0)' } }}
        onMouseDown={(e) => { if (count) e.currentTarget.style.transform = 'translateY(1px)' }}
        onMouseUp={(e) => { if (count) e.currentTarget.style.transform = 'translateY(-1px)' }}
      >
        {label}
      </button>
      <p style={{ textAlign: 'center', marginTop: 2, marginBottom: 0, fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.02em' }}>{FREE_SHIPPING_COPY} · {t('madeInLithuania')}</p>
    </div>
  )
}
