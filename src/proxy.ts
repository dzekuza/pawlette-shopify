import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// ---------------------------------------------------------------------------
// Legacy ASCII product-slug redirects (pre-existing, unrelated to i18n)
// ---------------------------------------------------------------------------
// Product slugs must be ASCII-only. Some old charm slugs were generated straight
// from raw Lithuanian titles (e.g. "charm-sirdis-rozine" with diacritics restored)
// and Next's automatic x-next-cache-tags header throws when a route segment
// contains non-ASCII bytes, crashing the whole request with a 500 before the page
// even renders. Catching this here (proxy runs before rendering) is the only place
// that can intercept it — redirect to the ASCII-normalized slug instead of crashing.
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g');

// Leash color slugs used to be built by stripping any character outside [a-z0-9-] instead of
// transliterating it, so diacritics were silently deleted rather than converted (e.g. "Mėlyna"
// lost its "ė" entirely, becoming "mlyna" instead of "melyna") — and the adjective wasn't
// grammatically agreed with "leash" the way collar handles already were ("geltona" vs "geltonas").
// Google indexed these broken URLs; redirect them to the corrected slugs instead of 404ing.
const LEGACY_PRODUCT_SLUG_REDIRECTS: Record<string, string> = {
  'geltona-leash': 'geltonas-leash',
  'mlyna-leash': 'melynas-leash',
  'roin-leash': 'rozinis-leash',
  'violetin-leash': 'violetinis-leash',
  'tamsiai-mlyna-leash': 'tamsiai-melynas-leash',
};

function slugifyAscii(input: string): string {
  return input
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Returns a redirect response if `request` targets a legacy/broken product
 * slug, otherwise `null` to signal "no redirect needed — continue".
 */
function legacyProductSlugRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/products\/([^/]+)$/);
  if (!match) return null;

  const rawSlug = decodeURIComponent(match[1]);

  const legacySlug = LEGACY_PRODUCT_SLUG_REDIRECTS[rawSlug];
  if (legacySlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/products/${legacySlug}`;
    return NextResponse.redirect(url, 308);
  }

  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(rawSlug)) return null;

  const url = request.nextUrl.clone();
  url.pathname = `/products/${slugifyAscii(rawSlug)}`;
  return NextResponse.redirect(url, 308);
}

// ---------------------------------------------------------------------------
// Locale routing
// ---------------------------------------------------------------------------
// The Lithuanian site lives at `/` and English at `/en`. `routing.localeDetection`
// is off, so `/` is always served as-is — no redirect to `/en` based on a
// NEXT_LOCALE cookie, Accept-Language or the visitor's IP country. English is
// reached only through an explicit `/en` link or the language switcher.
const intlMiddleware = createIntlMiddleware(routing);

// ---------------------------------------------------------------------------
// Entry point — Next.js 16 uses `proxy.ts` (the renamed `middleware.ts`) and,
// with a `src/` layout, only reads it from inside `src/`; only one proxy file
// is supported per project, so the legacy slug-redirect logic above and the
// locale routing below must live in this single exported function.
// ---------------------------------------------------------------------------
export function proxy(request: NextRequest) {
  const legacyRedirect = legacyProductSlugRedirect(request);
  if (legacyRedirect) return legacyRedirect;

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/en',
    '/products/:path*',
    '/en/products/:path*',
  ],
};
