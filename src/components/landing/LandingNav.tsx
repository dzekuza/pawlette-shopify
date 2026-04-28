'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowWidth } from '@/hooks/useWindowWidth';

const NAV_LINKS = [
  { label: 'Antkakliai', href: '/products' },
  { label: 'Rinkiniai', href: '/sets' },
  { label: 'Pakabukai', href: '/products/charm-charms' },
  { label: 'Dydžių gidas', href: '/guide/how-to-measure-dog-collar' },
  { label: 'Priežiūra ir medžiagos', href: '/guide/silicone-vs-nylon-dog-collars' },
  { label: 'FAQ', href: '/faq' },
];

const DESKTOP_NAV = [
  { label: 'Parduotuvė', href: '/products' },
  { label: 'Rinkiniai', href: '/sets' },
  { label: 'Pakabukai', href: '/products/charm-charms' },
  { label: 'Priežiūra', href: '/guide/silicone-vs-nylon-dog-collars' },
];

interface LandingNavProps {
  cartCount?: number;
  onCart?: () => void;
  topOffset?: number;
}

export function LandingNav({ cartCount = 0, onCart, topOffset = 36 }: LandingNavProps) {
  const width = useWindowWidth() ?? 1200;
  const isMobile = width < 768;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const active = scrolled || menuOpen;

  return (
    <>
      <header
        style={{ top: topOffset }}
        className={cn(
          'fixed left-0 right-0 z-[200] h-16 flex items-center px-5 md:px-10',
          'transition-[background,backdrop-filter,border-color] duration-250 ease-[ease]',
          'border-b',
          active
            ? 'bg-cream/97 backdrop-blur-[16px] border-border'
            : 'bg-transparent backdrop-blur-none border-transparent'
        )}
      >
        <div className="grid items-center grid-cols-[1fr_auto_1fr] w-full mx-auto" style={{ maxWidth: 1200 }}>
        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-8">
          {DESKTOP_NAV.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="font-sans text-sm font-medium text-bark-muted no-underline transition-colors duration-150 hover:text-bark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            aria-expanded={menuOpen}
            className="bg-transparent border-0 cursor-pointer p-2 text-bark flex flex-col gap-[5px] items-center justify-center w-9 h-9"
          >
            <span
              className="block w-5 h-[1.5px] bg-bark rounded-[2px] transition-[transform,opacity] duration-250 ease-[ease]"
              style={{ transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-[1.5px] bg-bark rounded-[2px] transition-opacity duration-250 ease-[ease]"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-[1.5px] bg-bark rounded-[2px] transition-[transform,opacity] duration-250 ease-[ease]"
              style={{ transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>

        <Link href="/" aria-label="Žavesys home" className="flex items-center justify-center">
          <img src="/pawcharms.svg" alt="Žavesys" className="h-11 w-auto block" />
        </Link>

        <div className="flex items-center gap-1 justify-end">
          <Link
            href="/account"
            aria-label="Paskyra"
            className="p-2 text-bark transition-colors duration-150 hover:text-sage"
          >
            <CircleUserRound className="h-5 w-5" strokeWidth={1.75} />
          </Link>

          {/* Cart button */}
          <button onClick={onCart} aria-label="Krepšelis" className="relative p-2 bg-transparent border-0 cursor-pointer text-bark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-sage text-interactive-text text-[10px] font-semibold flex items-center justify-center font-sans">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <div
        aria-hidden={!menuOpen}
        className="fixed inset-0 z-[199] bg-cream flex flex-col justify-center px-10 transition-opacity duration-250 ease-[ease]"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-[clamp(36px,8vw,64px)] text-bark no-underline leading-[1.15] transition-[color,transform] duration-150 ease-[ease] block hover:text-sage"
              style={{
                transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: menuOpen ? `${i * 40}ms` : '0ms',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          className="absolute left-10 right-10 flex justify-between items-center"
          style={{
            bottom: isMobile ? 28 : 40,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 10 : 0,
          }}
        >
          <span className="font-sans text-[13px] text-bark-muted">Pagaminta Vilniuje, Lietuvoje</span>
          <a
            href="mailto:hello@pawcharms.lt"
            className="font-sans text-[13px] text-bark-muted no-underline transition-colors duration-150 hover:text-bark"
          >
            hello@pawcharms.lt
          </a>
        </div>
      </div>
    </>
  );
}
