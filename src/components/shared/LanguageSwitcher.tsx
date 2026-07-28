'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { isLocalizedPath } from '@/lib/locale-path';

const LOCALE_LABEL: Record<string, string> = { lt: 'LT', en: 'EN' };

/** Lithuanian tricolour — yellow/green/red horizontal bands. */
function FlagLT() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" className="rounded-[2px]">
      <rect width="16" height="4" y="0" fill="#FDB913" />
      <rect width="16" height="4" y="4" fill="#006A44" />
      <rect width="16" height="4" y="8" fill="#C1272D" />
    </svg>
  );
}

/** UK Union Jack, simplified for small display sizes. */
function FlagGB() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" className="rounded-[2px]">
      <rect width="16" height="12" fill="#00247D" />
      <path d="M0 0 16 12M16 0 0 12" stroke="#fff" strokeWidth="2.4" />
      <path d="M0 0 16 12M16 0 0 12" stroke="#CF142B" strokeWidth="1.2" />
      <path d="M8 0V12M0 6H16" stroke="#fff" strokeWidth="4" />
      <path d="M8 0V12M0 6H16" stroke="#CF142B" strokeWidth="2.2" />
    </svg>
  );
}

const LOCALE_FLAG: Record<string, () => React.JSX.Element> = { lt: FlagLT, en: FlagGB };

interface LanguageSwitcherProps {
  /** Pass through when the switcher lives inside a hidden/offscreen container
   * (e.g. the mobile menu overlay) so it stays out of the tab order while
   * closed, matching the sibling links in that same block. */
  tabIndex?: number;
}

// LanguageSwitcher is rendered inside LandingNav, which is imported directly
// by non-migrated pages (/faq, /cart, /checkout) that sit outside the
// `[locale]` route segment and have no NextIntlClientProvider ancestor.
// Calling next-intl's useLocale() here throws ("No intl context found") on
// those routes. So instead of the hook, resolve the locale from the URL's
// path segment, mirroring the same check CartDrawer/LandingNav/LandingFooter
// use (`/en/...` → en, everything else → lt).
export function LanguageSwitcher({ tabIndex }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const locale = pathname?.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'lt';
  const router = useRouter();

  // Hide entirely on routes with no English counterpart (/faq, /cart,
  // /checkout, /account, /pavadeliai, /guide/*, etc.) — switching there would
  // 404 and would still cookie-pin the visitor to English on a page that has
  // no English version.
  if (!pathname || !isLocalizedPath(pathname)) {
    return null;
  }

  const nextLocale = locale === 'lt' ? 'en' : 'lt';
  const Flag = LOCALE_FLAG[nextLocale];

  const handleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    const segments = (pathname ?? '').split('/').filter(Boolean);
    const withoutLocalePrefix = segments[0] === 'en' ? segments.slice(1) : segments;
    const nextPath = nextLocale === 'en'
      ? `/en${withoutLocalePrefix.length ? `/${withoutLocalePrefix.join('/')}` : ''}`
      : `/${withoutLocalePrefix.join('/')}`;

    router.push(nextPath || '/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      aria-label={`Switch language to ${LOCALE_LABEL[nextLocale]}`}
      tabIndex={tabIndex}
      className="flex items-center gap-1.5 text-sm font-medium text-bark-muted transition-colors hover:text-bark"
    >
      <Flag />
      {LOCALE_LABEL[nextLocale]}
      <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}
