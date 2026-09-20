'use client'

import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { useCollarConfigurator, type CollarConfiguratorState } from '@/lib/useCollarConfigurator'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import type { ProductDetail } from '@/lib/catalog'
import { trackMetaEvent } from '@/components/shared/MetaPixel'
import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import { COLLAR_GALLERY } from '@/components/products/collarGallery'

interface ProductPageState {
  /** Shared with the homepage buy card — owns collar selection, charms and cart state. */
  configurator: CollarConfiguratorState
  /** Collar/leash photo set (selected variant first), padded to 8 tiles. Empty when there is none. */
  gallery: string[]
  lightboxIndex: number | null
}

interface ProductPageActions {
  openLightbox: (index: number) => void
  closeLightbox: () => void
  setLightboxIndex: (index: number | null) => void
}

interface ProductPageMeta {
  product: ProductDetail
  /** Below the md breakpoint. Decided once here so layouts never need it drilled as a prop. */
  isMobile: boolean
  isCollar: boolean
  isLeash: boolean
  isCollarOrLeash: boolean
  hasCharmVariants: boolean
  showCollar3DViewer: boolean
  showCollarCharmPicker: boolean
}

interface ProductPageContextValue {
  state: ProductPageState
  actions: ProductPageActions
  meta: ProductPageMeta
}

const ProductPageContext = createContext<ProductPageContextValue | null>(null)

/** Reads the product page state, actions and meta. Must be used inside `<ProductPageProvider>`. */
export function useProductPage(): ProductPageContextValue {
  const ctx = use(ProductPageContext)
  if (!ctx) throw new Error('useProductPage must be used within <ProductPageProvider>')
  return ctx
}

/** The only place that knows how the product page's configurator, gallery, lightbox and view tracking are managed. */
export function ProductPageProvider({ product, children }: { product: ProductDetail; children: ReactNode }) {
  const isMobile = (useWindowWidth() ?? 1200) < 768

  const isCollar = product.productType === 'collar'
  const isLeash = product.productType === 'leash'
  const isCollarOrLeash = isCollar || isLeash
  const hasCharmVariants = !!product.charmVariants?.length
  const isCharmProduct = product.tags?.includes('Charm') || product.tags?.includes('Pakabukas') || product.productType === 'charm'

  // ── Collar configurator — single source of truth shared with LandingBuySection.tsx ──
  const configurator = useCollarConfigurator({
    isLeash,
    matchId: product.id.replace(/^collar-/, ''),
    matchSlug: product.slug,
    accentColor: product.accentColor,
  })
  const { collar, selectedVariantImage } = configurator

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    trackMetaEvent('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      value: parseFloat(product.price),
      currency: 'EUR',
    })
    trackGaEvent('view_item', {
      currency: 'EUR',
      value: parseFloat(product.price),
      items: [{ item_id: product.id, item_name: product.name, price: parseFloat(product.price) }],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  const collarHandle = product.id.replace(/^collar-/, '')
  const galleryKey = collarHandle.replace(/-collar$/, '')
  const localGallery = COLLAR_GALLERY[galleryKey] ?? COLLAR_GALLERY[collarHandle] ?? COLLAR_GALLERY[collar?.handle ?? ''] ?? []
  const rawGallery = [
    selectedVariantImage,
    ...((collar?.images && collar.images.length > 0) ? collar.images : localGallery),
  ].filter((image, index, list): image is string => Boolean(image) && list.indexOf(image) === index)
  const gallery = rawGallery.length > 0
    ? Array.from({ length: 8 }, (_, i) => rawGallery[i % rawGallery.length])
    : []

  return (
    <ProductPageContext
      value={{
        state: { configurator, gallery, lightboxIndex },
        actions: { openLightbox: setLightboxIndex, closeLightbox: () => setLightboxIndex(null), setLightboxIndex },
        meta: {
          product,
          isMobile,
          isCollar,
          isLeash,
          isCollarOrLeash,
          hasCharmVariants,
          showCollar3DViewer: isCollar && !isCharmProduct,
          showCollarCharmPicker: isCollar,
        },
      }}
    >
      {children}
    </ProductPageContext>
  )
}
