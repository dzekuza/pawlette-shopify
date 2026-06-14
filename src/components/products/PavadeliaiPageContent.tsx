'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ProductDetail } from '@/lib/catalog'
import { ProductCard } from './ProductCard'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/storefront/PageHero'
import { useWindowWidth } from '@/hooks/useWindowWidth'

interface Props {
  leashes: ProductDetail[]
}

export function PavadeliaiPageContent ({ leashes }: Props) {
  const router = useRouter()
  const cartCount = useCartCount()
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768

  return (
    <>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px' }}>
        <PageHero
          tone='hero'
          eyebrow='Pavadeliai'
          title='Vandeniui atsparūs pavadėliai jiems.'
          description='Silikoniniai pavadėliai kasdieniam naudojimui — lengvai valomi po lietaus, paplūdimio ar purvinų pasivaikščiojimų.'
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leashes.map((leash) => (
            <ProductCard key={leash.id} product={leash} />
          ))}
        </div>
      </main>

      <LandingFooter />
    </>
  )
}
