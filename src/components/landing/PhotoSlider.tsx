'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { InfiniteSlider } from '@/components/ui/infinite-slider-horizontal';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Link from 'next/link';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { Button } from '@/components/ui/button';
import { getProductBySlugAsync, type ProductDetail } from '@/lib/catalog';

const SLIDER_IMAGES = [
  'https://cdn.shopify.com/s/files/1/1031/6326/5372/files/Pet_Collar_Collection_In_a_naturalistic_golden_hour_style_this_ahGYGZJg_Large_f4468f39-18ca-4e02-825d-c001b10f8cc1.jpg?v=1783096006',
  'https://cdn.shopify.com/s/files/1/1031/6326/5372/files/Pet_Collar_Collection_A_chocolate_Labrador_retriever_with_a_light_blue_W2XEVQRN_Large_9dccf8d6-6ad5-4d1a-88a1-eebe0930a06f.jpg?v=1783096006',
  'https://cdn.shopify.com/s/files/1/1031/6326/5372/files/DSC03015_Large_c5038a3f-a1bd-46a0-a87e-9480c1574e6a.jpg?v=1783616965',
  'https://cdn.shopify.com/s/files/1/1031/6326/5372/files/IMG_5529.jpg?v=1783616952',
  'https://cdn.shopify.com/s/files/1/1031/6326/5372/files/DSC01695_Large_4cba13cc-9ff7-4ba8-b12d-a03890c4fb9b.jpg?v=1783616972',
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

export function PhotoSlider({ product }: { product?: ProductDetail } = {}) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [promoProducts, setPromoProducts] = useState<PromoProduct[]>([]);

  useEffect(() => {
    if (product) {
      setPromoProducts([{
        image: product.image,
        name: product.name,
        description: product.shortDescription,
        price: product.price,
        href: `/products/${product.slug}`,
      }]);
      return;
    }

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
  }, [product]);

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
