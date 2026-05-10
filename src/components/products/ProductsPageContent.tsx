'use client'

import { useState } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ShopifyCharm } from '@/lib/shopify'
import type { LandingCollar } from '@/lib/db'
import { ProductCard } from './ProductCard'
import { CharmCollectionCard } from './CharmCollectionCard'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/storefront/PageHero'
import { useWindowWidth } from '@/hooks/useWindowWidth'

interface ProductsPageContentProps {
  collars: LandingCollar[]
  charms: ShopifyCharm[]
}

const FILTERS = [
  { key: 'visi' as const, label: 'Visi produktai' },
  { key: 'antkakliai' as const, label: 'Antkakliai' },
  { key: 'pakabukai' as const, label: 'Pakabukai' },
]

type FilterKey = 'visi' | 'antkakliai' | 'pakabukai'

export function ProductsPageContent ({ collars, charms }: ProductsPageContentProps) {
  const router = useRouter()
  const cartCount = useCartCount()
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const [activeFilter, setActiveFilter] = useState<FilterKey>('visi')
  const charmProduct = charms[0]
  const charmHeroImage = charmProduct?.productFeaturedImage || charmProduct?.productImages?.[0] || charmProduct?.image || ''

  const showCollars = activeFilter !== 'pakabukai'
  const showCharms = activeFilter !== 'antkakliai'
  const totalCount = (showCollars ? collars.length : 0) + (showCharms && charmProduct ? 1 : 0)

  return (
    <div className="min-h-screen bg-cream text-bark pt-16">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px' }}>
        <PageHero
          tone='hero'
          eyebrow='Parduotuvė'
          title='Antkakliai, pakabukai ir deriniai jiems.'
          description='Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir raskite paruoštą derinį vienoje vietoje.'
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '7px 18px',
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 150ms ease, color 150ms ease',
                  background: activeFilter === key ? 'var(--color-bark)' : 'rgba(61,53,48,0.07)',
                  color: activeFilter === key ? 'var(--color-cream)' : 'var(--color-bark)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(61,53,48,0.4)', letterSpacing: '0.01em' }}>
            {totalCount} {totalCount === 1 ? 'produktas' : 'produktai'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showCollars && collars.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {showCharms && charmProduct && (
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
