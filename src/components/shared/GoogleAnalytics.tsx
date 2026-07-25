'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_EVENT } from '@/components/shared/MetaPixel'

function hasConsent (): boolean {
  return typeof window !== 'undefined' && localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted'
}

function grantAnalyticsConsent () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.gtag?.('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
}

/**
 * Fires a GA4 event client-side. No-ops entirely without consent — same
 * gate as the Meta Pixel helper in this file's sibling component. The base
 * gtag.js tag is bootstrapped in the root layout, so we reuse the global
 * `gtag` defined there rather than loading a second script.
 */
export function trackGaEvent (eventName: string, params?: Record<string, unknown>) {
  if (!hasConsent()) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.gtag?.('event', eventName, params)
}

// The base gtag.js tag is bootstrapped unconditionally in the root layout
// with Consent Mode v2 defaults (all denied) so Google's tag verifier can
// detect it. This component only flips consent to granted once the user
// accepts cookies — no analytics cookies are set before that.
export function GoogleAnalytics () {
  useEffect(() => {
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted') {
      grantAnalyticsConsent()
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, grantAnalyticsConsent)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, grantAnalyticsConsent)
  }, [])

  return null
}

/**
 * Fires GA4 page_view on client-side route changes. The gtag('config', ...)
 * call in the root layout only sends page_view once, on initial script load —
 * App Router navigations never reload that script, so without this, sessions
 * with multiple pageviews (landing -> products -> cart) undercount to GA4.
 * Mount once, sibling to <GoogleAnalytics />.
 */
export function GaPageViewTracker () {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      // The initial page_view is already sent by the gtag('config', ...) bootstrap.
      isFirstRender.current = false
      return
    }
    if (!hasConsent()) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    })
  }, [pathname])

  return null
}
