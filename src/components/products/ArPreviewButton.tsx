'use client'

import { Box } from 'lucide-react'
import { useTranslations } from 'next-intl'

// iOS only opens AR Quick Look for an <a rel="ar"> whose only child element is an <img>.
const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

/** Opens the given USDZ model in iOS AR Quick Look. Renders nothing until a model is ready. */
export function ArPreviewButton({ href, className }: { href: string | null; className?: string }) {
  const t = useTranslations('products.pdp.gallery3d')
  if (!href) return null
  return (
    <a
      rel="ar"
      href={`${href}#allowsContentScaling=0`}
      download="pawscharm-collar.usdz"
      onClick={(e) => e.stopPropagation()}
      className={className}
    >
      <Box className="size-4" aria-hidden="true" />
      <span>{t('viewInAr')}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BLANK_IMAGE} alt="" className="absolute inset-0 size-full opacity-0" />
    </a>
  )
}
