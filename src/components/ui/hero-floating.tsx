"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayHeading, Eyebrow } from "@/components/storefront/Typography";
import { FREE_SHIPPING_COPY } from "@/lib/site-config";
import { cn } from "@/lib/utils";

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

          const floatingItems = stickers.querySelectorAll<HTMLElement>("[data-hero-float]");
          floatingItems.forEach((el, i) => {
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
    <section className={cn("relative overflow-hidden bg-cream px-4 py-12 md:px-6 md:py-16 lg:py-20", className)}>
      <div ref={stickersRef} className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div data-hero-sticker className="absolute left-[3%] top-[54%] w-[104px] -rotate-[17deg] lg:left-[4%] lg:top-[12%] lg:w-[170px]">
          <div data-hero-float>
            <Image src={HERO_STICKERS.collar} alt="" width={238} height={238} className="h-auto w-full" />
          </div>
        </div>
        <div data-hero-sticker className="absolute bottom-[2%] left-[71%] w-[82px] -rotate-[23deg] lg:left-[85%] lg:top-[60%] lg:w-[120px] lg:bottom-auto">
          <div data-hero-float>
            <Image src={HERO_STICKERS.paw} alt="" width={144} height={144} className="h-auto w-full" />
          </div>
        </div>
        <div data-hero-sticker className="absolute left-[70%] top-[44%] w-[92px] -rotate-[17deg] lg:left-[12%] lg:top-[55%] lg:w-[140px]">
          <div data-hero-float>
            <Image src={HERO_STICKERS.letterS} alt="" width={222} height={222} className="h-auto w-full" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-10 lg:gap-[100px]">
        <div className="flex flex-col items-center gap-8">
          <Eyebrow className="text-center">Šunų antkakliai su vardu</Eyebrow>
          <DisplayHeading
            as="h1"
            size="floatingHero"
            className="mx-auto max-w-[946px] text-center font-normal leading-[1.2] tracking-[0.02em] text-bark"
          >
            Antkakliai, kurie pritampa prie kiekvieno nuotykio
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

      </div>
    </section>
  );
}
