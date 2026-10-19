'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { DisplayHeading } from '@/components/storefront/Typography';

// 2 columns on phones, 4 on md+. Spans are chosen so each breakpoint tiles with no gaps.
const TILES = [
  { src: '/hero-figma/bento-dog-leash-meadow.jpg', className: 'col-span-2 row-span-2' },
  { src: '/hero-figma/hero-dsc01440.jpg', className: 'col-span-2 md:col-span-2' },
  { src: '/hero-figma/timeline-dog-3.jpg', className: 'row-span-2' },
  { src: '/hero-figma/hero-dsc02865.jpg', className: '' },
  { src: '/hero-figma/hero-dsc02225.jpg', className: '' },
  { src: '/hero-figma/hero-dsc01458.jpg', className: '' },
  { src: '/hero-figma/hero-dsc01798.jpg', className: '' },
] as const;

export function GalleryMosaic() {
  const t = useTranslations('landing.gallery');

  return (
    <section className="bg-cream px-4 pb-0 pt-16 md:px-6 md:pt-24">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-10 md:gap-14">
        <DisplayHeading as="h2" size="section" className="text-center text-bark">
          {t('heading')}
        </DisplayHeading>

        <div className="grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-4 md:gap-4">
          {TILES.map((tile) => (
            <div
              key={tile.src}
              data-animate="card"
              className={cn('group relative overflow-hidden rounded-[24px] bg-surface-2 md:rounded-[32px]', tile.className)}
            >
              <Image
                src={tile.src}
                alt={t('imageAlt')}
                fill
                sizes="(min-width: 1200px) 580px, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
