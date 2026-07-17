'use client'

import dynamic from 'next/dynamic'
import { Box } from 'lucide-react'
import type { CharmSpec } from '@/lib/collar3d'

const Charm3DScene = dynamic(() => import('@/components/products/Charm3DScene'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>Kraunama 3D peržiūra…</span>
    </div>
  ),
})

type Charm3DGalleryTileProps = {
  /** Every currently selected renderable charm, in pick order — all shown together, side by side. */
  items: CharmSpec[]
  /** Fills the desktop hero tile by default; 'slide' fills a mobile gallery slide instead. */
  variant?: 'grid' | 'slide'
}

/** Inline, always-live 3D preview of the selection — no click/modal step, unlike Collar3DGalleryTile. */
export function Charm3DGalleryTile({ items, variant = 'grid' }: Charm3DGalleryTileProps) {
  return (
    <div
      style={variant === 'grid'
        ? {
          gridColumn: 'span 2',
          borderRadius: '20px 20px 8px 8px',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '1 / 1',
          background: 'var(--color-surface-2)',
        }
        : {
          flexShrink: 0,
          width: '100%',
          height: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--color-surface-2)',
        }}
    >
      <Charm3DScene items={items} />

      <div
        style={{
          position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px 5px 8px', borderRadius: 999, background: 'var(--color-bark)', color: 'var(--color-cream)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', pointerEvents: 'none',
        }}
      >
        <Box size={13} strokeWidth={2.2} />
        3D
      </div>

      <p
        style={{
          position: 'absolute', bottom: 14, left: 14, margin: 0, fontSize: 11,
          color: 'var(--color-bark-muted)', pointerEvents: 'none',
        }}
      >
        Vilkite, kad pasuktumėte
      </p>
    </div>
  )
}
