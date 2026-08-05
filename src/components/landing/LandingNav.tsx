'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Gift } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer';
import { GIFT_MODAL_OPEN_EVENT } from '@/components/shared/ScratchGiftWidget';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import ltMessages from '@/messages/lt.json';
import enMessages from '@/messages/en.json';
import { localizeHref } from '@/lib/locale-path';

// LandingNav is imported directly by non-migrated pages (/faq, /cart,
// /checkout) that sit outside the `[locale]` route segment and have no
// NextIntlClientProvider ancestor. Calling next-intl's useTranslations()
// here throws ("No intl context found") on those routes. So instead of the
// hook, resolve copy from a plain object keyed by the URL's locale prefix,
// mirroring the same segment check CartDrawer/LanguageSwitcher use
// (`/en/...` → en, everything else → lt).
const NAV_STRINGS = { lt: ltMessages.landing.nav, en: enMessages.landing.nav };

const NAV_LINK_HREFS = [
  { key: 'collars', href: '/products/pawcharms-antkaklis' },
  { key: 'leashes', href: '/products/pawcharms-pavadelis' },
  { key: 'charms', href: '/products/pawcharms-pakabuciai' },
] as const;

interface LandingNavProps {
  cartCount?: number;
  /** @deprecated unused — the cart icon now opens the global CartDrawer instead of navigating. Kept for backwards compatibility with callers. */
  onCart?: () => void;
  /** @deprecated unused — kept for backwards compatibility with callers */
  topOffset?: number;
}

export function LandingNav({ cartCount = 0 }: LandingNavProps) {
  const pathname = usePathname();
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt';
  const t = NAV_STRINGS[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = localizeHref('/', locale);
  const shopHref = localizeHref('/products', locale);
  const navLinks = NAV_LINK_HREFS.map(({ key, href }) => ({
    label: t.links[key],
    href: localizeHref(href, locale),
  }));

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncMenuState = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    syncMenuState(mediaQuery);
    mediaQuery.addEventListener('change', syncMenuState);
    return () => mediaQuery.removeEventListener('change', syncMenuState);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[200]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-2 overflow-clip rounded-full border border-bark/[0.06] bg-cream py-3 pl-4 pr-3 shadow-[0_1px_2px_rgba(61,53,48,0.04)]">
            <Link href={homeHref} aria-label={t.homeAriaLabel} className="shrink-0 leading-none">
              <Image src="/pawcharms.svg" alt="PawsCharm" width={84} height={42} priority className="block h-[42px] w-auto" />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-7 md:flex">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="group relative whitespace-nowrap py-1 text-sm font-medium text-bark-light no-underline transition-colors hover:text-bark"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] scale-x-0 rounded-full bg-sage-dark transition-transform duration-200 ease-out group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            {/* Right: cart + CTA */}
            <div className="flex items-center gap-1">
              {/* Language switcher */}
              <LanguageSwitcher />

              {/* Gift */}
              <button
                onClick={() => window.dispatchEvent(new Event(GIFT_MODAL_OPEN_EVENT))}
                aria-label={t.giftAriaLabel}
                className="flex h-9 w-9 items-center justify-center rounded-full text-bark transition-colors hover:bg-bark/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark/30"
              >
                <Gift className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))}
                aria-label={t.cartAriaLabel}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-bark transition-colors hover:bg-bark/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark/30"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-interactive-text">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? t.closeMenuAriaLabel : t.openMenuAriaLabel}
                aria-expanded={menuOpen}
                className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-bark/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bark/30 md:hidden"
              >
                <span
                  className="block h-[1.5px] w-5 rounded-sm bg-bark transition-transform duration-[250ms] ease-out"
                  style={{ transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
                />
                <span
                  className="block h-[1.5px] w-5 rounded-sm bg-bark transition-opacity duration-[250ms] ease-out"
                  style={{ opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="block h-[1.5px] w-5 rounded-sm bg-bark transition-transform duration-[250ms] ease-out"
                  style={{ transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
                />
              </button>

              {/* Shop now CTA */}
              <PrimaryButton href={shopHref} variant="sage" size="md" className="ml-1 hidden md:inline-flex">
                {t.shopNow}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 199,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 250ms ease-out',
        }}
        className="flex flex-col justify-center bg-cream px-10 md:hidden"
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              className="block font-display leading-[1.15] text-bark no-underline transition-colors"
              style={{
                fontSize: 'clamp(36px, 8vw, 64px)',
                transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: `color 150ms ease-out, transform 250ms ease-out ${i * 40}ms`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="absolute inset-x-10 bottom-7 flex items-center justify-between gap-3">
          <span className="text-[13px] text-bark-muted">{t.madeIn}</span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher tabIndex={menuOpen ? 0 : -1} />
            <a
              href="mailto:hello@pawscharm.com"
              tabIndex={menuOpen ? 0 : -1}
              className="text-[13px] text-bark-muted no-underline"
            >
              hello@pawscharm.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
