import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation helpers. Use these instead of `next/link` /
// `next/navigation` inside components that are ONLY ever rendered within
// the `[locale]` route segment (i.e. have a NextIntlClientProvider
// ancestor) — they automatically prefix hrefs with the current locale
// (e.g. `/en/products`) instead of emitting a bare `/products` path.
//
// Components rendered on non-migrated routes too (LandingNav, LandingFooter,
// LanguageSwitcher, ProductCard, CartDrawer, CartUpsell, CatalogCard,
// PrimaryButton, etc.) must NOT use these — `useLocale()`/`useRouter()` here
// throw outside a NextIntlClientProvider context. Those keep plain
// `next/link` / `next/navigation` with the manual path-segment locale check.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
