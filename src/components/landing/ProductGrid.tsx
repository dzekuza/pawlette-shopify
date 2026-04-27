'use client';

import Link from 'next/link';
import type { LandingCollar } from '@/lib/db';
import { cn } from '@/lib/utils';

function productSlug(name: string): string {
  const clean = name.replace(/ (set|collar)$/i, '').trim().toLowerCase().replace(/\s+/g, '-');
  return `collar-${clean}`;
}

function ProductCard({ product }: { product: LandingCollar }) {
  const href = `/products/${productSlug(product.name)}`;
  return (
    <Link
      href={href}
      data-animate="card"
      className="group block rounded-[20px] transition-transform duration-200 ease-out hover:-translate-y-1 no-underline"
    >
      <div className="relative h-[200px] overflow-hidden rounded-[20px]" style={{ background: product.bg }}>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="block h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
          />
        )}
        {product.badge && (
          <div
            className="absolute right-3.5 top-3.5 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.06em]"
            style={{
              background: product.badgeBg || '#eef7ee',
              color: product.badgeColor || '#3a7a3a',
            }}
          >
            {product.badge}
          </div>
        )}
      </div>
      <div className="px-1 pb-1.5 pt-4">
        <div className="mb-1 font-sans text-[15px] font-medium text-bark">{product.name}</div>
        <div className="mb-3.5 font-sans text-[13px] leading-[1.5] text-bark-muted">{product.desc}</div>
        <div className="mb-3.5 flex items-center gap-1.5">
          <span
            title="Collar color"
            className="h-3.5 w-3.5 rounded-full border border-bark/15"
            style={{ background: product.collarColor }}
          />
          {product.charms.slice(0, 4).map((charm, i) => (
            <span
              key={i}
              title="Charm color"
              className="h-3 w-3 rounded-full border border-bark/10"
              style={{ background: charm.bg }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-sans text-[18px] font-medium text-bark">
            {product.price}{' '}
            <span className="text-xs font-normal text-bark-muted">· 5 charms</span>
          </div>
          <span
            className={cn(
              'btn-press rounded-full border-none px-[18px] py-2',
              'bg-sage font-sans text-[13px] font-medium text-interactive-text',
              'transition-colors duration-150 ease-out group-hover:bg-[#8fc489]'
            )}
          >
            Add to cart
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ collars = [] }: { collars?: LandingCollar[] }) {
  return (
    <section id="shop" className="bg-cream px-5 py-[60px] md:px-10 md:py-[100px]">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-bark-muted">
              Collar sets
            </div>
            <h2 className="font-sans text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-bark">
              Shop all collars
            </h2>
          </div>
          <Link href="/products" className="font-sans text-sm text-bark-muted no-underline">
            View all →
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
