'use client'

import dynamic from 'next/dynamic'
import { useState, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import type { ArShare } from '@/lib/ar-share'
import { HARDWARE_COLOUR } from '@/lib/collar3d'
import { ArPreviewButton } from '@/components/products/ArPreviewButton'

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), { ssr: false })

const subscribeNever = () => () => {}
const getArSupported = () => document.createElement('a').relList?.supports?.('ar') ?? false
const getArSupportedOnServer = () => false

/** Landing page for the AR QR code: shows the shared collar build and, on iOS, the button that opens AR Quick Look. */
export function ArViewer({ build }: { build: ArShare }) {
  const t = useTranslations('products.arViewer')
  const arSupported = useSyncExternalStore(subscribeNever, getArSupported, getArSupportedOnServer)
  const [arUrl, setArUrl] = useState<string | null>(null)

  return (
    <main className="flex min-h-dvh flex-col bg-cream">
      <div className="relative min-h-[320px] flex-1">
        <div className="absolute inset-0">
        <Collar3DScene
          items={build.items}
          strapColour={build.strapColour}
          hardwareColour={HARDWARE_COLOUR}
          autoRotate
          onArModelReady={arSupported ? setArUrl : undefined}
        />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 px-6 pb-28 pt-4 text-center">
        {arSupported ? (
          arUrl
            ? <ArPreviewButton href={arUrl} className="relative flex items-center gap-2 rounded-full bg-bark px-8 py-4 text-base font-medium text-cream shadow-md" />
            : <p className="m-0 text-sm text-bark-muted">{t('preparing')}</p>
        ) : (
          <p className="m-0 max-w-xs text-sm text-bark-muted">{t('iosOnly')}</p>
        )}
      </div>
    </main>
  )
}
