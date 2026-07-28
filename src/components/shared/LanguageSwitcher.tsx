'use client';

import { usePathname, useRouter } from 'next/navigation';
import { isLocalizedPath } from '@/lib/locale-path';

const LOCALE_LABEL: Record<string, string> = { lt: 'LT', en: 'EN' };

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
      className="text-sm font-medium text-bark-muted transition-colors hover:text-bark"
    >
      {LOCALE_LABEL[nextLocale]}
    </button>
  );
}
