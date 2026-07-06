'use client'

import Image from 'next/image'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const BADGES = [
  { label: 'Personalizuojamas dizainas',      top: 116.54, left: 72 },
  { label: 'Keičiami pakabukai per 5 sek.',   top: 211.54, left: 100 },
  { label: 'Nesugeria kvapų ir dėmių',        top: 270.54, left: 187 },
  { label: 'Vandeniui atsparus silikonas',    top: 318.54, left: 40 },
]

const CARD_SIZE = 454

function BadgeCard ({ badgeBg }: { badgeBg: string }) {
  return (
    <>
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          style={{
            position: 'absolute',
            top: `${(badge.top / CARD_SIZE) * 100}%`,
            left: `${(badge.left / CARD_SIZE) * 100}%`,
            background: badgeBg,
            borderRadius: 40,
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-bark)', whiteSpace: 'nowrap' }}>
            {badge.label}
          </span>
        </div>
      ))}
    </>
  )
}

export function ComparisonTable () {
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 768

  return (
    <section className="bg-white" style={{ padding: isMobile ? '56px 20px' : '120px 64px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 40 : 64,
        }}
      >
        {/* Left — two comparison panels */}
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            minWidth: 0,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 32,
          }}
        >
          {/* PawCharms panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: '1 0 0', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Image src="/pawcharms.svg" alt="PawCharms" width={107} height={57} style={{ height: 40, width: 'auto' }} />
              <div className="bg-sage" style={{ borderRadius: 50, padding: '16px 24px' }}>
                <p className="font-display" style={{ fontSize: 20, color: 'var(--color-bark)', letterSpacing: '0.07em', whiteSpace: 'nowrap', margin: 0 }}>
                  Pawcharms
                </p>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                aspectRatio: '1 / 1',
                width: '100%',
                backgroundImage: 'linear-gradient(153deg, rgb(168, 213, 162) 0%, rgb(248, 248, 248) 107.09%)',
              }}
            >
              <BadgeCard badgeBg="#fff" />
            </div>
          </div>

          {/* Competitors panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: '1 0 0', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#e1e1e1', borderRadius: 50, padding: '12px 16px' }}>
                <p className="font-display" style={{ fontSize: 24, color: 'var(--color-bark)', letterSpacing: '0.06em', whiteSpace: 'nowrap', margin: 0 }}>
                  Kiti
                </p>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                aspectRatio: '1 / 1',
                width: '100%',
                background: '#e1e1e1',
              }}
            >
              <BadgeCard badgeBg="#f5f5f5" />
            </div>
          </div>
        </div>

        {/* Right — heading + copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', width: isMobile ? '100%' : 468, flexShrink: 0 }}>
          <p className="font-display" style={{ fontSize: 48, lineHeight: 1.2, letterSpacing: '0.03em', color: 'var(--color-bark)', margin: 0 }}>
            Palyginkime
          </p>
          <p className="font-sans" style={{ fontSize: 20, lineHeight: 1.5, fontWeight: 500, color: 'var(--color-bark-light)', margin: 0 }}>
            Vandeniui atsparus silikonas, patogi rankena ir spalvos, tinkančios kiekvienam šuniui.
          </p>
        </div>
      </div>
    </section>
  )
}
