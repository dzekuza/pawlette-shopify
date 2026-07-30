// Shared helpers for components that must resolve/apply locale WITHOUT
// next-intl's context-dependent hooks (useLocale/useTranslations/createNavigation's
// Link), because they're rendered on routes outside the `[locale]` segment
// too (/faq, /cart, /checkout, /account, /pavadeliai) where there is no
// NextIntlClientProvider ancestor. See LanguageSwitcher.tsx, LandingNav.tsx,
// LandingFooter.tsx, ProductCard.tsx, CartDrawer.tsx, CartUpsell.tsx.

// Routes that have been migrated under the `[locale]` segment and therefore
// have a working `/en/...` counterpart. Every other route (/faq, /cart,
// /checkout, /account, /pavadeliai, /guide/*, etc.) has no English version.
export const PHASE_1_LOCALIZED_PREFIXES = ['/', '/products'] as const;

/** Does `pathname` (bare or `/en`-prefixed) fall under a migrated Phase-1 route? */
export function isLocalizedPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (withoutLocale === '/') return true;
  return PHASE_1_LOCALIZED_PREFIXES.some(
    (prefix) => prefix !== '/' && (withoutLocale === prefix || withoutLocale.startsWith(`${prefix}/`)),
  );
}

/**
 * Prefixes an internal, absolute href with `/en` when `locale` is `'en'` AND
 * the href points at a migrated Phase-1 route. Hrefs to non-migrated routes
 * (e.g. `/faq#orders`, `/guide/...`) are left bare on purpose — there's no
 * English page to send the visitor to. `mailto:`/external/relative hrefs are
 * passed through unchanged.
 */
export function localizeHref(href: string, locale: 'lt' | 'en'): string {
  if (locale !== 'en') return href;
  if (!href.startsWith('/') || href.startsWith('/en/') || href === '/en') return href;
  if (!isLocalizedPath(href)) return href;
  return href === '/' ? '/en' : `/en${href}`;
}
