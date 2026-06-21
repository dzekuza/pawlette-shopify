'use client';

import Image from 'next/image';
import { InfiniteSlider } from '@/components/ui/infinite-slider-horizontal';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { DisplayHeading } from '@/components/storefront/Typography';

const ROW_ONE = [
  '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
  '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
  '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  '/In_a_cute_and_playful_style_pastel-colored_dog_plHj2W1q.webp',
  '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
  '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp',
];

const ROW_TWO = [
  '/In_a_minimalist_style_a_delicate_pink_hzs32ACd.webp',
  '/A_man_and_a_woman_sit_on_a_couch_with_a_small_wj6F8xDr.webp',
  '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
  '/A_woman_with_brown_hair_runs_along_a_sandy_beach_pMc16cB6.webp',
  '/A_yellow_star-shaped_object_is_attached_to_a_GDnMbdUH.webp',
  '/A_man_sits_at_an_outdoor_cafe_with_a_French_BfuQAh4h.webp',
];

export function PhotoSlider() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  const imgW = isMobile ? 200 : 280;
  const imgH = isMobile ? 250 : 340;

  return (
    <section className="bg-surface-2 overflow-hidden">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px 16px' : '64px 0 24px' }}>
        <DisplayHeading as="h2" size="section" className="text-bark text-left" style={{ fontSize: isMobile ? 36 : 48 }}>
          Jūsų akimirkos
        </DisplayHeading>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: isMobile ? 60 : 100 }}>
        <InfiniteSlider gap={16} duration={30}>
          {ROW_ONE.map((src) => (
            <div key={src} style={{ position: 'relative', width: imgW, height: imgH, flexShrink: 0, borderRadius: 16, overflow: 'hidden' }}>
              <Image src={src} alt="" fill sizes="(max-width: 767px) 200px, 280px" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </InfiniteSlider>
        <InfiniteSlider gap={16} duration={30} reverse>
          {ROW_TWO.map((src) => (
            <div key={src} style={{ position: 'relative', width: imgW, height: imgH, flexShrink: 0, borderRadius: 16, overflow: 'hidden' }}>
              <Image src={src} alt="" fill sizes="(max-width: 767px) 200px, 280px" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
