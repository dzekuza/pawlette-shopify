'use client'

import { CollarConfigurator } from '@/components/products/CollarConfigurator'
import { useProductPage } from '@/components/products/ProductPageContext'

/** The collar/leash buy card for the product page: charms only for collars, trust + reviews below the CTA. */
export function CollarBuyPanel() {
  const { state: { configurator }, meta: { product, showCollarCharmPicker } } = useProductPage()
  const { collar } = configurator
  return (
    <CollarConfigurator.Root
      configurator={configurator}
      name={collar?.parentTitle ?? product.name}
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
