'use client'

import { useEffect, useState } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { getCharms, getCharmsSync, type ShopifyCharm } from '@/lib/shopify'
import { getLandingCollars, getLandingCollarsSync, type LandingCollar } from '@/lib/db'
import { ProductCard } from './ProductCard'
import Link from 'next/link'

export function ProductsPageContent () {
  const [collars, setCollars] = useState<LandingCollar[]>(() => getLandingCollarsSync() ?? [])
  const [charms, setCharms] = useState<ShopifyCharm[]>(() => getCharmsSync() ?? [])

  useEffect(() => {
    getLandingCollars().then(setCollars)
    getCharms().then(setCharms)
  }, [])

  const charmProduct = charms[0]
  const charmHeroImage = charmProduct?.productImages?.[0] ?? charmProduct?.image ?? ''
  const charmBg = '#B8D8F4'

  return (
    <div className="min-h-screen bg-cream text-bark pt-16">
      <LandingNav topOffset={0} />

      <main className="mx-auto px-5 pb-20" style={{ maxWidth: 1160, paddingTop: 40 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
          {collars.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {charmProduct && (
            <Link href="/products/charm-charms" style={{ textDecoration: 'none' }}>
              <article
                data-animate="card"
                style={{ cursor: 'pointer', borderRadius: 20, transition: 'transform 200ms ease-out' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ height: 280, position: 'relative', overflow: 'hidden', borderRadius: 20, background: charmBg }}>
                  {charmHeroImage && <img src={charmHeroImage} alt={charmProduct.productTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                  <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(6px)', borderRadius: 100, padding: '6px 10px' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: '#3D3530' }}>{charmProduct.productTitle}</span>
                  </div>
                </div>
                <div style={{ padding: '16px 4px 8px' }}>
                  <div style={{ marginBottom: 4, fontSize: 16, fontWeight: 500, color: '#3D3530' }}>{charmProduct.productTitle}</div>
                  {charmProduct.productDescription && (
                    <div style={{ marginBottom: 14, fontSize: 13, lineHeight: 1.5, color: '#9B948F' }}>{charmProduct.productDescription}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 500, color: '#3D3530' }}>{charmProduct.price}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#2a5a25' }}>View details →</span>
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
