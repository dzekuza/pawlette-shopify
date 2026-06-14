'use client';

import type { ProductDetail } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';
import { SectionIntro } from '@/components/storefront/SectionIntro';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export function ProductGrid({ products = [] }: { products?: ProductDetail[] }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section id="shop" style={{ background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionIntro eyebrow="Kolekcija" title="Visi produktai" actionHref="/products" actionLabel="Peržiūrėti visus →" className="mb-4 md:mb-6" />
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              href={p.productType === 'collar' ? '/products' : p.productType === 'leash' ? '/pavadeliai' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
