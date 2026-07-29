'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { ShopifyCharm } from '@/lib/shopify'

type CharmTab = 'all' | 'letter' | 'icon'

interface CharmsStepProps {
  borderColor: string
  charms: ShopifyCharm[]
  isDark: boolean
  selectedCharms: (string | null)[]
  textMuted: string
  textPrimary: string
  textSecondary: string
  toggleCharm: (id: string) => void
}

export function CharmsStep ({
  borderColor,
  charms,
  isDark,
  selectedCharms,
  textMuted,
  textPrimary,
  textSecondary,
  toggleCharm
}: CharmsStepProps) {
  const t = useTranslations('configure.charmsStep')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<CharmTab>('all')
  const selectedCount = selectedCharms.filter(Boolean).length

  const TABS: Array<{ id: CharmTab, label: string }> = [
    { id: 'all', label: t('tabAll') },
    { id: 'letter', label: t('tabLetters') },
    { id: 'icon', label: t('tabIcons') }
  ]

  const filtered = useMemo(() => {
    let list = tab === 'all' ? [...charms] : charms.filter((charm) => charm.category === tab)

    if (query.trim()) {
      list = list.filter((charm) => charm.title.toLowerCase().includes(query.toLowerCase()))
    }

    return list
  }, [query, tab, charms])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: textMuted
          }}
        >
          {t('title')}
        </div>
        <div style={{ fontSize: 12, fontWeight: 400, color: textSecondary }}>
          {selectedCount > 0
            ? t('selectedCount', { count: selectedCount })
            : <span style={{ color: textMuted, fontStyle: 'italic' }}>{t('optional')}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {TABS.map((tabOption) => {
          const active = tab === tabOption.id

          return (
            <button
              key={tabOption.id}
              onClick={() => setTab(tabOption.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'DM Sans',sans-serif",
                background: active ? textPrimary : (isDark ? 'rgba(255,255,255,0.07)' : 'var(--color-surface-2)'),
                color: active ? (isDark ? 'var(--color-bark)' : 'var(--color-cream)') : textMuted,
                transition: 'background-color 150ms ease-out, color 150ms ease-out'
              }}
            >
              {tabOption.label}
            </button>
          )
        })}
      </div>

      <input
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '9px 12px',
          borderRadius: 10,
          border: `1.5px solid ${borderColor}`,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'var(--color-surface-2)',
          color: textPrimary,
          fontSize: 13,
          fontFamily: "'DM Sans',sans-serif",
          outline: 'none',
          transition: 'border-color 150ms ease-out'
        }}
        onFocus={(event) => {
          event.target.style.borderColor = 'var(--color-sage)'
        }}
        onBlur={(event) => {
          event.target.style.borderColor = borderColor
        }}
      />

      <div style={{ overflowY: 'auto', maxHeight: 276, paddingRight: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {filtered.map((charm) => {
            const isSelected = selectedCharms.includes(charm.id)
            const isFull = selectedCount >= 5 && !isSelected

            return (
              <button
                key={charm.id}
                className={!isFull ? 'btn-press' : undefined}
                onClick={() => !isFull && toggleCharm(charm.id)}
                title={charm.title}
                style={{
                  borderRadius: 14,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'var(--color-surface-2)',
                  cursor: isFull ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '10px 6px 8px',
                  opacity: isFull ? 0.3 : 1,
                  outline: 'none',
                  border: isSelected ? `2px solid ${textPrimary}` : '2px solid transparent',
                  transition: 'border-color 120ms ease-out, opacity 150ms ease-out, transform 100ms ease-out',
                  boxShadow: isSelected ? '0 0 0 1px rgba(61,53,48,0.08)' : 'none'
                }}
              >
                <Image
                  src={charm.image}
                  alt=''
                  aria-hidden='true'
                  width={52}
                  height={52}
                  style={{ objectFit: 'contain' }}
                />
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'rgba(61,53,48,0.6)',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {charm.title}
                </span>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                padding: '24px 0',
                fontSize: 13,
                color: textMuted
              }}
            >
              {t('noResults')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
