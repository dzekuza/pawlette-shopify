'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ShopifyCharm } from '@/lib/shopify'
import type { LandingCollar } from '@/lib/db'
import { ProductCard } from './ProductCard'
import { CharmCollectionCard } from './CharmCollectionCard'
import { useRouter } from 'next/navigation'

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
        <section
          className="mb-10 overflow-hidden rounded-[32px] border border-bark/8 px-6 py-7 md:px-9 md:py-9"
          style={{
            background: 'linear-gradient(135deg, rgba(255,196,168,0.22) 0%, rgba(255,245,238,0.92) 28%, rgba(184,216,244,0.2) 68%, rgba(168,213,162,0.22) 100%)',
            boxShadow: '0 20px 48px rgba(61,53,48,0.06)',
          }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[56ch]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-bark-muted">
                Parduotuvė
              </p>
              <h1
                className="m-0 max-w-[11ch] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-bark"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Visi antkakliai, pakabukai ir deriniai vienoje vietoje.
              </h1>
              <p className="mb-0 mt-4 max-w-[52ch] text-[15px] leading-7 text-bark-light md:text-[17px]">
                Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir palyginkite paruoštus rinkinius prieš keliaudami į produkto puslapį.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start md:min-w-[260px]">
              <div className="rounded-[22px] bg-white/80 px-4 py-4 backdrop-blur-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bark-muted">Asortimentas</div>
                <div className="mt-2 text-[28px] font-semibold leading-none text-bark">{featuredCount}</div>
                <div className="mt-1 text-[13px] leading-5 text-bark-light">aktyvūs pasiūlymai</div>
              </div>
              <div className="rounded-[22px] bg-white/80 px-4 py-4 backdrop-blur-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bark-muted">Pagaminta</div>
                <div className="mt-2 text-[28px] font-semibold leading-none text-bark">LT</div>
                <div className="mt-1 text-[13px] leading-5 text-bark-light">rankomis Vilniuje</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-10">
          {collars.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {charmProduct && (
            <CharmCollectionCard
              href="/products/charm-charms"
              title={charmProduct.productTitle}
              description={charmProduct.productDescription}
              price={charmProduct.price}
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
