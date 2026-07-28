"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { DisplayHeading, Eyebrow } from "@/components/storefront/Typography";
import { trackGaEvent } from "@/components/shared/GoogleAnalytics";
import { cn } from "@/lib/utils";
import { HARDWARE_COLOUR, type CharmSpec } from "@/lib/collar3d";

const Collar3DScene = dynamic(() => import("@/components/products/Collar3DScene"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 13, color: "var(--color-bark-muted)" }}>Kraunama 3D peržiūra…</span>
    </div>
  ),
});

const HERO_STICKERS = {
  collar: "/hero-figma/hero-sticker-collar.png",
  paw: "/hero-figma/hero-sticker-paw.png",
  letterS: "/hero-figma/hero-sticker-s.png",
};

const DEMO_NAME = "ROCKY";
const DEMO_COLOURS = ["#B8D8F4", "#6B9FD4", "#D4B8F4", "#F4B5C0", "#F9E4A0"];
const DEMO_ITEMS: CharmSpec[] = DEMO_NAME.split("").map((ch, i) => ({
  meshKey: ch,
  colour: DEMO_COLOURS[i % DEMO_COLOURS.length],
  kind: "letter" as const,
}));

interface FloatingHeroProps {
  className?: string;
}

export function FloatingHero({ className }: FloatingHeroProps) {
  const stickersRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const mountedCountRef = useRef(DEMO_ITEMS.length);
  
  const [mountedCount, setMountedCount] = useState(DEMO_ITEMS.length);
  const [progress, setProgress] = useState(0);
  // Separate progress state for mobile (plain scroll, not GSAP)
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;
    const stickers = stickersRef.current;
    let gsapCleanup: (() => void) | null = null;
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const isDesktopQuery = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktopQuery) {
        mountedCountRef.current = 0;
        setMountedCount(0);
        setProgress(0);

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=960",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          onUpdate: (self: any) => {
            setProgress(self.progress);
            const nextCount = Math.round(self.progress * DEMO_ITEMS.length);
            if (nextCount === mountedCountRef.current) return;
            mountedCountRef.current = nextCount;
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
              setMountedCount(nextCount);
              frameRef.current = null;
            });
          },
        });

        // Stickers floating animation (desktop only)
        const stickersTweens: gsap.core.Tween[] = [];
        if (stickers) {
          const floatingItems = stickers.querySelectorAll<HTMLElement>("[data-hero-float]");
          floatingItems.forEach((el, i) => {
            const tween = gsap.to(el, {
              y: "+=16",
              duration: 2.6 + i * 0.4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 0.3,
            });
            stickersTweens.push(tween);
          });
        }

        gsapCleanup = () => {
          trigger.kill();
          stickersTweens.forEach((t) => t.kill());
        };
      } else {
        // Mobile: No pinning or ScrollTrigger to ensure buttery-smooth scrolling
        mountedCountRef.current = DEMO_ITEMS.length;
        setMountedCount(DEMO_ITEMS.length);
        setMobileScrollProgress(0);
        setProgress(0);
        gsapCleanup = () => {};
      }
    });

    return () => {
      cancelled = true;
      if (gsapCleanup) gsapCleanup();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const items = useMemo(() => DEMO_ITEMS.slice(0, mountedCount), [mountedCount]);
  
  const modelRotation = useMemo<[number, number, number]>(() => {
    const tiltX = 0.16 - progress * 0.24;
    const spinY = -0.42 + progress * 0.96;
    const tiltZ = 0.08 - progress * 0.18;
    return [tiltX, spinY, tiltZ];
  }, [progress]);

  // Scale: desktop zooms in more, mobile zooms gently
  const modelScale = useMemo(() => {
    const isDesktopQuery = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    if (isDesktopQuery) {
      return 1.15 + progress * 0.55;
    } else {
      return 0.75 + progress * 0.2;
    }
  }, [progress]);
  
  // Position centers model vertically on mobile, and offsets on desktop scroll
  const modelPosition = useMemo<[number, number, number]>(() => {
    const isDesktopQuery = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    if (isDesktopQuery) {
      return [0, -0.06 + progress * 0.16, 0];
    } else {
      return [0, 0, 0];
    }
  }, [progress]);

  // Desktop: fade driven by GSAP pinned scroll progress
  const desktopTextOpacity = useMemo(() => Math.max(0, 1 - progress * 2.2), [progress]);
  const desktopTextTranslateY = useMemo(() => -progress * 60, [progress]);
  // Mobile: fade driven by plain window.scrollY (no GSAP, no conflicts)
  const mobileTextOpacity = useMemo(() => Math.max(0, 1 - mobileScrollProgress * 2.0), [mobileScrollProgress]);
  const mobileTextTranslateY = useMemo(() => -mobileScrollProgress * 40, [mobileScrollProgress]);

  return (
    <section
      ref={sectionRef}
      className={cn("relative px-4 pt-[96px] pb-6 md:px-6 md:pt-[120px] md:pb-16 lg:pt-[132px] lg:pb-20 min-h-[100dvh] flex flex-col justify-between", className)}
      style={{
        background: "linear-gradient(180deg, #e3ecf5 0%, #b8d8f4 100%)",
        marginTop: "-88px",
        overflow: "clip",
      }}
    >
      {/* 3D Collar Stage — Desktop layout: hidden on mobile via CSS, direct absolute child, offset down so it clears the header content above it */}
      <div className="hidden md:block absolute inset-x-0 bottom-0 top-[28%] z-0 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <Collar3DScene
            items={items}
            strapColour="#6B9FD4"
            hardwareColour={HARDWARE_COLOUR}
            modelRotation={modelRotation}
            modelScale={modelScale}
            modelPosition={modelPosition}
            interactive={progress < 0.1}
            fitMargin={1.3}
          />
        </div>
      </div>

      {/* Floating Stickers Background — Desktop only */}
      <div ref={stickersRef} className="hidden md:block pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div 
          data-hero-sticker 
          className="absolute left-[3%] top-[15%] w-[170px] -rotate-[17deg]"
          style={{ opacity: desktopTextOpacity }}
        >
          <div data-hero-float>
            <Image src={HERO_STICKERS.collar} alt="" width={238} height={238} className="h-auto w-full" priority />
          </div>
        </div>
        <div 
          data-hero-sticker 
          className="absolute right-[8%] top-[50%] w-[120px] -rotate-[23deg]"
          style={{ opacity: desktopTextOpacity }}
        >
          <div data-hero-float>
            <Image src={HERO_STICKERS.paw} alt="" width={144} height={144} className="h-auto w-full" />
          </div>
        </div>
        <div 
          data-hero-sticker 
          className="absolute left-[10%] top-[55%] w-[140px] -rotate-[17deg]"
          style={{ opacity: desktopTextOpacity }}
        >
          <div data-hero-float>
            <Image src={HERO_STICKERS.letterS} alt="" width={222} height={222} className="h-auto w-full" />
          </div>
        </div>
      </div>

      {/* Pinned content overlays */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-between min-h-[500px]">
        
        {/* Hero Header Content */}
        <div 
          className="flex flex-col items-center gap-6 text-center transition-all duration-75 [opacity:var(--mob-opacity)] [transform:translateY(var(--mob-ty))] md:[opacity:var(--dsk-opacity)] md:[transform:translateY(var(--dsk-ty))]"
          style={{ 
            "--mob-opacity": mobileTextOpacity,
            "--mob-ty": `${mobileTextTranslateY}px`,
            "--dsk-opacity": desktopTextOpacity,
            "--dsk-ty": `${desktopTextTranslateY}px`,
          } as React.CSSProperties}
        >
          <Eyebrow className="text-interactive-text">Šunų antkakliai su vardu</Eyebrow>
          <DisplayHeading
            as="h1"
            size="floatingHero"
            className="mx-auto max-w-[946px] font-normal leading-[1.15] md:leading-[1.1] tracking-[0.02em] text-bark"
            style={{ fontSize: "clamp(30px, 6vw, 64px)" }}
          >
            Antkakliai, kurie pritampa prie kiekvieno nuotykio
          </DisplayHeading>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#customize"
              onClick={() => trackGaEvent('cta_click', { cta_id: 'hero_buy_now', cta_location: 'hero' })}
              className="btn-press whitespace-nowrap rounded-full bg-white px-8 py-4 text-base font-bold text-bark no-underline shadow-lg shadow-bark/5 hover:bg-cream transition-colors"
            >
              Pirkti dabar
            </Link>
          </div>
        </div>

        {/* 3D Collar Stage — Mobile layout: hidden on desktop via CSS, inline in flex flow */}
        <div className="block md:hidden relative w-full flex-1 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full min-h-[340px] pointer-events-auto">
            <Collar3DScene
              items={items}
              strapColour="#6B9FD4"
              hardwareColour={HARDWARE_COLOUR}
              modelRotation={modelRotation}
              modelScale={modelScale}
              modelPosition={modelPosition}
              interactive={true}
              fitMargin={1.1}
              autoRotate={true}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
