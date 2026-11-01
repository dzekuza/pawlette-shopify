'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { SectionCta } from '@/components/landing/SectionCta';
import { DisplayHeading } from '@/components/storefront/Typography';
import { HARDWARE_COLOUR } from '@/lib/collar3d';

function Collar3DLoading() {
  const t = useTranslations('landing.featuresStrip');
  return (
    <div className="flex h-full items-center justify-center">
      <span className="text-[13px] text-bark-muted">{t('loading3d')}</span>
    </div>
  );
}

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => <Collar3DLoading />,
});

const FEATURE_ICONS = [
  '/icons/droplet.svg',
  '/icons/timer.svg',
  '/icons/paint-board.svg',
  '/icons/hand.svg',
  '/icons/resize.svg',
  '/icons/return.svg',
];

// Bento widths on lg (6-col grid): wide/narrow, narrow/wide, half/half.
const BENTO_SPANS = [
  'lg:col-span-4',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-4',
  'lg:col-span-3',
  'lg:col-span-3',
];

interface FeatureItem {
  title: string;
  desc: string;
}

export function FeaturesStrip() {
  const t = useTranslations('landing.featuresStrip');
  const items = t.raw('items') as FeatureItem[];

  return (
    <section className="relative overflow-hidden bg-sky/30 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-16">
        <DisplayHeading as="h2" size="section" className="relative z-10 text-center text-bark">
          {t('heading')}
        </DisplayHeading>

        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* The one bright moment: the real 3D collar, static, in the corner above the grid */}
          <div className="absolute -right-4 -top-28 z-20 h-[140px] w-[220px] md:-right-12 md:-top-36 md:h-[200px] md:w-[400px]">
            <Collar3DScene
              items={[]}
              strapColour="#B8D8F4"
              hardwareColour={HARDWARE_COLOUR}
              autoRotate
              interactive
              fitMargin={0.95}
            />
          </div>
          {items.map((f, i) => (
            <div
              key={f.title}
              data-animate="card"
              className={cn(
                'flex flex-col justify-between gap-6 rounded-3xl bg-white p-6 md:gap-10 font-sans ring-1 ring-bark/[0.06] md:p-8',
                BENTO_SPANS[i],
              )}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-surface-2">
                <Image src={FEATURE_ICONS[i]} alt="" aria-hidden="true" width={22} height={22} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="m-0 max-w-[24ch] text-xl font-medium leading-tight text-bark md:text-[22px]">
                  {f.title}
                </p>
                <p className="m-0 max-w-[46ch] text-sm leading-relaxed text-bark-light md:text-[15px]">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex justify-center">
          <SectionCta location="features" />
        </div>
      </div>
    </section>
  );
}
