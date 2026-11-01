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
    <section id="shop" className="bg-cream">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 font-sans md:px-6 md:py-24">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-4">
          <DisplayHeading as="h2" size="section" className="max-w-[32ch] text-balance text-bark">
            {t('heading')}
          </DisplayHeading>
        </div>

        {/* Product cards grid / carousel */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto md:hidden">
              {filteredProducts.map((p, i) => (
                <div key={p.id} className="shrink-0 basis-[calc((100%-12px)/1.4)] snap-start">
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
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl bg-border">
                  <span className="absolute left-3 top-3 text-[13px] font-medium text-bark-muted">{t('placeholderBadge')}</span>
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {COLOR_SWATCHES.map(c => (
                      <span key={c} className="size-3.5 rounded-full border border-white/60" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1 font-sans">
                  <span className="text-base font-medium text-bark">{t('placeholderProductName')}</span>
                  <span className="text-sm text-bark-muted">{t('placeholderPrice')}</span>
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
