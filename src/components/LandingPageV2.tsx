'use client';

import { useLandingProducts } from '@/hooks/useLandingProducts';
import { LandingLayout, LandingSection } from './landing/LandingLayout';
import { Hero3DFloat } from './landing/Hero3DFloat';
import { CharmPattern } from './landing/CharmPattern';
import { PawCharmsWordmark } from './landing/PawCharmsWordmark';
import { ProductGrid } from './landing/ProductGrid';
import { PhotoSlider } from './landing/PhotoSlider';
import { FAQ, FAQShopCta } from './landing/FAQ';
import { About, AboutCta } from './landing/About';
import { HowItWorks } from './landing/HowItWorks';
import { FeaturesStrip } from './landing/FeaturesStrip';
import { NewsletterSignup } from './landing/NewsletterSignup';

/**
 * Same page as LandingPage, except the sticker-collage hero + separate scroll-scrubbed
 * Collar3DShowcase section are replaced by a single Hero3DFloat: the Blender-rendered
 * ROCKY collar (baked floating-bob animation) sitting directly in the hero.
 *
 * Served from /landing-v2 (outside [locale], no intl provider), so it uses the default locale.
 */
export function LandingPageV2() {
  const products = useLandingProducts();

  return (
    <LandingLayout>
      <Hero3DFloat />

      <CharmPattern />

      <PawCharmsWordmark />

      <LandingSection><About cta={<AboutCta />} /></LandingSection>
      <LandingSection><ProductGrid products={products} /></LandingSection>
      <LandingSection><HowItWorks /></LandingSection>
      <LandingSection><FeaturesStrip /></LandingSection>
      <LandingSection><PhotoSlider /></LandingSection>
      <LandingSection><FAQ cta={<FAQShopCta />} /></LandingSection>
      <LandingSection><NewsletterSignup /></LandingSection>
    </LandingLayout>
  );
}
