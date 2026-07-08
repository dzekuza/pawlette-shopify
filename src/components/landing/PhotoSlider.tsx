'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { InfiniteSlider } from '@/components/ui/infinite-slider-horizontal';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Link from 'next/link';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { Button } from '@/components/ui/button';
import { getProductBySlugAsync } from '@/lib/catalog';

const SLIDER_IMAGES = [
  '/A_golden_retriever_sits_contentedly_on_a_grassy_QlXAm7ix.webp',
  '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp',
  '/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp',
  '/In_a_cute_and_playful_style_pastel-colored_dog_plHj2W1q.webp',
  '/A_yellow_star-shaped_charm_is_attached_to_a_pink_jWdEg3nN.webp',
  '/In_a_gentle_golden-hour_light_a_woman_with_FmObGqWG.webp',
  '/A_soft_sage_green_silicone_toy_with_a_sun-shaped_TAoMQ7Zb.webp',
];

const PROMO_SLUGS = ['pawcharms-antkaklis', 'pawcharms-pakabuciai', 'pawcharms-pavadelis'];

type Slide =
  | { type: 'image'; src: string }
  | { type: 'promo'; product: PromoProduct };

interface PromoProduct {
  image: string;
  name: string;
  description: string;
  price: string;
  href: string;
}

function buildSlides(products: PromoProduct[]): Slide[] {
  const slides: Slide[] = [];
  let productIndex = 0;
  SLIDER_IMAGES.forEach((src) => {
    slides.push({ type: 'image', src });
    if (products.length > 0) {
      slides.push({ type: 'promo', product: products[productIndex % products.length] });
      productIndex += 1;
    }
  });
  return slides;
}

function ProductPromoCard({ product, width, height }: { product: PromoProduct; width: number; height: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-end overflow-hidden rounded-[40px] shrink-0"
      style={{ width, height }}
    >
      <Image src={product.image} alt="" fill sizes={`${width}px`} className="object-cover rounded-[40px]" />
      <div
        className="absolute inset-0 rounded-[40px]"
        style={{ background: 'linear-gradient(to bottom, rgba(250,247,242,0) 50%, var(--color-cream) 65%)' }}
      />
      <div className="relative flex flex-col items-start gap-4 w-full px-5 pb-2 pt-4">
        <p className="font-sans font-medium text-xl text-bark">{product.name}</p>
        <div className="flex w-full items-center justify-between">
          <span className="font-sans font-semibold text-[22px] text-bark">{product.price}</span>
          <PrimaryButton href={product.href} variant="sage" size="sm">Apsipirkti</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export function PhotoSlider() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [promoProducts, setPromoProducts] = useState<PromoProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(PROMO_SLUGS.map((slug) => getProductBySlugAsync(slug))).then((results) => {
      if (cancelled) return;
      const products = results
        .filter((p): p is NonNullable<typeof p> => !!p)
        .map((p) => ({
          image: p.image,
          name: p.name,
          description: p.shortDescription,
          price: p.price,
          href: `/products/${p.slug}`,
        }));
      if (products.length > 0) setPromoProducts(products);
    });
    return () => { cancelled = true; };
  }, []);

  const slides = buildSlides(promoProducts);

  const imgW = isMobile ? 260 : 280;
  const imgH = isMobile ? 320 : 340;
  const promoW = isMobile ? 300 : 312;

  return (
    <section className="bg-surface-2 overflow-hidden">
      <div
        className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 pt-8 md:px-6 md:pt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
      >
        <DisplayHeading as="h2" size="section" className="text-left text-bark" style={{ flex: '1 0 0' }}>
          Jūsų spalvotos akimirkos.
        </DisplayHeading>
        <BodyCopy style={{ maxWidth: 434 }}>
          Sukurtas kasdieniam komfortui, vandeniui atsparus silikonas.
        </BodyCopy>
      </div>
      <div style={{ paddingTop: isMobile ? 32 : 48, paddingBottom: isMobile ? 32 : 48 }}>
        <InfiniteSlider gap={16} duration={40} pauseOnHover>
          {slides.map((slide, i) =>
            slide.type === 'promo' ? (
              <ProductPromoCard key={`promo-${i}`} product={slide.product} width={promoW} height={imgH} />
            ) : (
              <div key={slide.src} style={{ position: 'relative', width: imgW, height: imgH, flexShrink: 0, borderRadius: 40, overflow: 'hidden' }}>
                <Image src={slide.src} alt="" fill sizes="(max-width: 767px) 260px, 280px" style={{ objectFit: 'cover' }} />
              </div>
            )
          )}
        </InfiniteSlider>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-4 pb-12 md:px-6 md:pb-[100px]">
        <PrimaryButton href="/configure" variant="sage" size="md">
          Kurk savo antkaklį →
        </PrimaryButton>
        <Button asChild variant="pillOutline" size="pill">
          <Link href="/products/charm-charms">Pirkti pakabukus</Link>
        </Button>
      </div>
    </section>
  );
}
