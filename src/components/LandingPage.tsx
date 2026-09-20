'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCartCount } from '@/hooks/useCartCount';
import { useLandingProducts } from '@/hooks/useLandingProducts';
import { LandingLayout, LandingSection } from './landing/LandingLayout';
import { LandingNav } from './landing/LandingNav';
import { FloatingHero } from './ui/hero-floating';
import { ProductGrid } from './landing/ProductGrid';
import { PhotoSlider } from './landing/PhotoSlider';
import { FAQ, FAQShopCta } from './landing/FAQ';
import { HowItWorks } from './landing/HowItWorks';
import { LandingBuySection } from './landing/LandingBuySection';
import { FeaturesStrip } from './landing/FeaturesStrip';
import { NewsletterSignup } from './landing/NewsletterSignup';

export function LandingPage() {
  const router = useRouter();
  const cartCount = useCartCount();
  const products = useLandingProducts(useLocale());

  return (
    <LandingLayout nav={<LandingNav cartCount={cartCount} onCart={() => router.push('/cart')} />}>
      <FloatingHero />

      <LandingSection><ProductGrid products={products} /></LandingSection>
      <LandingSection><HowItWorks /></LandingSection>
      <LandingSection><FeaturesStrip /></LandingSection>
      <LandingSection><LandingBuySection /></LandingSection>
      <LandingSection><PhotoSlider /></LandingSection>
      <LandingSection><FAQ cta={<FAQShopCta />} /></LandingSection>
      <LandingSection><NewsletterSignup /></LandingSection>
    </LandingLayout>
  );
}
