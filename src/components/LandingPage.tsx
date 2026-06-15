'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCartCount } from '@/hooks/useCartCount';
import { LandingNav } from './landing/LandingNav';
import { FloatingHero } from './ui/hero-floating';
import { FeaturesStrip } from './landing/FeaturesStrip';
import { ProductGrid } from './landing/ProductGrid';
import { getLandingProducts, getLandingProductsSync, type ProductDetail } from '@/lib/db';
import { CharmGrid } from './landing/CharmGrid';
import { FAQ } from './landing/FAQ';
import { About } from './landing/About';
import { LandingFooter } from './landing/LandingFooter';
import { StickyCTA } from './landing/StickyCTA';
import { ExitModal } from './landing/ExitModal';
import { useWindowWidth } from '@/hooks/useWindowWidth';

function StatementSection() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section style={{ background: 'var(--color-bark)', color: 'var(--color-cream)' }}>
      <div style={{
        maxWidth: 1292,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '80px 64px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 32 : 48,
      }}>
        {/* Large centered statement */}
        <h2 style={{
          fontFamily: "'Luckiest Guy', cursive",
          fontSize: isMobile ? 'clamp(28px, 5vw, 40px)' : 56,
          letterSpacing: '0.02em',
          lineHeight: '115%',
          textAlign: 'center',
          margin: 0,
          maxWidth: 900,
          alignSelf: 'center',
          color: 'var(--color-cream)',
        }}>
          Sukūrėme PawCharms — lengvai <span style={{ color: 'var(--color-sage)' }}>personalizuojamus</span> antkaklių rinkinius jūsų šuniui.
        </h2>

        {/* Full-width image */}
        <div style={{
          borderRadius: 24,
          overflow: 'hidden',
          aspectRatio: isMobile ? '4/3' : '16/7',
          background: 'var(--color-surface-2)',
        }}>
          <img
            src="/A_man_and_a_woman_sit_on_a_couch_with_a_small_wj6F8xDr.webp"
            alt="PawCharms šeima"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartCount();
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const exitShown = useRef(false);
  const [products, setProducts] = useState<ProductDetail[]>(() => getLandingProductsSync() ?? []);

  useEffect(() => {
    getLandingProducts().then((data) => { if (data.length > 0) setProducts(data); });
  }, []);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const fn = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setShowStickyCTA(window.scrollY > 500));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (e.clientY < 20 && !exitShown.current && window.scrollY > 300) {
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
    const page = pageRef.current;
    const animatedSections = Array.from(page.querySelectorAll<HTMLElement>('[data-animate="section"]'));
    const animatedCards = Array.from(page.querySelectorAll<HTMLElement>('[data-animate="card"]'));

    animatedSections.forEach((section) => {
      section.style.opacity = '1';
      section.style.visibility = 'visible';
      section.style.transform = 'none';
    });

    animatedCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      card.style.transform = 'none';
    });

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

            sections.forEach((section) => {
              gsap.fromTo(section,
                { autoAlpha: 0, y: 20 },
                {
                  autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
                  clearProps: 'transform,opacity,visibility',
                  immediateRender: false,
                  scrollTrigger: { trigger: section, start: 'top 84%', toggleActions: 'play none none none', once: true },
                }
              );
            });

            if (document.readyState === 'complete') {
              ScrollTrigger.refresh();
            } else {
              window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
            }

            ScrollTrigger.batch(cards, {
              start: 'top 84%',
              once: true,
              onEnter: (batch) => {
                gsap.fromTo(batch,
                  { autoAlpha: 0, y: 16 },
                  {
                    autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out',
                    stagger: 0.05, overwrite: 'auto', clearProps: 'transform,opacity,visibility',
                    immediateRender: false,
                  }
                );
              },
            });
          }
        );
      }
    );

    return () => {
      mm?.revert();
      animatedSections.forEach((section) => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.transform = 'none';
      });
      animatedCards.forEach((card) => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
      });
    };
  }, [pathname]);

  return (
    <div ref={pageRef} style={{ fontFamily: "'DM Sans',sans-serif", background: 'var(--color-cream)' }}>
      <LandingNav cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main>
        <FloatingHero />

        <div data-animate="section"><StatementSection /></div>
        <div data-animate="section"><ProductGrid products={products} /></div>
        <div data-animate="section"><About variant="cream" /></div>
        <div data-animate="section"><CharmGrid /></div>
        <div data-animate="section"><FAQ /></div>
      </main>

      <div data-animate="section"><LandingFooter /></div>

      <StickyCTA visible={showStickyCTA} />
      {showExitModal && <ExitModal onClose={() => setShowExitModal(false)} />}
    </div>
  );
}
