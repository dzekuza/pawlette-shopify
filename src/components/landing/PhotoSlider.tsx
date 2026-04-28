'use client';

import { InfiniteSlider } from '@/components/ui/infinite-slider-horizontal';

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
  return (
    <section className="bg-cream py-[60px] md:py-[100px] overflow-hidden">
      <h2 className="font-display text-[36px] md:text-[48px] text-bark text-center mb-10 tracking-[-0.02em]">
        Jūsų akimirkos
      </h2>
      <div className="flex flex-col gap-4">
        <InfiniteSlider gap={16} duration={30}>
          {ROW_ONE.map((src) => (
            <div key={src} className="w-[200px] h-[250px] md:w-[280px] md:h-[340px] shrink-0 rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover block" />
            </div>
          ))}
        </InfiniteSlider>
        <InfiniteSlider gap={16} duration={30} reverse>
          {ROW_TWO.map((src) => (
            <div key={src} className="w-[200px] h-[250px] md:w-[280px] md:h-[340px] shrink-0 rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover block" />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
