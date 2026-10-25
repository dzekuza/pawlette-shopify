'use client';

import { useTranslations } from 'next-intl';
import { useCollarConfigurator } from '@/lib/useCollarConfigurator';
import { Collar3DGalleryTile } from '@/components/products/Collar3DGalleryTile';
import { CollarConfigurator } from '@/components/products/CollarConfigurator';

export function LandingBuySection() {
  const t = useTranslations('landing.buySection');
  const collarConfigurator = useCollarConfigurator();
  const { collar, selectedCollarCharms } = collarConfigurator;

  if (!collar) return null;

  const displayPrice = collar.price.toString().startsWith('€') ? collar.price : `€${collar.price}`;

  return (
    <section className="relative overflow-hidden bg-cream px-4 py-16 md:px-6 md:py-24" id="customize">
      {/* Animated gradient backdrop: soft brand-colour blobs drifting slowly */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
        <div className="animate-drift-a absolute -left-[10%] top-[5%] h-[520px] w-[520px] rounded-full bg-sky/70 blur-[90px] motion-reduce:animate-none" />
        <div className="animate-drift-b absolute right-[-8%] top-[-10%] h-[480px] w-[480px] rounded-full bg-blossom/55 blur-[100px] motion-reduce:animate-none" />
        <div className="animate-drift-c absolute bottom-[-15%] left-[30%] h-[460px] w-[460px] rounded-full bg-sage/60 blur-[90px] motion-reduce:animate-none" />
        <div className="animate-drift-b absolute bottom-[10%] right-[10%] h-[320px] w-[320px] rounded-full bg-honey/60 blur-[80px] motion-reduce:animate-none" />
      </div>
      <div className="relative mx-auto max-w-[1152px]">
        <div className="grid grid-cols-1 gap-8 rounded-[32px] bg-white p-6 shadow-[0_24px_48px_-32px_rgba(61,53,48,0.12)] md:p-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">

          {/* Left Column: Live 3D Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[480px] lg:flex-1">
              <Collar3DGalleryTile
                collar={collar}
                selectedCharms={selectedCollarCharms}
                variant="slide"
                background="transparent"
              />
            </div>
          </div>

          {/* Right Column: the same flat option sections as the product detail page buy panel */}
          <div className="font-sans lg:col-span-5 lg:self-center">
            <CollarConfigurator.Root
              configurator={collarConfigurator}
              name={collar.parentTitle ?? t('defaultCollarName')}
              price={displayPrice}
            >
              <CollarConfigurator.Header as="h2" />
              <CollarConfigurator.Colors />
              <CollarConfigurator.Sizes />
              <CollarConfigurator.Charms />
              <CollarConfigurator.AddToCart />
              <CollarConfigurator.TrustStrip />
              <CollarConfigurator.ReviewCarousel />
            </CollarConfigurator.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
