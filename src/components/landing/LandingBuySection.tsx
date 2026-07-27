'use client';

import { useTranslations } from 'next-intl';
import { useCollarConfigurator } from '@/lib/useCollarConfigurator';
import { Collar3DGalleryTile } from '@/components/products/Collar3DGalleryTile';
import { CollarConfigurator } from '@/components/products/CollarConfigurator';

export function LandingBuySection() {
  const t = useTranslations('landing.buySection');
  const collarConfigurator = useCollarConfigurator();
  const { collar, selectedCollarCharms, setPreview3DOpen } = collarConfigurator;

  if (!collar) return null;

  const displayPrice = collar.price.toString().startsWith('€') ? collar.price : `€${collar.price}`;

  return (
    <section className="bg-cream px-4 py-16 md:px-6 md:py-24" id="customize">
      <div className="mx-auto max-w-[1112px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Live 3D Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-square w-full overflow-hidden rounded-2xl relative">
              <Collar3DGalleryTile
                collar={collar}
                selectedCharms={selectedCollarCharms}
                onEdit={() => setPreview3DOpen(true)}
                variant="slide"
                background="transparent"
              />
            </div>
          </div>

          {/* Right Column: the same shared collar configurator used on the product detail page */}
          <div className="lg:col-span-5 font-sans bg-white p-6 md:p-10 rounded-[32px] shadow-[0_24px_48px_-32px_rgba(61,53,48,0.12)]">
            <CollarConfigurator
              configurator={collarConfigurator}
              name={collar.parentTitle ?? t('defaultCollarName')}
              price={displayPrice}
              showTrustAndReviews={false}
              stepper
            />
          </div>
        </div>
      </div>
    </section>
  );
}
