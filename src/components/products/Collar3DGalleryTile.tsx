'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Box } from 'lucide-react'
import type { ShopifyCharm, ShopifyCollar } from '@/lib/shopify'
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR } from '@/lib/collar3d'
import { collar3DCharms, hasUnrenderableIconCharms } from '@/lib/collar3dSelection'

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>Kraunama 3D peržiūra…</span>
    </div>
  ),
})

type Collar3DGalleryTileProps = {
  collar: ShopifyCollar | null
  selectedCharms?: (ShopifyCharm | null)[]
  onEdit: () => void
  /** 'grid' (default) sizes itself for the desktop 2x2 image grid. 'slide' fills a mobile gallery slide instead. */
  variant?: 'grid' | 'slide'
}

export function Collar3DGalleryTile({ collar, selectedCharms, onEdit, variant = 'grid' }: Collar3DGalleryTileProps) {
  const items = useMemo(() => collar3DCharms(selectedCharms), [selectedCharms])
  const showUnrenderableDisclaimer = useMemo(() => hasUnrenderableIconCharms(selectedCharms), [selectedCharms])

  return (
    <div
      style={variant === 'grid'
        ? {
          gridColumn: 'span 2',
          gridRow: 'span 2',
          aspectRatio: '1 / 1',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
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
      <Collar3DScene
        items={items}
        strapColour={collar?.color ?? DEFAULT_STRAP_COLOUR}
        hardwareColour={HARDWARE_COLOUR}
      />

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

      <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 2, pointerEvents: 'none' }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--color-bark-muted)' }}>
          Vilkite, kad pasuktumėte
        </p>
        {showUnrenderableDisclaimer && (
          <p style={{ margin: 0, fontSize: 10.5, color: 'var(--color-bark-muted)', maxWidth: 200 }}>
            Pakabukai (ne raidės) liks krepšelyje, bet nerodomi 3D peržiūroje
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onEdit}
        style={{
          position: 'absolute', bottom: 12, right: 12, padding: '8px 14px', borderRadius: 999, border: 'none',
          cursor: 'pointer', background: 'var(--color-cream)', color: 'var(--color-bark)', fontSize: 12, fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
        }}
      >
        Redaguoti
      </button>
    </div>
  )
}
