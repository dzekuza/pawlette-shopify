'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
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
  /** Omit to render a static (non-clickable) preview, e.g. when a configurator is already visible alongside it. */
  onEdit?: () => void
  /** 'grid' (default) sizes itself for the desktop 2x2 image grid. 'slide' fills a mobile gallery slide instead. */
  variant?: 'grid' | 'slide'
  background?: string
}

export function Collar3DGalleryTile({ collar, selectedCharms, onEdit, variant = 'grid', background }: Collar3DGalleryTileProps) {
  const items = useMemo(() => collar3DCharms(selectedCharms), [selectedCharms])
  const showUnrenderableDisclaimer = useMemo(() => hasUnrenderableIconCharms(selectedCharms), [selectedCharms])

  return (
    <div
      onClick={onEdit}
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      onKeyDown={onEdit ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit() } } : undefined}
      style={variant === 'grid'
        ? {
          gridColumn: 'span 2',
          gridRow: 'span 2',
          aspectRatio: '1 / 1',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          background: background || 'var(--color-surface-2)',
          cursor: onEdit ? 'pointer' : 'default',
        }
        : {
          flexShrink: 0,
          width: '100%',
          height: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          background: background || 'transparent',
          cursor: onEdit ? 'pointer' : 'default',
        }}
    >
      <Collar3DScene
        items={items}
        strapColour={collar?.color ?? DEFAULT_STRAP_COLOUR}
        hardwareColour={HARDWARE_COLOUR}
      />

      {showUnrenderableDisclaimer && (
        <div style={{ position: 'absolute', bottom: 14, left: 14, pointerEvents: 'none' }}>
          <p style={{ margin: 0, fontSize: 10.5, color: 'var(--color-bark-muted)', maxWidth: 200 }}>
            Pakabukai (ne raidės) liks krepšelyje, bet nerodomi 3D peržiūroje
          </p>
        </div>
      )}
    </div>
  )
}
