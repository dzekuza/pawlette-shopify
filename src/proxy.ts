import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Product slugs must be ASCII-only. Some old charm slugs were generated straight
// from raw Lithuanian titles (e.g. "charm-sirdis-rozine" with diacritics restored)
// and Next's automatic x-next-cache-tags header throws when a route segment
// contains non-ASCII bytes, crashing the whole request with a 500 before the page
// even renders. Catching this here (proxy runs before rendering) is the only place
// that can intercept it — redirect to the ASCII-normalized slug instead of crashing.
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g')

function slugifyAscii (input: string): string {
  return input
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function proxy (request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = pathname.match(/^\/products\/([^/]+)$/)
  if (!match) return NextResponse.next()

  const rawSlug = decodeURIComponent(match[1])
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(rawSlug)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/products/${slugifyAscii(rawSlug)}`
  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: '/products/:slug',
}
