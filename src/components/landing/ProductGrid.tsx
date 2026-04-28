'use client';

import Link from 'next/link';
import type { LandingCollar } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';

export function ProductGrid({ collars = [] }: { collars?: LandingCollar[] }) {
  return (
    <section id="shop" className="bg-cream px-5 py-[60px] md:px-10 md:py-[100px]">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-bark-muted">
              Antkaklių rinkiniai
            </div>
            <h2 className="font-sans text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-bark">
              Visi antkakliai
            </h2>
          </div>
          <Link href="/products" className="font-sans text-sm text-bark-muted no-underline">
            Peržiūrėti visus →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {collars.map(p => (
            <ProductCard key={String(p.id)} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
