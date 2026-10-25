'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Smartphone, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { CharmSpec } from '@/lib/collar3d'
import { encodeArShare } from '@/lib/ar-share'
import { localizeHref } from '@/lib/locale-path'

const QR_SIZE = 192

/** Desktop fallback for AR: a button that reveals a QR code opening this exact build in AR on the shopper's phone. */
export function ArQrPopover({ strapColour, items, className }: { strapColour: string; items: CharmSpec[]; className?: string }) {
  const t = useTranslations('products.pdp.gallery3d')
  const locale = useLocale() as 'lt' | 'en'
  const [open, setOpen] = useState(false)
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    const url = `${window.location.origin}${localizeHref('/ar', locale)}?${encodeArShare({ strapColour, items })}`
    import('qrcode')
      .then(({ default: QRCode }) => QRCode.toDataURL(url, { width: QR_SIZE * 2, margin: 1, color: { dark: '#3D3530', light: '#FFFFFF' } }))
      .then((dataUrl) => { if (!cancelled) setQr(dataUrl) })
      .catch(() => { if (!cancelled) setQr(null) })
    return () => { cancelled = true }
  }, [open, strapColour, items, locale])

  return (
    <div className="absolute right-3.5 top-3.5 z-10" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={className}>
        <Smartphone className="size-4" aria-hidden="true" />
        <span>{t('viewInAr')}</span>
      </button>
      {open && (
        <div role="dialog" aria-label={t('qrTitle')} className="absolute right-0 mt-2 flex w-64 flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-xl">
          <button type="button" onClick={() => setOpen(false)} aria-label={t('qrClose')} className="absolute right-3 top-3 text-bark-muted">
            <X className="size-4" aria-hidden="true" />
          </button>
          <p className="m-0 pr-4 text-sm font-semibold text-bark">{t('qrTitle')}</p>
          {qr
            ? <Image src={qr} alt={t('qrAlt')} width={QR_SIZE} height={QR_SIZE} unoptimized className="rounded-lg" />
            : <div className="size-48 animate-pulse rounded-lg bg-surface-2" />}
          <p className="m-0 text-xs text-bark-muted">{t('qrHint')}</p>
        </div>
      )}
    </div>
  )
}
