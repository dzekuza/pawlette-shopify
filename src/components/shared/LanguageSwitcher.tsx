'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const LOCALE_LABEL: Record<string, string> = { lt: 'LT', en: 'EN' };

interface LanguageSwitcherProps {
  /** Pass through when the switcher lives inside a hidden/offscreen container
   * (e.g. the mobile menu overlay) so it stays out of the tab order while
   * closed, matching the sibling links in that same block. */
  tabIndex?: number;
}

export function LanguageSwitcher({ tabIndex }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === 'lt' ? 'en' : 'lt';

  const handleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    const segments = pathname.split('/').filter(Boolean);
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
