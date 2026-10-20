'use client';

import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography';
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
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-bark transition-[background-color,transform,opacity] duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark/40',
        added ? 'bg-interactive-text text-cream' : 'bg-sage hover:bg-sage-dark',
        adding && 'opacity-60',
      )}
    >
      {added ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
    </button>
  );
}

function SocialVideoCard({ video, width, height, autoPlay, onEnded, children }: { video: string; width: number; height: number; autoPlay: boolean; onEnded?: () => void; children?: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

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
    if (!autoPlay) videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    if (!autoPlay) {
      const el = videoRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    }
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    const bar = progressRef.current;
    if (!el || !bar || !el.duration) return;
    bar.style.transform = `scaleX(${el.currentTime / el.duration})`;
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[32px] bg-bark transition-transform duration-300 ease-out',
        autoPlay ? 'scale-100' : 'scale-[0.97] hover:scale-100',
      )}
      style={{ width, height }}
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
        preload={autoPlay ? 'auto' : 'metadata'}
        onEnded={autoPlay ? onEnded : undefined}
        onTimeUpdate={autoPlay ? handleTimeUpdate : undefined}
      />
      {autoPlay && (
        <span className="absolute inset-x-4 top-4 h-[3px] overflow-hidden rounded-full bg-white/35">
          <span ref={progressRef} className="block h-full w-full origin-left rounded-full bg-white" style={{ transform: 'scaleX(0)' }} />
        </span>
      )}
      {children}
    </div>
  );
}

interface SocialSlideProps {
  video: string;
  width: number;
  height: number;
  autoPlay: boolean;
  onEnded?: () => void;
  /** Content overlaid at the bottom of the video, e.g. `<SocialProductInfo />`. Omit for a video-only slide. */
  children?: ReactNode;
}

function SocialSlide({ video, width, height, autoPlay, onEnded, children }: SocialSlideProps) {
  return (
    <CarouselItem className="basis-auto shrink-0 grow-0" style={{ flex: '0 0 auto', width }}>
      <SocialVideoCard video={video} width={width} height={height} autoPlay={autoPlay} onEnded={onEnded}>
        {children}
      </SocialVideoCard>
    </CarouselItem>
  );
}

function SocialProductInfo({ product }: { product: PromoProduct }) {
  const t = useTranslations('landing.photoSlider');

  return (
    <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex items-center gap-2.5 rounded-[22px] border border-white/50 bg-cream/85 p-2 backdrop-blur-md">
      <Link href={product.href} className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[14px]">
        <Image src={product.image} alt={product.name} fill sizes="44px" className="object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate font-sans text-[13px] font-medium leading-tight text-bark">{product.name}</p>
        <span className="font-sans text-sm font-semibold leading-tight text-bark">{product.price}</span>
      </div>
      <AddToCartButton variantId={product.variantId} label={t('addToCartAriaLabel', { name: product.name })} />
    </div>
  );
}

export function PhotoSlider({ product }: { product?: ProductDetail } = {}) {
  const t = useTranslations('landing.photoSlider');
  const locale = useLocale();
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
      const results = await Promise.all(slugs.map((slug) => getProductBySlugAsync(slug, locale)));
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
  }, [product, locale]);

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

  const videoW = isMobile ? 240 : 280;
  const videoH = isMobile ? 380 : 440;

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
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 pt-16 text-center md:px-6 md:pt-24">
        <DisplayHeading as="h2" size="section" className="text-center text-bark">
          {t('heading')}
        </DisplayHeading>
        <BodyCopy style={{ maxWidth: 434 }}>
          {t('description')}
        </BodyCopy>
      </div>
      <div style={{ paddingTop: isMobile ? 32 : 40, paddingBottom: isMobile ? 48 : 64 }}>
        <Carousel opts={{ align: 'start', loop: false, dragFree: true }} setApi={setCarouselApi} className="mx-auto max-w-[1200px] px-4 md:px-6">
          <CarouselContent className="justify-start md:justify-center" style={{ gap: 16 }}>
            {slides.map((slide, i) => (
              <SocialSlide
                key={`social-${i}`}
                video={slide.video}
                width={videoW}
                height={videoH}
                autoPlay={i === activeIndex}
                onEnded={handleVideoEnded}
              >
                {!product && <SocialProductInfo product={slide.product} />}
              </SocialSlide>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {!product && (
        <div className="flex flex-wrap justify-center gap-4 px-4 pb-16 md:px-6 md:pb-24">
          <PrimaryButton href="/products/pawcharms-pakabuciai" variant="dark" size="lg">{t('shopCharmsCta')}</PrimaryButton>
        </div>
      )}
    </section>
  );
}
