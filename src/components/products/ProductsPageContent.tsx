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
import { SurfaceCard, SurfaceCardBody } from '@/components/storefront/SurfaceCard'
import { BodyCopy, Eyebrow } from '@/components/storefront/Typography'

interface ProductsPageContentProps {
  collars: LandingCollar[]
  charms: ShopifyCharm[]
}

export function ProductsPageContent ({ collars, charms }: ProductsPageContentProps) {
  const router = useRouter()
  const cartCount = useCartCount()
  const charmProduct = charms[0]
  const charmHeroImage = charmProduct?.productFeaturedImage || charmProduct?.productImages?.[0] || charmProduct?.image || ''
  const featuredCount = collars.length + (charmProduct ? 1 : 0)

  return (
    <div className="min-h-screen bg-cream text-bark pt-16">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className="mx-auto px-5 pb-[100px] md:px-10" style={{ maxWidth: 1160, paddingTop: 60 }}>
        <PageHero
          tone='hero'
          eyebrow='Parduotuvė'
          title='Visi antkakliai, pakabukai ir deriniai vienoje vietoje.'
          description='Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir palyginkite paruoštus rinkinius prieš keliaudami į produkto puslapį.'
          aside={
            <div className="grid grid-cols-2 gap-3 self-start md:min-w-[260px]">
              {[
                { label: 'Asortimentas', value: String(featuredCount), note: 'aktyvūs pasiūlymai' },
                { label: 'Pagaminta', value: 'LT', note: 'rankomis Vilniuje' },
              ].map((item) => (
                <SurfaceCard key={item.label} variant='white' padding='compact' className='rounded-[22px] bg-white/80 backdrop-blur-sm'>
                  <SurfaceCardBody>
                    <Eyebrow className='tracking-[0.12em]'>{item.label}</Eyebrow>
                    <div className="mt-2 text-[28px] font-semibold leading-none text-bark">{item.value}</div>
                    <BodyCopy className="mt-1 text-[13px] leading-5">{item.note}</BodyCopy>
                  </SurfaceCardBody>
                </SurfaceCard>
              ))}
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-10">
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
