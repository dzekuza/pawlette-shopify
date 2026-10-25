'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import type { ShopifyCharm, ShopifyCollar } from '@/lib/shopify'
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR } from '@/lib/collar3d'
import { collar3DCharms, hasUnrenderableIconCharms } from '@/lib/collar3dSelection'
import { ArPreviewButton } from '@/components/products/ArPreviewButton'
import { ArQrPopover } from '@/components/products/ArQrPopover'

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => <Collar3DSceneLoading />,
})

function Collar3DSceneLoading () {
  const t = useTranslations('products.pdp')
  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>{t('gallery3d.loading')}</span>
    </div>
  )
}

const subscribeNever = () => () => {}
const getArSupported = () => document.createElement('a').relList?.supports?.('ar') ?? false
const getArSupportedOnServer = () => false

const AR_BUTTON_CLASS = 'absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-bark px-4 py-2 text-sm font-medium text-cream shadow-md'

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
  const t = useTranslations('products.pdp')
  const items = useMemo(() => collar3DCharms(selectedCharms), [selectedCharms])
  // AR Quick Look exists only on iOS; everywhere else the button (and the USDZ export) is skipped.
  const arSupported = useSyncExternalStore(subscribeNever, getArSupported, getArSupportedOnServer)
  const [arUrl, setArUrl] = useState<string | null>(null)
  const strapColour = collar?.color ?? DEFAULT_STRAP_COLOUR
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
        strapColour={strapColour}
        hardwareColour={HARDWARE_COLOUR}
        onArModelReady={arSupported ? setArUrl : undefined}
      />

      {arSupported ? (
        <ArPreviewButton
          href={arUrl}
          className={AR_BUTTON_CLASS}
        />
      ) : (
        <ArQrPopover strapColour={strapColour} items={items} className={AR_BUTTON_CLASS.replace('absolute right-3.5 top-3.5 z-10 ', '')} />
      )}

      {showUnrenderableDisclaimer && (
        <div style={{ position: 'absolute', bottom: 14, left: 14, pointerEvents: 'none' }}>
          <p style={{ margin: 0, fontSize: 10.5, color: 'var(--color-bark-muted)', maxWidth: 200 }}>
            {t('gallery3d.disclaimer')}
          </p>
        </div>
      )}
    </div>
  )
}
