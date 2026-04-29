'use client';

import type { LandingCollar } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';
import { SectionIntro } from '@/components/storefront/SectionIntro';
import { useWindowWidth } from '@/hooks/useWindowWidth';

export function ProductGrid({ collars = [] }: { collars?: LandingCollar[] }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section id="shop" style={{ background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionIntro eyebrow="Antkaklių rinkiniai" title="Visi antkakliai" actionHref="/products" actionLabel="Peržiūrėti visus →" className="mb-4 md:mb-6" />
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {collars.map(p => (
            <ProductCard key={String(p.id)} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
