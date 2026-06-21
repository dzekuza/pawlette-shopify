'use client'

export type ProductFilter = 'all' | 'collars' | 'charms'

const FILTER_OPTIONS: Array<{ key: ProductFilter, label: string }> = [
  { key: 'all', label: 'Visi produktai' },
  { key: 'collars', label: 'Antkaklių rinkiniai' },
  { key: 'charms', label: 'Pakabukai' }
]

interface ProductsFilterTabsProps {
  filter: ProductFilter
  onChange: (filter: ProductFilter) => void
}

export function ProductsFilterTabs ({ filter, onChange }: ProductsFilterTabsProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 64,
        zIndex: 200,
        borderBottom: '1px solid rgba(61,53,48,0.08)',
        background: 'rgba(250,247,242,0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 48px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              className='btn-press'
              onClick={() => onChange(key)}
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                padding: '9px 10px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                background: filter === key ? 'var(--color-bark)' : 'var(--color-surface-2)',
                color: filter === key ? 'var(--color-cream)' : 'var(--color-bark-muted)',
                transition: 'background-color 200ms ease-out, color 200ms ease-out, transform 100ms ease-out'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
