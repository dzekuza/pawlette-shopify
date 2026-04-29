'use client';

import { useState, useEffect } from 'react';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { getCharms, type ShopifyCharm } from '@/lib/shopify';
import { SectionIntro } from '@/components/storefront/SectionIntro';
import { CharmCollectionCard } from '@/components/products/CharmCollectionCard';

export function CharmGrid() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [charmProduct, setCharmProduct] = useState<ShopifyCharm | null>(null);

  useEffect(() => {
    getCharms().then(items => {
      if (items.length > 0) setCharmProduct(items[0]);
    });
  }, []);

  if (!charmProduct) return null;

  const image = charmProduct.productFeaturedImage || charmProduct.productImages?.[0] || charmProduct.image || '';

  return (
    <section id="charms" style={{ background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionIntro
          eyebrow="Pakabukų kolekcija"
          title="Tavo šuo. Tavo stilius."
          description="Kiekvienas pakabukas prisisega per kelias sekundes ir taip pat lengvai nusiima. Rink, derink ir keisk pagal nuotaiką, sezoną ar progą."
        />
        <div style={{ maxWidth: isMobile ? '100%' : 320 }}>
          <CharmCollectionCard
            href="/products/charm-charms"
            title={charmProduct.productTitle}
            price={charmProduct.price}
            originalPrice={charmProduct.originalPrice}
            image={image}
            imageAlt={charmProduct.productTitle}
          />
        </div>
      </div>
    </section>
  );
}
