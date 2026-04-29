'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ShopifyCharm } from '@/lib/shopify'
import type { LandingCollar } from '@/lib/db'
import { ProductCard } from './ProductCard'
import { CharmCollectionCard } from './CharmCollectionCard'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/storefront/PageHero'

interface ProductsPageContentProps {
  collars: LandingCollar[]
  charms: ShopifyCharm[]
}

export function ProductsPageContent ({ collars, charms }: ProductsPageContentProps) {
  const router = useRouter()
  const cartCount = useCartCount()
  const charmProduct = charms[0]
  const charmHeroImage = charmProduct?.productFeaturedImage || charmProduct?.productImages?.[0] || charmProduct?.image || ''

  return (
    <div className="min-h-screen bg-cream text-bark pt-16">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px 100px' }}>
        <PageHero
          tone='hero'
          eyebrow='Parduotuvė'
          title='Antkakliai, pakabukai ir deriniai jiems.'
          description='Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir raskite paruoštą derinį vienoje vietoje.'
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {collars.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {charmProduct && (
            <CharmCollectionCard
              href="/products/charm-charms"
              title={charmProduct.productTitle}
              price={charmProduct.price}
              originalPrice={charmProduct.originalPrice}
              image={charmHeroImage}
              imageAlt={charmProduct.productTitle}
            />
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
