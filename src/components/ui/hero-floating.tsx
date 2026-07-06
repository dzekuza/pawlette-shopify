"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DisplayHeading } from "@/components/storefront/Typography";
import { LANDING_REVIEWS } from "@/lib/data";
import { cn } from "@/lib/utils";

const HERO_GALLERY = {
  left: "/hero-figma/hero-dsc01458.jpg",
  colTopLeft: "/hero-figma/hero-dsc02225.jpg",
  colBottomLeft: "/hero-figma/hero-dsc01440.jpg",
  center: "/hero-figma/hero-dsc03015.jpg",
  colTopRight: "/hero-figma/hero-dsc00912.jpg",
  colBottomRight: "/hero-figma/hero-dsc01798.jpg",
  right: "/hero-figma/hero-dsc02865.jpg",
};

const HERO_STICKERS = {
  collar: "/hero-figma/hero-sticker-collar.png",
  paw: "/hero-figma/hero-sticker-paw.png",
  letterS: "/hero-figma/hero-sticker-s.png",
};

const TAGLINE_SLIDES = [
  "Antkakliai – stilingi ir patogūs tiek šunims, tiek jų šeimininkams",
  "BioThane medžiaga – atspari vandeniui, purvui ir dilimui",
  "Personalizuok pakabukais ir sukurk unikalų antkaklio dizainą",
];

interface FloatingHeroProps {
  className?: string;
}

