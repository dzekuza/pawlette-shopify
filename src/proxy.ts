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
// Locale resolution (geo + cookie + Accept-Language)
// ---------------------------------------------------------------------------
const intlMiddleware = createIntlMiddleware(routing);

// Known search/social crawler user-agents. Per product-owner decision,
// crawlers must always see the Lithuanian version at `/` regardless of the
// IP's geolocation (Googlebot crawls mostly from US IPs, which would
// otherwise geo-redirect it away from the canonical `lt` homepage) — only
// real visitors get geo-redirected. Not exhaustive, but covers the common
// search/social crawlers.
const CRAWLER_USER_AGENT = /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot/i;

function isCrawler(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') ?? '';
  return CRAWLER_USER_AGENT.test(userAgent);
}

function resolveLocale(request: NextRequest): 'lt' | 'en' {
  // If the request path is already locale-prefixed (e.g. `/en/products`),
  // that explicit prefix must win over cookie/geo/Accept-Language — otherwise
  // a Lithuania-geo visitor who opens a shared `/en` link gets bounced back
  // to `lt` on their very next navigation, even though they explicitly asked
  // for the English page. next-intl's own middleware always honors the path
  // segment already, so mirroring that here keeps our geo-derived value and
  // next-intl's negotiated value in agreement.
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments[0] === 'en') {
    return 'en';
  }

  // Search/social crawlers always get the default Lithuanian homepage,
  // regardless of their IP's geolocation.
  if (isCrawler(request)) {
    return 'lt';
  }

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale === 'lt' || cookieLocale === 'en') {
    return cookieLocale;
  }

  // Next.js 16 removed `NextRequest.geo` — Vercel's edge network instead sets
  // geolocation headers directly on the incoming request. This header is
  // `null` in local dev and non-Vercel environments, which correctly falls
  // through to the Accept-Language branch below (expected fallback).
  const country = request.headers.get('x-vercel-ip-country');
  if (country) {
    return country === 'LT' ? 'lt' : 'en';
  }

  // Default is 'lt': only positively-English Accept-Language switches to 'en'.
  // A missing/empty header (or anything else) falls back to 'lt'.
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  return acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'lt';
}

// ---------------------------------------------------------------------------
// Entry point — Next.js 16 uses `proxy.ts` (the renamed `middleware.ts`) and,
// with a `src/` layout, only reads it from inside `src/`; only one proxy file
// is supported per project, so the legacy slug-redirect logic above and the
// locale-resolution logic below must live in this single exported function.
// ---------------------------------------------------------------------------
export function proxy(request: NextRequest) {
  const legacyRedirect = legacyProductSlugRedirect(request);
  if (legacyRedirect) return legacyRedirect;

  const hadCookie = Boolean(request.cookies.get('NEXT_LOCALE'));
  const resolved = resolveLocale(request);

  // next-intl's own middleware negotiates its locale independently, reading
  // the NEXT_LOCALE cookie (and Accept-Language) off this same request — it
  // has no visibility into our geo-derived `resolved` value. On a first visit
  // (no cookie yet), seed the cookie onto the *request* before calling
  // intlMiddleware so next-intl's cookie read (its own highest-priority
  // signal, above its own Accept-Language negotiation) picks up our resolved
  // locale immediately, rather than only from the second request onward.
  if (!hadCookie) {
    request.cookies.set('NEXT_LOCALE', resolved);
  }

  const response = intlMiddleware(request);

  if (!hadCookie) {
    response.cookies.set('NEXT_LOCALE', resolved, { maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/en',
    '/products/:path*',
    '/en/products/:path*',
  ],
};
