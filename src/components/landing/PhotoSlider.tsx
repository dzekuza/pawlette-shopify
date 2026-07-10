'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Link from 'next/link';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { addLinesToCart } from '@/lib/cart';
import { getProductBySlugAsync, type ProductDetail } from '@/lib/catalog';
import { getCollectionProductHandles } from '@/lib/shopify';

// Fallback videos, used only until the "pawlette.social_video" metafield is set on a
// product, or until the "spalvotos-akimirkos" collection exists in Shopify Admin.
const SOCIAL_VIDEOS = [
  'https://cdn.shopify.com/videos/c/o/v/a32c10206bf546289fe5d8bcb6cef346.mp4',
  'https://cdn.shopify.com/videos/c/o/v/eaad51df2ebc4bdd81140870ab6f1534.mp4',
];

const PRODUCT_PAGE_VIDEOS = [
  'https://cdn.shopify.com/videos/c/o/v/eaad51df2ebc4bdd81140870ab6f1534.mp4',
  'https://cdn.shopify.com/videos/c/o/v/9bdcc512e8564723a8cc7b3a60422d96.mov',
  'https://cdn.shopify.com/videos/c/o/v/b89078d83042422ab668a75204d51caa.mov',
];

// Which products show in the "Jūsų spalvotos akimirkos" carousel is managed in Shopify
// Admin via a manual collection with this handle — merchants add/remove/reorder products
// there. This list is only a fallback for while that collection doesn't exist yet.
const SOCIAL_CAROUSEL_COLLECTION_HANDLE = 'spalvotos-akimirkos';
const PROMO_SLUGS = ['pawcharms-antkaklis', 'pawcharms-pakabuciai', 'pawcharms-pavadelis'];

interface PromoProduct {
  image: string;
  name: string;
  description: string;
  price: string;
  href: string;
  variantId: string;
  videos: string[];
}

interface SocialSlide {
  video: string;
  product: PromoProduct;
}

function buildSlides(products: PromoProduct[]): SocialSlide[] {
  if (products.length === 0) return [];
  return products.map((product, i) => ({
    video: product.videos[0] ?? SOCIAL_VIDEOS[i % SOCIAL_VIDEOS.length],
    product,
  }));
}

function buildProductSlides(product: PromoProduct): SocialSlide[] {
  const videos = product.videos.length > 0 ? product.videos : PRODUCT_PAGE_VIDEOS;
  return videos.map((video) => ({ video, product }));
}

function AddToCartButton({ variantId, label }: { variantId: string; label: string }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (adding || added || !variantId) return;
    setAdding(true);
    try {
      await addLinesToCart([{ merchandiseId: variantId, quantity: 1 }]);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={adding || added}
      aria-label={label}
      className="flex shrink-0 items-center justify-center rounded-full transition-opacity"
      style={{
        width: 32,
        height: 32,
        background: added ? 'var(--color-interactive-text)' : 'var(--color-sage)',
        color: 'var(--color-bark)',
        fontSize: added ? 15 : 18,
        lineHeight: 1,
        cursor: adding || added ? 'default' : 'pointer',
        opacity: adding ? 0.6 : 1,
      }}
    >
      {added ? '✓' : '+'}
    </button>
  );
}

function SocialVideoCard({ video, width, height, autoPlay, onEnded }: { video: string; width: number; height: number; autoPlay: boolean; onEnded?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (autoPlay) {
      el.currentTime = 0;
      el.muted = true;
      el.play().catch(() => {});
      return;
    }

    el.pause();

    // iOS Safari won't paint a preview frame from preload="metadata" alone —
    // it needs to actually play a frame — and it blocks programmatic play()
    // for elements that aren't yet visible in the viewport. So wait until the
    // card scrolls into view, then play+pause once to render a static
    // thumbnail instead of a blank box.
    const primeFrame = () => {
      el.muted = true;
      el.play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
        })
        .catch(() => {});
    }

    if (typeof IntersectionObserver === 'undefined') {
      primeFrame();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        primeFrame();
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay]);

  const handleEnter = () => {
    setHovered(true);
    if (!autoPlay) videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setHovered(false);
    if (!autoPlay) {
      const el = videoRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-[28px] bg-bark transition-transform duration-300 ease-out"
      style={{ width, height, transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        ref={videoRef}
        src={video}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={autoPlay}
        loop={!autoPlay}
        muted
        playsInline
        preload="auto"
        onEnded={autoPlay ? onEnded : undefined}
      />
      {!autoPlay && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background: 'rgba(250,247,242,0.32)', opacity: hovered ? 0 : 1 }}
        />
      )}
    </div>
  );
}

