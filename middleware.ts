import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

function resolveLocale(request: NextRequest): 'lt' | 'en' {
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

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  return acceptLanguage.toLowerCase().startsWith('lt') ? 'lt' : 'en';
}

export default function middleware(request: NextRequest) {
  const resolved = resolveLocale(request);
  const response = intlMiddleware(request);

  // next-intl's middleware only picks a locale from the URL/cookie itself when
  // one is present; on a first visit with no NEXT_LOCALE cookie yet, force the
  // geo/Accept-Language result by setting the cookie next-intl reads.
  if (!request.cookies.get('NEXT_LOCALE')) {
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
    '/configure/:path*',
    '/en/configure/:path*',
  ],
};
