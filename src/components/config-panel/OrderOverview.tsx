import type { ShopifyCollar } from '@/lib/shopify'

interface OrderOverviewProps {
  collar: ShopifyCollar | null
  divider: string
  isDark: boolean
  selectedCharms: (string | null)[]
  size: string
  textMuted: string
  textPrimary: string
  textSecondary: string
}

export function OrderOverview ({
  collar,
  divider,
  isDark,
  selectedCharms,
  size,
  textMuted,
  textPrimary,
  textSecondary
}: OrderOverviewProps) {
  const selectedCharmCount = selectedCharms.filter(Boolean).length

  return (
    <div
      style={{
        marginTop: 14,
        padding: 14,
        borderRadius: 12,
        background: isDark ? 'rgba(255,255,255,0.04)' : '#F3EDE6',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E8E3DC'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: textMuted
        }}
      >
        Užsakymo suvestinė
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: textSecondary }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: collar?.color ?? 'transparent',
              display: 'inline-block'
            }}
          />
          Antkaklis
        </span>
        <span style={{ color: textPrimary, fontWeight: 500 }}>{collar?.title ?? ''}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: textSecondary }}>
        <span>Pakabukai</span>
        <span style={{ color: textPrimary, fontWeight: 500 }}>
          {selectedCharmCount} pakab.
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: textSecondary }}>
        <span>Dydis</span>
        <span style={{ color: textPrimary, fontWeight: 500 }}>
          {size ? size.split(' — ')[0] : '—'}
        </span>
      </div>

      <div style={{ height: 1, background: divider, margin: '2px 0' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          fontWeight: 600,
          color: textPrimary
        }}
      >
        <span>Iš viso</span>
        <span>€28</span>
      </div>
    </div>
  )
}