function SocialProductSlide({ video, product, width, height, autoPlay, onEnded, showInfo = true }: { video: string; product: PromoProduct; width: number; height: number; autoPlay: boolean; onEnded?: () => void; showInfo?: boolean }) {
  return (
    <CarouselItem className="basis-auto shrink-0 grow-0" style={{ flex: '0 0 auto', width }}>
      <div className="flex flex-col gap-3" style={{ width }}>
        <SocialVideoCard video={video} width={width} height={height} autoPlay={autoPlay} onEnded={onEnded} />
        {showInfo && (
          <div className="flex items-center gap-2">
            <Link href={product.href} className="relative shrink-0 overflow-hidden rounded-xl" style={{ width: 44, height: 44 }}>
              <Image src={product.image} alt={product.name} fill sizes="44px" className="object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm font-medium text-bark">{product.name}</p>
              <span className="font-sans text-sm font-semibold text-bark">{product.price}</span>
            </div>
            <AddToCartButton variantId={product.variantId} label={`Pridėti ${product.name} į krepšelį`} />
          </div>
        )}
      </div>
    </CarouselItem>
  );
}

export function PhotoSlider({ product }: { product?: ProductDetail } = {}) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const [promoProducts, setPromoProducts] = useState<PromoProduct[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (product) return;

    let cancelled = false;
    getCollectionProductHandles(SOCIAL_CAROUSEL_COLLECTION_HANDLE).then(async (handles) => {
      const slugs = handles.length > 0 ? handles : PROMO_SLUGS;
      const results = await Promise.all(slugs.map((slug) => getProductBySlugAsync(slug)));
      if (cancelled) return;
      const products = results
        .filter((p): p is NonNullable<typeof p> => !!p)
        .map((p) => ({
          image: p.image,
          name: p.name,
          description: p.shortDescription,
          price: p.price,
          href: `/products/${p.slug}`,
          variantId: p.variantId,
          videos: p.videos ?? [],
        }));
      if (products.length > 0) setPromoProducts(products);
    });
    return () => { cancelled = true; };
  }, [product]);

  const slides = product
    ? buildProductSlides({
        image: product.image,
        name: product.name,
        description: product.shortDescription,
        price: product.price,
        href: `/products/${product.slug}`,
        variantId: product.variantId,
        videos: product.videos ?? [],
      })
    : buildSlides(promoProducts);

  const videoW = isMobile ? 220 : 260;
  const videoH = isMobile ? 320 : 360;

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  const handleVideoEnded = () => {
    if (slides.length === 0) return;
    const next = (activeIndex + 1) % slides.length;
    setActiveIndex(next);
    carouselApi?.scrollTo(next);
  };

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
        <Carousel opts={{ align: 'start', loop: false, dragFree: true }} setApi={setCarouselApi} className="mx-auto max-w-[1200px] px-4 md:px-6">
          <CarouselContent className="justify-start md:justify-center" style={{ gap: 16 }}>
            {slides.map((slide, i) => (
              <SocialProductSlide
                key={`social-${i}`}
                video={slide.video}
                product={slide.product}
                width={videoW}
                height={videoH}
                autoPlay={i === activeIndex}
                onEnded={handleVideoEnded}
                showInfo={!product}
              />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-4 pb-12 md:px-6 md:pb-[100px]">
        <Button asChild variant="pillOutline" size="pill">
          <Link href="/products/charm-charms">Pirkti pakabukus</Link>
        </Button>
      </div>
    </section>
  );
}
