'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCartCount } from '@/hooks/useCartCount';
import { useLandingProducts } from '@/hooks/useLandingProducts';
import type { ProductDetail } from '@/lib/db';
import { LandingLayout, LandingSection } from './landing/LandingLayout';
import { LandingNav } from './landing/LandingNav';
import { PhotoHero } from './landing/PhotoHero';
import { ProductGrid } from './landing/ProductGrid';
import { PhotoSlider } from './landing/PhotoSlider';
import { FAQ, FAQShopCta } from './landing/FAQ';
import { HowItWorks } from './landing/HowItWorks';
import { GalleryMosaic } from './landing/GalleryMosaic';
import { ReviewsSection } from './landing/ReviewsSection';
import { LandingBuySection } from './landing/LandingBuySection';
import { FeaturesStrip } from './landing/FeaturesStrip';
import { NewsletterSignup } from './landing/NewsletterSignup';

/** Lowest collar price as "€32.99", or undefined while products are loading. */
function lowestCollarPrice(products: ProductDetail[]): string | undefined {
  const prices = products
    .filter((p) => p.productType === 'collar')
    .map((p) => Number.parseFloat(String(p.price).replace(/[^0-9.,]/g, '').replace(',', '.')))
    .filter((n) => Number.isFinite(n));
  return prices.length ? `€${Math.min(...prices).toFixed(2)}` : undefined;
}

export function LandingPage({ initialProducts }: { initialProducts?: ProductDetail[] }) {
  const router = useRouter();
  const cartCount = useCartCount();
  const products = useLandingProducts(useLocale(), initialProducts);
  const startingPrice = lowestCollarPrice(products);

  return (
    <LandingLayout nav={<LandingNav cartCount={cartCount} onCart={() => router.push('/cart')} />}>
      <PhotoHero startingPrice={startingPrice} />

      <LandingSection><ProductGrid products={products} /></LandingSection>
      <LandingSection><HowItWorks /></LandingSection>
      <LandingSection><FeaturesStrip /></LandingSection>
      <LandingSection><GalleryMosaic /></LandingSection>
      <LandingSection><ReviewsSection /></LandingSection>
      <LandingSection><LandingBuySection /></LandingSection>
      <LandingSection><PhotoSlider /></LandingSection>
      <LandingSection><FAQ cta={<FAQShopCta />} /></LandingSection>
      <LandingSection><NewsletterSignup /></LandingSection>
    </LandingLayout>
  );
}
