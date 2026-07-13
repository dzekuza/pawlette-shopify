'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Box } from 'lucide-react'
import type { ShopifyCharm, ShopifyCollar } from '@/lib/shopify'
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR } from '@/lib/collar3d'
import { collar3DLetters } from '@/lib/collar3dSelection'

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
}

export function Collar3DGalleryTile({ collar, selectedCharms, onEdit }: Collar3DGalleryTileProps) {
  const { name, charmColours } = useMemo(() => collar3DLetters(selectedCharms), [selectedCharms])

  return (
    <div
      style={{
        gridColumn: 'span 2',
        gridRow: 'span 2',
        aspectRatio: '1 / 1',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--color-surface-2)',
      }}
    >
      <Collar3DScene
        name={name}
        strapColour={collar?.color ?? DEFAULT_STRAP_COLOUR}
        hardwareColour={HARDWARE_COLOUR}
        charmColours={charmColours}
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

      <p
        style={{ position: 'absolute', bottom: 14, left: 14, margin: 0, fontSize: 11, color: 'var(--color-bark-muted)', pointerEvents: 'none' }}
      >
        Vilkite, kad pasuktumėte
      </p>

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
