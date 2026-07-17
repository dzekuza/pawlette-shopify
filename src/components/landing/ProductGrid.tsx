'use client';

import type { ProductDetail } from '@/lib/db';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';

const COLOR_SWATCHES = [
  'var(--color-sky)',
  'var(--color-sage)',
  'var(--color-honey)',
  'var(--color-blossom)',
  'var(--color-lavender)',
];

export function ProductGrid({ products = [] }: { products?: ProductDetail[] }) {
  const filteredProducts = products;

  return (
    <section id="shop" style={{ background: 'var(--color-cream)' }}>
      <div
        className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 md:px-6 md:py-24"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Heading + description/CTA row */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-16">
          <DisplayHeading as="h2" size="section" className="flex-1 text-bark text-[32px] md:text-[48px]">
            Kas atsitiks po to, kai įsigysite PawCharms?
          </DisplayHeading>

          <div className="flex max-w-full shrink-0 flex-col gap-5 md:max-w-[400px]">
            <BodyCopy>
              Kurkite unikalų stilių savo šuniui. Pakabukus lengvai užmausite ir pakeisite vos per kelias sekundes.
            </BodyCopy>
          </div>
        </div>

        {/* Product cards grid / carousel */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="hide-scrollbar md:hidden" style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
              scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
            }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{
                  flex: '0 0 calc((100% - 12px) / 1.4)',
                  scrollSnapAlign: 'start',
                }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <div className="hidden grid-cols-3 gap-5 md:grid">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          /* Placeholder cards when no products loaded */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  background: 'var(--color-border)',
                  borderRadius: 16,
                  aspectRatio: '1 / 1',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'var(--color-blossom)',
                    borderRadius: 100,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--color-bark)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    ✦ PERSONALIZUOK
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 4 }}>
                    {COLOR_SWATCHES.map(c => (
                      <div key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.6)' }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}>PawCharms Antkaklis</span>
                  <span style={{ fontSize: 14, color: 'var(--color-bark-muted)', fontFamily: "'DM Sans', sans-serif" }}>Kaina: €25</span>
                </div>
                <Link
                  href="/products"
                  onMouseEnter={e => { e.currentTarget.style.background = '#8fc488'; e.currentTarget.style.transform = 'scale(0.99)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-sage)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'var(--color-sage)',
                    borderRadius: 100,
                    padding: '12px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-interactive-text)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'background-color 150ms ease-out, transform 100ms ease-out',
                  }}
                >
                  Apsipirkti
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
