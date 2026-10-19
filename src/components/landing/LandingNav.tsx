'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Gift, ShoppingBag } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { cn } from '@/lib/utils';
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

const ICON_BUTTON_CLASS =
  'relative flex h-10 w-10 items-center justify-center rounded-full text-bark transition-[background-color,transform] duration-200 ease-out hover:bg-bark/[0.07] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage';

function NavIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={ICON_BUTTON_CLASS}>
      {children}
    </button>
  );
}

export function LandingNav({ cartCount = 0 }: LandingNavProps) {
  const pathname = usePathname();
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt';
  const t = NAV_STRINGS[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const homeHref = localizeHref('/', locale);
  const shopHref = localizeHref('/products', locale);
  const navLinks = NAV_LINK_HREFS.map(({ key, href }) => {
    const localized = localizeHref(href, locale);
    return { label: t.links[key], href: localized, active: pathname === localized };
  });

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

  useEffect(() => {
    const syncScrolled = () => setScrolled(window.scrollY > 8);
    syncScrolled();
    window.addEventListener('scroll', syncScrolled, { passive: true });
    return () => window.removeEventListener('scroll', syncScrolled);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[200]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-3 md:px-6">
          <div
            className={cn(
              'grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-full border border-bark/[0.07] py-3 pl-5 pr-3 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ease-out md:grid-cols-[1fr_auto_1fr]',
              scrolled
                ? 'bg-cream/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_12px_32px_-14px_rgba(61,53,48,0.28)]'
                : 'bg-cream/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_20px_-12px_rgba(61,53,48,0.16)]',
            )}
          >
            <Link href={homeHref} aria-label={t.homeAriaLabel} className="shrink-0 justify-self-start leading-none">
              <Image src="/pawcharms.svg" alt="PawsCharm" width={84} height={42} priority className="block h-[42px] w-auto" />
            </Link>

            {/* Desktop nav links — centred between logo and actions */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium no-underline transition-colors duration-200 ease-out',
                    link.active ? 'bg-bark/[0.07] text-bark' : 'text-bark-light hover:bg-bark/[0.05] hover:text-bark',
                  )}
                >
                  {link.active && <span className="h-1.5 w-1.5 rounded-full bg-sage-dark" />}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="col-start-3 flex items-center justify-self-end md:gap-1">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <NavIconButton label={t.giftAriaLabel} onClick={() => window.dispatchEvent(new Event(GIFT_MODAL_OPEN_EVENT))}>
                <Gift className="h-[19px] w-[19px]" strokeWidth={1.75} />
              </NavIconButton>

              <NavIconButton label={t.cartAriaLabel} onClick={() => window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))}>
                <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sage px-1 text-[10px] font-semibold leading-none text-interactive-text ring-2 ring-cream">
                    {cartCount}
                  </span>
                )}
              </NavIconButton>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? t.closeMenuAriaLabel : t.openMenuAriaLabel}
                aria-expanded={menuOpen}
                className={cn(ICON_BUTTON_CLASS, 'ml-1 flex-col gap-[5px] bg-bark text-cream hover:bg-bark/90 md:hidden')}
              >
                <span
                  className={cn(
                    'block h-[1.5px] w-4 rounded-sm bg-cream transition-transform duration-[250ms] ease-out',
                    menuOpen && 'translate-y-[3.25px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'block h-[1.5px] w-4 rounded-sm bg-cream transition-transform duration-[250ms] ease-out',
                    menuOpen && '-translate-y-[3.25px] -rotate-45',
                  )}
                />
              </button>

              {/* Shop now CTA */}
              <PrimaryButton href={shopHref} variant="dark" size="md" className="ml-2 hidden md:inline-flex">
                {t.shopNow}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        aria-hidden={!menuOpen}
        className={cn(
          'fixed inset-0 z-[199] flex flex-col bg-cream px-6 pb-7 pt-28 transition-opacity duration-250 ease-out md:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav className="flex flex-col">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
              className={cn(
                'flex items-baseline gap-4 border-b border-bark/10 py-5 font-display text-[clamp(36px,10vw,56px)] leading-none text-bark no-underline transition-[transform,opacity] duration-300 ease-out',
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              )}
            >
              <span className="w-6 font-sans text-xs font-medium text-bark-muted">0{i + 1}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-5">
          <PrimaryButton href={shopHref} variant="sage" size="lg" fullWidth onClick={() => setMenuOpen(false)}>
            {t.shopNow}
          </PrimaryButton>
          <div className="flex items-center justify-between gap-3 text-[13px] text-bark-muted">
            <span>{t.madeIn}</span>
            <LanguageSwitcher tabIndex={menuOpen ? 0 : -1} />
          </div>
        </div>
      </div>
    </>
  );
}
