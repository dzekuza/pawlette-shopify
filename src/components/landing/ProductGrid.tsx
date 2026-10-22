'use client';

import { PrimaryButton } from '@/components/shared/PrimaryButton';
import type { ProductDetail } from '@/lib/db';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { localizeHref } from '@/lib/locale-path';
import { ProductCard } from '@/components/products/ProductCard';
import { useViewItemList } from '@/hooks/useViewItemList';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';

const COLOR_SWATCHES = [
  'var(--color-sky)',
  'var(--color-sage)',
  'var(--color-honey)',
  'var(--color-blossom)',
  'var(--color-lavender)',
];

export function ProductGrid({ products = [] }: { products?: ProductDetail[] }) {
  const t = useTranslations('landing.productGrid');
  const locale = useLocale() as 'lt' | 'en';
  const filteredProducts = products;
  useViewItemList('landing_featured', filteredProducts);

  return (
    <section id="shop" style={{ background: 'var(--color-cream)' }}>
      <div
        className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 md:px-6 md:py-24"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-4">
          <DisplayHeading as="h2" size="section" className="max-w-[32ch] text-balance text-bark">
            {t('heading')}
          </DisplayHeading>
        </div>

        {/* Product cards grid / carousel */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="hide-scrollbar flex md:hidden" style={{
              gap: 12,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
              scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
            }}>
              {filteredProducts.map((p, i) => (
                <div key={p.id} style={{
                  flex: '0 0 calc((100% - 12px) / 1.4)',
                  scrollSnapAlign: 'start',
                }}>
                  <ProductCard product={p} listName='landing_featured' index={i} />
                </div>
              ))}
            </div>
            <div className="hidden grid-cols-3 gap-5 md:grid">
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} listName='landing_featured' index={i} />
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
                    {t('placeholderBadge')}
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 4 }}>
                    {COLOR_SWATCHES.map(c => (
                      <div key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.6)' }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}>{t('placeholderProductName')}</span>
                  <span style={{ fontSize: 14, color: 'var(--color-bark-muted)', fontFamily: "'DM Sans', sans-serif" }}>{t('placeholderPrice')}</span>
                </div>
                <PrimaryButton href="/products" variant="sage" size="md" fullWidth>{t('placeholderCta')}</PrimaryButton>
              </div>
            ))}
          </div>
        )}

        <p className="m-0 text-center">
          <Link
            href={localizeHref('/products', locale)}
            className="font-medium text-interactive-text underline underline-offset-4"
          >
            {t('allCollarsLink')}
          </Link>
        </p>
      </div>
    </section>
  );
}
