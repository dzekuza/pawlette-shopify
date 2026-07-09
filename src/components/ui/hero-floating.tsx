"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayHeading } from "@/components/storefront/Typography";
import { FREE_SHIPPING_COPY } from "@/lib/site-config";
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

const HERO_TRUST_BADGES = [
  { label: "⭐ 4.9/5 — 9 atsiliepimų", href: "/products/charm-charms#reviews" },
  { label: `🚚 ${FREE_SHIPPING_COPY}` },
  { label: "↩ 30 d. grąžinimas" },
];

interface FloatingHeroProps {
  className?: string;
}

export function FloatingHero({ className }: FloatingHeroProps) {
  const stickersRef = useRef<HTMLDivElement>(null);

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
      <div ref={stickersRef} className="pointer-events-none absolute inset-0 z-20">
        <div data-hero-sticker className="absolute left-[5%] top-[57%] w-[120px] -rotate-[17deg] lg:left-[20%] lg:top-[19%] lg:w-[190px]">
          <Image src={HERO_STICKERS.collar} alt="" width={238} height={238} className="h-auto w-full" />
        </div>
        <div data-hero-sticker className="absolute left-[76%] top-[86%] w-[100px] -rotate-[23deg] lg:left-[85%] lg:top-[60%] lg:w-[120px]">
          <Image src={HERO_STICKERS.paw} alt="" width={144} height={144} className="h-auto w-full" />
        </div>
        <div data-hero-sticker className="absolute left-[72%] top-[48%] w-[104px] -rotate-[17deg] lg:left-[12%] lg:top-[55%] lg:w-[140px]">
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
            Vienas antkaklis. Begalė stilių.
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

          <div className="flex max-w-[920px] flex-wrap items-center justify-center gap-2">
            {HERO_TRUST_BADGES.map((badge) =>
              badge.href ? (
                <Link
                  key={badge.label}
                  href={badge.href}
                  className="rounded-full border border-sage/35 bg-white/80 px-3 py-1.5 text-xs font-medium text-bark no-underline transition-colors hover:bg-sage/10"
                >
                  {badge.label}
                </Link>
              ) : (
                <span
                  key={badge.label}
                  className="rounded-full border border-sage/30 bg-surface-2/90 px-3 py-1.5 text-xs font-medium text-bark"
                >
                  {badge.label}
                </span>
              )
            )}
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
      </div>
    </section>
  );
}
