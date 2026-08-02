'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCartCount } from '@/hooks/useCartCount';
import { LandingNav } from './landing/LandingNav';
import { TopBar } from './landing/TopBar';
import { FloatingHero } from './ui/hero-floating';
import { ProductGrid } from './landing/ProductGrid';
import { getLandingProducts, getLandingProductsSync, type ProductDetail } from '@/lib/db';
import { PhotoSlider } from './landing/PhotoSlider';
import { FAQ } from './landing/FAQ';
import { HowItWorks } from './landing/HowItWorks';
import { LandingBuySection } from './landing/LandingBuySection';
import { FeaturesStrip } from './landing/FeaturesStrip';
import { LandingFooter } from './landing/LandingFooter';
import { NewsletterSignup } from './landing/NewsletterSignup';
import { StickyCTA } from './landing/StickyCTA';
import { StickyVideoWidget } from './landing/StickyVideoWidget';
import { ExitModal } from './landing/ExitModal';

export function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartCount();
  const locale = useLocale();
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const exitShown = useRef(false);
  const [products, setProducts] = useState<ProductDetail[]>(() => getLandingProductsSync(locale) ?? []);

  useEffect(() => {
    getLandingProducts(locale).then((data) => { if (data.length > 0) setProducts(data); });
  }, [locale]);
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

            gsap.set(sections, { autoAlpha: 0, y: 20 });
            gsap.set(cards, { autoAlpha: 0, y: 16 });

            sections.forEach((section) => {
              gsap.to(section, {
                autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
                clearProps: 'transform,opacity,visibility',
                scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none', once: true },
              });
            });

            if (document.readyState === 'complete') {
              ScrollTrigger.refresh();
            } else {
              window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
            }

            ScrollTrigger.batch(cards, {
              start: 'top 80%',
              once: true,
              onEnter: (batch) => {
                gsap.to(batch, {
                  autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out',
                  stagger: 0.05, overwrite: 'auto', clearProps: 'transform,opacity,visibility',
                });
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
      <TopBar />
      <LandingNav cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main>
        <FloatingHero />

        <div data-animate="section"><ProductGrid products={products} /></div>
        <div data-animate="section"><HowItWorks /></div>
        <div data-animate="section"><FeaturesStrip /></div>
        <div data-animate="section"><LandingBuySection /></div>
        <div data-animate="section"><PhotoSlider /></div>
        <div data-animate="section"><FAQ /></div>
        <div data-animate="section"><NewsletterSignup /></div>
      </main>

      <div data-animate="section"><LandingFooter /></div>

      <StickyCTA visible={showStickyCTA} />
      <StickyVideoWidget bottomOffset={showStickyCTA ? 90 : 0} />
      {showExitModal && <ExitModal onClose={() => setShowExitModal(false)} />}
    </div>
  );
}
