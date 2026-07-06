'use client'

import Image from 'next/image'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { DisplayHeading } from '@/components/storefront/Typography'

const FEATURES: { label: string; us: true | string; them: false | string }[] = [
  { label: 'Vandeniui atsparus silikonas',        us: true,           them: false },
  { label: 'Keičiami pakabukai per 5 sek.',       us: true,           them: false },
  { label: 'Personalizuojamas dizainas',           us: true,           them: false },
  { label: 'Nesugeria kvapų ir dėmių',             us: true,           them: false },
  { label: 'Pagaminta Lietuvoje',                  us: true,           them: false },
  { label: 'Kaina už pilną rinkinį',               us: 'nuo €25',      them: 'nuo €40+' },
]

const CHECK = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Taip">
    <path d="M3.5 9.5l4 4 7-8" stroke="var(--color-sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DASH = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Ne">
    <path d="M5 9h8" stroke="rgba(61,53,48,0.22)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

function Cell({ value }: { value: true | false | string }) {
  if (value === true)  return <CHECK />
  if (value === false) return <DASH />
  return <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-bark)', opacity: 0.7 }}>{value}</span>
}

const DIVIDER = 'var(--color-bark-divider)'
const COL_W = 140

export function ComparisonTable() {
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 640

  return (
    <section style={{ background: 'var(--color-surface-2)', padding: isMobile ? '56px 0' : '80px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'left', marginBottom: 40, padding: isMobile ? '0 20px' : 0 }}>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: 'var(--color-sage)', fontWeight: 600, margin: '0 0 8px' }}>
            Kodėl PawCharms?
          </p>
          <DisplayHeading size="section" className="text-bark" style={{ margin: 0 }}>
            Ne visi antkakliai vienodi
          </DisplayHeading>
        </div>

        {/* Table */}
        <div style={{
          margin: isMobile ? '0 20px' : 0,
          borderRadius: isMobile ? 12 : 20,
          overflow: 'hidden',
          border: `1px solid ${DIVIDER}`,
          background: '#FFFDF9',
        }}>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: `minmax(0, 1fr) ${COL_W}px ${COL_W}px`, borderBottom: `1px solid ${DIVIDER}` }}>
            {/* Feature label col header */}
            <div style={{ padding: isMobile ? '28px 12px 24px' : '28px 24px 24px', borderRight: `1px solid ${DIVIDER}` }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(61,53,48,0.4)' }}>
                Savybė
              </span>
            </div>

            {/* PawCharms col header */}
            <div style={{ padding: '28px 16px 24px', borderRight: `1px solid ${DIVIDER}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <Image src="/pawcharms.svg" alt="PawCharms" width={100} height={32} style={{ height: 32, width: 'auto', display: 'block' }} />
              <span style={{ fontSize: 12, color: 'rgba(61,53,48,0.5)', lineHeight: 1.5 }}>Silikonas · Lietuva</span>
            </div>

            {/* Others col header */}
            <div style={{ padding: '28px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(61,53,48,0.35)', lineHeight: 1.2 }}>Kiti antkakliai</span>
              <span style={{ fontSize: 12, color: 'rgba(61,53,48,0.35)', lineHeight: 1.5 }}>Įprasti variantai</span>
            </div>
          </div>

          {/* Feature rows */}
          {FEATURES.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: `minmax(0, 1fr) ${COL_W}px ${COL_W}px`,
                borderTop: i > 0 ? `1px solid ${DIVIDER}` : undefined,
              }}
            >
              <div style={{ padding: isMobile ? '18px 12px' : '18px 24px', borderRight: `1px solid ${DIVIDER}`, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                <span style={{ fontSize: 14, color: 'var(--color-bark)', lineHeight: 1.4, overflowWrap: 'break-word', wordBreak: 'break-word' }}>{row.label}</span>
              </div>
              <div style={{ borderRight: `1px solid ${DIVIDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 0' }}>
                <Cell value={row.us} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 0' }}>
                <Cell value={row.them} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
