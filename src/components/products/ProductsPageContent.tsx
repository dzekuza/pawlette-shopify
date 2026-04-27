'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ShopifyCharm } from '@/lib/shopify'
import type { LandingCollar } from '@/lib/db'
import { ProductCard } from './ProductCard'
import Link from 'next/link'
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
  const charmBg = '#B8D8F4'

  return (
    <div className="min-h-screen bg-cream text-bark pt-16">
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className="mx-auto px-5 pb-20 md:px-8" style={{ maxWidth: 1160, paddingTop: 40 }}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-10">
          {collars.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {charmProduct && (
            <Link href="/products/charm-charms" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <article
                data-animate="card"
                style={{ cursor: 'pointer', borderRadius: 20, transition: 'transform 200ms ease-out', display: 'flex', flexDirection: 'column', height: '100%' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ height: 'clamp(220px, 34vw, 280px)', position: 'relative', overflow: 'hidden', borderRadius: 20, background: charmBg }}>
                  {charmHeroImage && <img src={charmHeroImage} alt={charmProduct.productTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                  <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(6px)', borderRadius: 100, padding: '6px 10px' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: '#3D3530' }}>{charmProduct.productTitle}</span>
                  </div>
                </div>
                <div style={{ padding: '16px 4px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ marginBottom: 6, fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: '#3D3530' }}>{charmProduct.productTitle}</div>
                  {charmProduct.productDescription && (
                    <div
                      style={{
                        marginBottom: 14,
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: '#9B948F',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {charmProduct.productDescription}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginTop: 'auto' }}>
                    <div style={{ fontSize: 20, fontWeight: 500, color: '#3D3530' }}>{charmProduct.price}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#2a5a25', whiteSpace: 'nowrap' }}>View details →</span>
                  </div>
                </div>
              </article>
            </Link>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
