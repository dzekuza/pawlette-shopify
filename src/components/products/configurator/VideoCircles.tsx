'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { BORDER_COLOR, TEXT_MUTED } from '@/components/products/pdpConstants'

// Small circular video previews shown above the color swatches — tapping one
// opens it larger in a bottom-sheet player, mirroring the Personalise dialog.
export function VideoCircles ({ videos }: { videos: string[] }) {
  const t = useTranslations('products.configurator')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div>
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
        {videos.map((video, i) => (
          <button
            key={video + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={t('watchVideo', { n: i + 1 })}
            style={{
              flexShrink: 0, width: 82, height: 82, borderRadius: '50%', overflow: 'hidden',
              border: `2px solid ${BORDER_COLOR}`, padding: 0, cursor: 'pointer', background: 'var(--color-surface-2)',
            }}
          >
            <video
              src={video}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          onClick={() => setActiveIndex(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'var(--color-bark-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream" style={{ borderRadius: 24, width: '100%', maxWidth: 420, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveIndex(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: TEXT_MUTED, lineHeight: 1 }}>×</button>
            </div>
            <video
              key={videos[activeIndex]}
              src={videos[activeIndex]}
              style={{ width: '100%', borderRadius: 16, maxHeight: '70vh' }}
              autoPlay
              loop
              controls
              playsInline
            />
          </div>
        </div>
      )}
    </div>
  )
}