export function FloatingHero({ className }: FloatingHeroProps) {
  const stickersRef = useRef<HTMLDivElement>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINE_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglineIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((i) => (i + 1) % LANDING_REVIEWS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviewIndex]);

  const goToTagline = (dir: 1 | -1) => {
    setTaglineIndex((i) => (i + dir + TAGLINE_SLIDES.length) % TAGLINE_SLIDES.length);
  };

  const goToReview = (dir: 1 | -1) => {
    setReviewIndex((i) => (i + dir + LANDING_REVIEWS.length) % LANDING_REVIEWS.length);
  };

  useEffect(() => {
    if (!stickersRef.current) return;
    const stickers = stickersRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mm: any = null;

    import("gsap").then(({ gsap }) => {
      if (!stickersRef.current) return;
      mm = gsap.matchMedia();

      mm.add(
        {
          allowMotion: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (context: any) => {
          const { allowMotion } = context.conditions as { allowMotion?: boolean };
          if (!allowMotion) return;

          const items = stickers.querySelectorAll<HTMLElement>("[data-hero-sticker]");
          items.forEach((el, i) => {
            gsap.to(el, {
              y: "+=16",
              duration: 2.6 + i * 0.4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 0.3,
            });
          });
        }
      );
    });

    return () => mm?.revert();
  }, []);

  return (
    <section className={cn("relative overflow-hidden bg-cream px-4 py-12 md:px-6 md:py-16 lg:overflow-visible lg:py-20", className)}>
      <div ref={stickersRef} className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div data-hero-sticker className="absolute left-[20%] top-[19%] w-[190px] -rotate-[17deg]">
          <Image src={HERO_STICKERS.collar} alt="" width={238} height={238} className="h-auto w-full" />
        </div>
        <div data-hero-sticker className="absolute left-[85%] top-[60%] w-[120px] -rotate-[23deg]">
          <Image src={HERO_STICKERS.paw} alt="" width={144} height={144} className="h-auto w-full" />
        </div>
        <div data-hero-sticker className="absolute left-[12%] top-[55%] w-[140px] -rotate-[17deg]">
          <Image src={HERO_STICKERS.letterS} alt="" width={222} height={222} className="h-auto w-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-10 lg:gap-[100px]">
        <div className="flex flex-col items-center gap-8">
          <DisplayHeading
            as="h1"
            size="floatingHero"
            className="mx-auto max-w-[868px] text-center font-normal leading-[1.1] tracking-[0.02em] text-bark"
          >
            Antkakliai – stilingi ir patogūs tiek šunims, tiek jų šeimininkams
          </DisplayHeading>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            <Link
              href="https://pawcharms.lt/products/collar-melyna-collar"
              className="whitespace-nowrap rounded-full bg-sage px-6 py-3 text-base font-medium text-interactive-text no-underline"
            >
              Kurk savo antkaklį →
            </Link>
            <Link
              href="/products/charm-charms"
              className="whitespace-nowrap rounded-full border-[1.5px] border-sage/40 bg-cream/90 px-6 py-3 text-base font-medium text-interactive-text no-underline"
            >
              Pirkti pakabukus
            </Link>
          </div>
        </div>

        <div className="flex justify-center gap-3 lg:h-[460px]">
          <div className="relative hidden w-[160px] shrink-0 overflow-hidden rounded-3xl lg:block lg:h-[60%] lg:self-center">
            <Image src={HERO_GALLERY.left} alt="Šuo su PawCharms antkakliu" fill sizes="160px" className="object-cover" />
          </div>
          <div className="hidden flex-1 flex-col gap-3 lg:flex lg:h-[80%] lg:self-center">
            <div className="relative overflow-hidden rounded-3xl" style={{ flex: '42 1 0%' }}>
              <Image src={HERO_GALLERY.colTopLeft} alt="PawCharms antkaklio detalė" fill sizes="309px" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-3xl" style={{ flex: '58 1 0%' }}>
              <Image src={HERO_GALLERY.colBottomLeft} alt="Šuo su PawCharms antkakliu ilsisi" fill sizes="309px" className="object-cover" />
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-[360px] shrink-0 overflow-hidden rounded-3xl lg:aspect-auto lg:h-full lg:w-[386px] lg:max-w-none">
            <Image src={HERO_GALLERY.center} alt="Šuo sėdi žolėje su PawCharms antkakliu" fill sizes="(max-width: 1023px) 360px, 386px" className="object-cover" priority />
          </div>
          <div className="hidden flex-1 flex-col gap-3 lg:flex lg:h-[80%] lg:self-center">
            <div className="relative flex-1 overflow-hidden rounded-3xl">
              <Image src={HERO_GALLERY.colTopRight} alt="Šuo su geltonu PawCharms antkakliu" fill sizes="309px" className="object-cover" />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-3xl">
              <Image src={HERO_GALLERY.colBottomRight} alt="Šuo šokinėja su PawCharms antkakliu" fill sizes="309px" className="object-cover" />
            </div>
          </div>
          <div className="relative hidden w-[160px] shrink-0 overflow-hidden rounded-3xl lg:block lg:h-[60%] lg:self-center">
            <Image src={HERO_GALLERY.right} alt="Šuo su PawCharms antkakliu" fill sizes="160px" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-1 flex-col items-start gap-6">
            <p className="max-w-sm font-tomato text-2xl font-semibold tracking-[0.02em] text-bark">
              {TAGLINE_SLIDES[taglineIndex]}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Ankstesnis šūkis"
                onClick={() => goToTagline(-1)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sage/40 text-bark transition-colors hover:bg-sage/10"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex gap-6">
                {TAGLINE_SLIDES.map((slide, i) => (
                  <span
                    key={slide}
                    className={cn(
                      "h-[10px] w-[77px] rounded-full transition-colors duration-300",
                      i === taglineIndex ? "bg-sage" : "bg-sage/30"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Kitas šūkis"
                onClick={() => goToTagline(1)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sage/40 text-bark transition-colors hover:bg-sage/10"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 lg:w-[420px]">
            <div className="flex w-full flex-col gap-[10px] rounded-3xl border border-sage bg-sage/10 px-6 py-3">
              <p className="font-tomato text-lg font-medium tracking-[0.02em] text-bark">
                „{LANDING_REVIEWS[reviewIndex].text}“
              </p>
              <div className="flex items-center gap-6">
                <span className="h-12 w-12 shrink-0 rounded-full bg-[#B15A5A]" />
                <span className="font-tomato text-lg font-semibold tracking-[0.02em] text-bark">
                  {LANDING_REVIEWS[reviewIndex].name}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center gap-3">
              <button
                type="button"
                aria-label="Ankstesnė atsiliepimo kortelė"
                onClick={() => goToReview(-1)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sage/40 text-bark transition-colors hover:bg-sage/10"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex flex-1 gap-6">
                {LANDING_REVIEWS.map((review, i) => (
                  <span
                    key={review.name}
                    className={cn(
                      "h-[10px] flex-1 rounded-full transition-colors duration-300",
                      i === reviewIndex ? "bg-sage" : "bg-sage/30"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Kita atsiliepimo kortelė"
                onClick={() => goToReview(1)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sage/40 text-bark transition-colors hover:bg-sage/10"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
