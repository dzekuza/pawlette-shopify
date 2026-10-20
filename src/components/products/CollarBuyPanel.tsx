'use client'

import { useLocale } from 'next-intl'
import { CollarConfigurator } from '@/components/products/CollarConfigurator'
import { useProductPage } from '@/components/products/ProductPageContext'

/** The collar/leash buy card for the product page: charms only for collars, trust + reviews below the CTA. */
export function CollarBuyPanel() {
  const { state: { configurator }, meta: { product, showCollarCharmPicker } } = useProductPage()
  const { collar } = configurator
  const locale = useLocale()
  // The Shopify title is just "PawsCharm antkaklis"; the main collar page's H1 should carry the
  // keyword searchers use. English already has its own H1 via the locale overlay.
  const isMainCollarPage = product.slug === 'pawcharms-antkaklis'
  const displayName = locale === 'lt' && isMainCollarPage ? 'Šuns antkaklis su vardu' : (collar?.parentTitle ?? product.name)
  return (
    <CollarConfigurator.Root
      configurator={configurator}
      name={displayName}
      price={collar?.price ?? product.price}
    >
      <CollarConfigurator.Header />
      <CollarConfigurator.Videos videos={product.videos ?? []} />
      <CollarConfigurator.Colors />
      <CollarConfigurator.Sizes />
      {showCollarCharmPicker && <CollarConfigurator.Charms />}
      <CollarConfigurator.AddToCart />
      <CollarConfigurator.Trust />
    </CollarConfigurator.Root>
  )
}
