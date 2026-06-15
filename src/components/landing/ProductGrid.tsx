'use client';

import { useState } from 'react';
import type { ProductDetail } from '@/lib/db';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Link from 'next/link';

const TABS = ['Visi', 'Antkakliai', 'Pavadeliai', 'Pakabukai'] as const;
type Tab = (typeof TABS)[number];

const TAB_TYPE: Partial<Record<Tab, ProductDetail['productType']>> = {
  Antkakliai: 'collar',
  Pavadeliai: 'leash',
  Pakabukai: 'charm',
};

const COLOR_SWATCHES = ['#B8D8F4', '#A8D5A2', '#F9E4A0', '#F4B5C0', '#D4B8F4'];

function ProductCard({ product }: { product: ProductDetail }) {
  const image = product.image;
  const price = product.price ?? '25';
  const [ctaHover, setCtaHover] = useState(false);
  const swatches = product.leashColors ?? COLOR_SWATCHES;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'clip',
        background: '#E8E3DC',
        aspectRatio: '1 / 1',
      }}>
        {image && (
          <img
            src={image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        {/* PERSONALIZUOK badge */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: '#F4B5C0',
          borderRadius: 100,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 700,
          color: '#8B3A4A',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          ✦ PERSONALIZUOK
        </div>
        {/* Color swatches */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          gap: 4,
        }}>
          {swatches.map(c => (
            <div
              key={c}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: c,
                border: '1px solid rgba(255,255,255,0.6)',
              }}
            />
          ))}
        </div>
      </div>
      </Link>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-bark)' }}>
          {product.name}
        </span>
        <span style={{ fontSize: 14, color: '#706B68' }}>
          Kaina: {price}
        </span>
      </div>

      {/* CTA */}
      <Link
        href={`/products/${product.slug}`}
        onMouseEnter={() => setCtaHover(true)}
        onMouseLeave={() => setCtaHover(false)}
        style={{
          display: 'block',
          textAlign: 'center',
          background: ctaHover ? '#8fc488' : 'var(--color-sage)',
          borderRadius: 100,
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-interactive-text)',
          textDecoration: 'none',
          transition: 'background-color 150ms ease-out, transform 100ms ease-out',
          transform: ctaHover ? 'scale(0.99)' : 'scale(1)',
        }}
      >
        Užsakyti iš anksto
      </Link>
    </div>
  );
}

export function ProductGrid({ products = [] }: { products?: ProductDetail[] }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [activeTab, setActiveTab] = useState<Tab>('Visi');
  const filteredProducts = activeTab === 'Visi' ? products : products.filter(p => p.productType === TAB_TYPE[activeTab]);

  return (
    <section id="shop" style={{ background: 'var(--color-cream)' }}>
      <div style={{
        maxWidth: 1292,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '64px 64px',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Heading + tabs row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: 16,
        }}>
          <h2 style={{
            fontSize: isMobile ? 36 : 48,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Mūsų produktai
          </h2>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.background = 'rgba(61,53,48,0.07)'; }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.background = 'transparent'; }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                style={{
                  background: activeTab === tab ? 'var(--color-sage)' : 'transparent',
                  border: activeTab === tab ? 'none' : '1.5px solid rgba(61,53,48,0.2)',
                  borderRadius: 100,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: activeTab === tab ? 'var(--color-interactive-text)' : 'var(--color-bark)',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background 150ms ease-out, color 150ms ease-out, transform 100ms ease-out',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product cards grid / carousel */}
        {filteredProducts.length > 0 ? (
          isMobile ? (
            <div className="hide-scrollbar" style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
              scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
              marginLeft: -16,
              marginRight: -16,
              paddingLeft: 16,
              paddingRight: 16,
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
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )
        ) : (
          /* Placeholder cards when no products loaded */
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? 12 : 20,
          }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  background: '#E8E3DC',
                  borderRadius: 16,
                  aspectRatio: '1 / 1',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: '#F4B5C0',
                    borderRadius: 100,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#8B3A4A',
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
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}>Pawlette Antkaklis</span>
                  <span style={{ fontSize: 14, color: '#706B68', fontFamily: "'DM Sans', sans-serif" }}>Kaina: €25</span>
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
                  Užsakyti iš anksto
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
