'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { SectionCta } from '@/components/landing/SectionCta';
import { HARDWARE_COLOUR } from '@/lib/collar3d';

function Collar3DLoading() {
  const t = useTranslations('landing.featuresStrip');
  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-bark-muted)' }}>{t('loading3d')}</span>
    </div>
  );
}

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), {
  ssr: false,
  loading: () => <Collar3DLoading />,
});

const STICKERS = {
  collar: '/hero-figma/hero-sticker-collar.png',
  paw: '/hero-figma/hero-sticker-paw.png',
  letterS: '/hero-figma/hero-sticker-s.png',
};

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
    <section className="relative overflow-hidden bg-gradient-to-b from-sky/35 to-sky px-4 py-16 md:px-6 md:py-24">
      {/* CSS Levitation Style Block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-levitate-features {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes float-collar-features {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
        .features-float-collar { animation: float-collar-features 4s ease-in-out infinite; }
        .features-float-sticker-1 { animation: float-levitate-features 3.2s ease-in-out infinite; }
        .features-float-sticker-2 { animation: float-levitate-features 3.6s ease-in-out infinite; }
        .features-float-sticker-3 { animation: float-levitate-features 4s ease-in-out infinite; }
      `}} />

      <div className="mx-auto flex max-w-[1152px] flex-col gap-16">
        
        {/* Top 3D Showcase Area with Stickers */}
        <div className="relative w-full aspect-[21/9] min-h-[340px] max-w-[1000px] mx-auto z-10">
          
          {/* Background Stickers */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="features-float-sticker-1 absolute left-[2%] top-[10%] w-[130px] -rotate-[17deg] md:w-[200px] md:left-[4%]">
              <Image src={STICKERS.collar} alt="" width={238} height={238} className="h-auto w-full" />
            </div>
            <div className="features-float-sticker-2 absolute right-[4%] top-[5%] w-[120px] rotate-[15deg] md:w-[170px]">
              <Image src={STICKERS.letterS} alt="" width={222} height={222} className="h-auto w-full" />
            </div>
            <div className="features-float-sticker-3 absolute right-[2%] top-[15%] w-[100px] -rotate-[23deg] md:w-[140px] md:right-[4%] md:top-[10%]">
              <Image src={STICKERS.paw} alt="" width={144} height={144} className="h-auto w-full" />
            </div>
          </div>

          {/* Live 3D Scene */}
          <div className="features-float-collar absolute inset-0 z-10">
            <Collar3DScene
              items={[]}
              strapColour="#B8D8F4"
              hardwareColour={HARDWARE_COLOUR}
              autoRotate
              interactive
              fitMargin={0.95}
            />
          </div>
        </div>

        {/* Bottom features — bento grid */}
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {items.map((f, i) => (
            <div
              key={f.title}
              data-animate="card"
              className={cn(
                'group flex flex-col justify-between gap-10 rounded-[28px] border border-white/60 bg-white/45 p-7 font-sans shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_32px_-20px_rgba(61,53,48,0.25)] backdrop-blur-md transition-[transform,background-color] duration-300 ease-out hover:-translate-y-1 hover:bg-white/60 md:p-8',
                BENTO_SPANS[i],
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-[0_6px_14px_-8px_rgba(61,53,48,0.3)] transition-transform duration-300 ease-out group-hover:scale-105">
                <Image src={FEATURE_ICONS[i]} alt="" aria-hidden="true" width={22} height={22} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="m-0 max-w-[24ch] text-xl font-semibold leading-tight tracking-tight text-bark md:text-[22px]">
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
