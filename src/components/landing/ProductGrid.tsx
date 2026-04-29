'use client';

import type { LandingCollar } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';
import { SectionIntro } from '@/components/storefront/SectionIntro';

export function ProductGrid({ collars = [] }: { collars?: LandingCollar[] }) {
  return (
    <section id="shop" className="bg-cream px-5 py-[60px] md:px-10 md:py-[100px]">
      <div className="mx-auto max-w-[1160px]">
        <SectionIntro eyebrow="Antkaklių rinkiniai" title="Visi antkakliai" actionHref="/products" actionLabel="Peržiūrėti visus →" />
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {collars.map(p => (
            <ProductCard key={String(p.id)} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
