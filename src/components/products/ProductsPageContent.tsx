'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ProductDetail } from '@/lib/catalog'
import { ProductCard } from './ProductCard'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/storefront/PageHero'
import { useWindowWidth } from '@/hooks/useWindowWidth'

interface ProductsPageContentProps {
  products: ProductDetail[]
}

export function ProductsPageContent ({ products }: ProductsPageContentProps) {
  const router = useRouter()
  const cartCount = useCartCount()
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768

  return (
    <>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className="max-w-[1200px] mx-auto" style={{ padding: isMobile ? '32px 16px' : '64px 48px' }}>
        <PageHero
          tone='hero'
          eyebrow='Parduotuvė'
          title='Antkakliai, pakabukai ir deriniai jiems.'
          description='Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir raskite paruoštą derinį vienoje vietoje.'
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <LandingFooter />
    </>
  )
}
