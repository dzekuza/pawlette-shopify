'use client';

import Image from 'next/image';
import { InfiniteSlider } from '@/components/ui/infinite-slider-horizontal';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Link from 'next/link';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { Button } from '@/components/ui/button';

const SLIDER_IMAGES = [
  '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
  '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
  '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  '/In_a_cute_and_playful_style_pastel-colored_dog_plHj2W1q.webp',
  '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
  '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp',
  '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
];

type Slide =
  | { type: 'image'; src: string }
  | { type: 'promo' };

const SLIDES: Slide[] = [
  { type: 'image', src: SLIDER_IMAGES[0] },
  { type: 'image', src: SLIDER_IMAGES[1] },
  { type: 'image', src: SLIDER_IMAGES[2] },
  { type: 'promo' },
  { type: 'image', src: SLIDER_IMAGES[3] },
  { type: 'promo' },
  { type: 'image', src: SLIDER_IMAGES[4] },
  { type: 'image', src: SLIDER_IMAGES[5] },
  { type: 'image', src: SLIDER_IMAGES[6] },
];

function ProductPromoCard({ width, height }: { width: number; height: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-end overflow-hidden rounded-[40px] shrink-0"
      style={{ width, height }}
    >
      <Image src="/collar-pink.png" alt="" fill sizes={`${width}px`} className="object-cover rounded-[40px]" />
      <div
        className="absolute inset-0 rounded-[40px]"
        style={{ background: 'linear-gradient(to bottom, rgba(250,247,242,0) 50%, var(--color-cream) 65%)' }}
      />
      <div className="relative flex flex-col items-start gap-4 w-full px-5 pb-2 pt-4">
        <p className="font-sans font-medium text-xl text-bark">Rožinis Pavadėlis</p>
        <p className="text-[13px] leading-snug text-bark-muted">
          Rožinis pavadėlis iš vandeniui atsparaus silikono su patogia rankena – komfortas ir stilius kiekvienam pasivaikščiojimui.
        </p>
        <div className="flex w-full items-center justify-between">
          <span className="font-sans font-semibold text-[22px] text-bark">€33.00</span>
          <Button asChild variant="sage" size="pill-sm">
            <Link href="/products">Užsisakyti iš anksto</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PhotoSlider() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  const imgW = isMobile ? 200 : 280;
  const imgH = isMobile ? 250 : 340;
  const promoW = isMobile ? 240 : 312;

  return (
    <section className="bg-surface-2 overflow-hidden">
      <div style={{
        maxWidth: 1328,
        margin: '0 auto',
        padding: isMobile ? '32px 16px 16px' : '64px 64px 24px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 20 : 40,
      }}>
        <DisplayHeading as="h2" size="section" className="text-bark text-left" style={{ flex: '1 0 0', fontSize: isMobile ? 32 : 48 }}>
          Vienas antkaklis. Begalė stilių.
        </DisplayHeading>
        <BodyCopy style={{ maxWidth: 434 }}>
          Vandeniui atsparus silikonas, patogi rankena ir spalvos, tinkančios kiekvienam šuniui.
        </BodyCopy>
      </div>
      <div style={{ paddingTop: isMobile ? 32 : 48, paddingBottom: isMobile ? 32 : 48 }}>
        <InfiniteSlider gap={16} duration={40} pauseOnHover>
          {SLIDES.map((slide, i) =>
            slide.type === 'promo' ? (
              <ProductPromoCard key={`promo-${i}`} width={promoW} height={imgH} />
            ) : (
              <div key={slide.src} style={{ position: 'relative', width: imgW, height: imgH, flexShrink: 0, borderRadius: 40, overflow: 'hidden' }}>
                <Image src={slide.src} alt="" fill sizes="(max-width: 767px) 200px, 280px" style={{ objectFit: 'cover' }} />
              </div>
            )
          )}
        </InfiniteSlider>
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', paddingBottom: isMobile ? 48 : 100 }}>
        <PrimaryButton href="/configure" variant="sage" size="md">
          Sukurkite savo unikalų antkaklį →
        </PrimaryButton>
        <Button asChild variant="pillOutline" size="pill">
          <Link href="/products/charm-charms">Pirkti pakabukus</Link>
        </Button>
      </div>
    </section>
  );
}
