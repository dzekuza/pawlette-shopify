'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SocialTicker } from './landing/SocialTicker';
import { LandingNav } from './landing/LandingNav';
import { FloatingHero } from './ui/hero-floating';
import { FeaturesStrip } from './landing/FeaturesStrip';
import { ProductGrid } from './landing/ProductGrid';
import { getLandingCollars, type LandingCollar } from '@/lib/db';
import { CharmGrid } from './landing/CharmGrid';
import { PhotoSlider } from './landing/PhotoSlider';
import { BentoSection } from './BentoSection';
import { Reviews } from './landing/Reviews';
import { FAQ } from './landing/FAQ';
import { LandingFooter } from './landing/LandingFooter';
import { StickyCTA } from './landing/StickyCTA';
import { ExitModal } from './landing/ExitModal';

export function LandingPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const items = JSON.parse(localStorage.getItem('pawlette_cart') || '[]');
        setCartCount(Array.isArray(items) ? items.length : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const exitShown = useRef(false);
  const [collars, setCollars] = useState<LandingCollar[]>([]);

  useEffect(() => {
    getLandingCollars().then((data) => { if (data.length > 0) setCollars(data); });
  }, []);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setShowStickyCTA(window.scrollY > 500);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (e.clientY < 20 && !exitShown.current) {
        setShowExitModal(true);
        exitShown.current = true;
      }
    };
    document.addEventListener('mouseleave', fn);
    return () => document.removeEventListener('mouseleave', fn);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mm: any = null;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!pageRef.current) return;
        gsap.registerPlugin(ScrollTrigger);
        mm = gsap.matchMedia();

        mm.add(
          {
            allowMotion: '(prefers-reduced-motion: no-preference)',
            reduceMotion: '(prefers-reduced-motion: reduce)',
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (context: any) => {
            const { allowMotion } = context.conditions as { allowMotion?: boolean };
            if (!allowMotion) return;

            const q = gsap.utils.selector(pageRef);
            const sections = q('[data-animate="section"]');
            const cards = q('[data-animate="card"]');
            const photoSlider = q('[data-parallax="photo-slider"]');

            sections.forEach((section) => {
              gsap.from(section, {
                autoAlpha: 0, y: 40, duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: 'play none none none', once: true },
              });
            });

            const onLoad = () => ScrollTrigger.refresh();
            if (document.readyState === 'complete') {
              ScrollTrigger.refresh();
            } else {
              window.addEventListener('load', onLoad, { once: true });
            }

            ScrollTrigger.batch(cards, {
              start: 'top 88%',
              once: true,
              onEnter: (batch) => {
                gsap.from(batch, {
                  autoAlpha: 0, y: 24, duration: 0.55, ease: 'power2.out',
                  stagger: 0.08, overwrite: 'auto', clearProps: 'transform,opacity,visibility',
                });
              },
            });

            if (photoSlider[0]) {
              gsap.fromTo(photoSlider[0], { y: 18 }, {
                y: -18, ease: 'none',
                scrollTrigger: { trigger: photoSlider[0], start: 'top bottom', end: 'bottom top', scrub: 1 },
              });
            }
          }
        );
      }
    );

    return () => { mm?.revert(); };
  }, []);

  return (
    <div ref={pageRef} style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <SocialTicker />
      <LandingNav cartCount={cartCount} onCart={() => router.push('/cart')} />

      <FloatingHero />

      <div data-animate="section"><FeaturesStrip variant="cream" /></div>
      <div data-animate="section"><ProductGrid collars={collars} /></div>
      <div data-animate="section"><CharmGrid /></div>
      <div data-animate="section" data-parallax="photo-slider"><PhotoSlider /></div>
      <div data-animate="section"><BentoSection isDark={false} /></div>
      <div data-animate="section"><Reviews /></div>
      <div data-animate="section"><FAQ /></div>
      <div data-animate="section"><LandingFooter /></div>

      <StickyCTA visible={showStickyCTA} />
      {showExitModal && <ExitModal onClose={() => setShowExitModal(false)} />}
    </div>
  );
}
