'use client'

import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CharmMobileHero } from '@/components/products/CharmGalleries'
import { CharmProductProvider, useCharmProduct } from '@/components/products/CharmProductContext'
import { CollarMobileHero } from '@/components/products/CollarGalleries'
import { ExtraCharmsModal } from '@/components/products/configurator/ExtraCharmsModal'
import { ProductPageShell } from '@/components/products/ProductPageShell'
import { useProductPage } from '@/components/products/ProductPageContext'

/** Desktop hero frame: breadcrumb above a two-column grid (gallery | detail panel) supplied by the layout variant. */
function DesktopHero({ children }: { children: ReactNode }) {
  const t = useTranslations('products.pdp')
  const { meta: { product } } = useProductPage()
  return (
    <div
      className="w-full mx-auto px-6"
      style={{ maxWidth: 1200, paddingBottom: 48 }}
    >
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="font-sans" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 12, paddingBottom: 12, fontSize: 13, color: 'var(--color-bark-muted)' }}>
        <Link href="/products" style={{ color: 'var(--color-bark-muted)', textDecoration: 'none' }}>{t('breadcrumbShop')}</Link>
        <span style={{ opacity: 0.4 }}>/</span>
        <span style={{ color: 'var(--color-bark)' }}>{product.name}</span>
      </nav>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 440px',
          gap: 32,
          minHeight: '80vh',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** Charm pages show the picked charm's name in the value showcase, so the shell reads it from the charm context. */
function CharmProductShell({ children }: { children: ReactNode }) {
  const { state: { configurator } } = useProductPage()
  const { state: { displayName } } = useCharmProduct()
  return (
    <ProductPageShell name={displayName}>
      {children}
      {/* CharmBuilderPanel → CharmDecoratorPanel exposes a "Reikia daugiau pakabukų?" button wired to
          the shared configurator — for the collar/leash flow this modal is mounted by <CollarConfigurator.Root />. */}
      <ExtraCharmsModal configurator={configurator} />
    </ProductPageShell>
  )
}

interface ProductPageBodyProps {
  /** Desktop gallery + panel columns for collar and leash products. */
  desktopCollar: ReactNode
  /** Desktop gallery + panel columns for charm products. */
  desktopCharm: ReactNode
}

/**
 * Picks the collar/leash or charm flow and the mobile or desktop hero. Layout variants
 * (SingleProductPageStandard / SingleProductPageSplit) differ only in the desktop columns they pass in.
 */
export function ProductPageBody({ desktopCollar, desktopCharm }: ProductPageBodyProps) {
  const { meta: { isMobile, isCollarOrLeash } } = useProductPage()

  if (isCollarOrLeash) {
    return (
      <ProductPageShell>
        {isMobile ? <CollarMobileHero /> : <DesktopHero>{desktopCollar}</DesktopHero>}
      </ProductPageShell>
    )
  }

  return (
    <CharmProductProvider>
      <CharmProductShell>
        {isMobile ? <CharmMobileHero /> : <DesktopHero>{desktopCharm}</DesktopHero>}
      </CharmProductShell>
    </CharmProductProvider>
  )
}
