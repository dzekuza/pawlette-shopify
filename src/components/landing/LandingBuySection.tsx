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
    <section className="bg-surface-2 px-4 py-16 md:px-6 md:py-24" id="customize">
      <div className="relative mx-auto max-w-[1152px]">
        <div className="grid grid-cols-1 gap-8 rounded-[32px] bg-white p-6 ring-1 ring-bark/[0.06] md:p-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">

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
