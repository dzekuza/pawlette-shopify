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

function readGaValue (key: 'client_id' | 'session_id'): Promise<string | undefined> {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (!measurementId || typeof w.gtag !== 'function') return Promise.resolve(undefined)
  return new Promise((resolve) => {
    // gtag's callback never fires if the script is blocked, so don't wait on it indefinitely.
    const timer = window.setTimeout(() => resolve(undefined), 1500)
    w.gtag('get', measurementId, key, (value: unknown) => {
      window.clearTimeout(timer)
      resolve(value == null ? undefined : String(value))
    })
  })
}

/**
 * GA4 client and session ids, so the orders/paid webhook can attach the server-side purchase
 * to the visitor's session. Returns null without cookie consent.
 */
export async function getGaBrowserIds (): Promise<{ clientId?: string, sessionId?: string } | null> {
  if (!hasConsent()) return null
  const [clientId, sessionId] = await Promise.all([readGaValue('client_id'), readGaValue('session_id')])
  return { clientId, sessionId }
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

const SOCIAL_NETWORKS: Array<{ host: string, network: string }> = [
  { host: 'instagram.com', network: 'instagram' },
  { host: 'facebook.com', network: 'facebook' },
  { host: 'tiktok.com', network: 'tiktok' },
  { host: 'wa.me', network: 'whatsapp' },
  { host: 'whatsapp.com', network: 'whatsapp' },
]

const CLICKABLE_SELECTOR = 'a[href], button, [role="button"]'
const MAX_LABEL_LENGTH = 80

function clickLabel (el: Element): string {
  const explicit = el.getAttribute('data-ga-label') ?? el.getAttribute('aria-label')
  const raw = explicit ?? el.textContent ?? ''
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_LABEL_LENGTH)
}

// Where on the page the click happened: an explicit data-ga-section wins, otherwise the
// nearest landmark / dialog / id'd section, so "Buy now" in the nav and in the hero differ.
function clickSection (el: Element): string {
  const tagged = el.closest('[data-ga-section]')?.getAttribute('data-ga-section')
  if (tagged) return tagged
  if (el.closest('[role="dialog"]')) return 'dialog'
  const landmark = el.closest('header, nav, footer, section[id], main')
  if (!landmark) return 'page'
  return landmark.tagName === 'SECTION' ? landmark.id : landmark.tagName.toLowerCase()
}

function parseHref (href: string): URL | null {
  try {
    return new URL(href, window.location.href)
  } catch {
    return null
  }
}

function trackClick (el: Element) {
  const section = clickSection(el)
  const label = clickLabel(el)
  const href = el instanceof HTMLAnchorElement ? el.getAttribute('href') ?? '' : ''

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    trackGaEvent('contact_click', {
      contact_method: href.startsWith('mailto:') ? 'email' : 'phone',
      click_section: section,
    })
    return
  }

  const url = href ? parseHref(href) : null
  const social = url ? SOCIAL_NETWORKS.find(({ host }) => url.hostname === host || url.hostname.endsWith(`.${host}`)) : undefined
  if (social) {
    trackGaEvent('social_click', { social_network: social.network, link_url: url?.href, click_section: section })
    return
  }

  const expanded = el.getAttribute('aria-expanded')
  trackGaEvent(href ? 'link_click' : 'button_click', {
    link_text: label,
    click_section: section,
    ...(url ? { link_url: url.origin === window.location.origin ? `${url.pathname}${url.hash}` : url.href } : {}),
    // Accordions (FAQ) and menu toggles report the state they are moving *to*.
    ...(expanded === null ? {} : { expanded_after: expanded === 'false' }),
  })
}

/**
 * Delegated click tracking for every button and link on the site — one capture-phase
 * listener instead of an onClick on each component. Emits `button_click` / `link_click`
 * (with link_text, link_url, click_section), plus `contact_click` for mailto:/tel: and
 * `social_click` for Instagram/Facebook/TikTok/WhatsApp. Opt an element subtree out with
 * `data-ga-ignore`; override the label with `data-ga-label` and the section with
 * `data-ga-section`. Consent-gated through trackGaEvent. Mount once, next to <GoogleAnalytics />.
 */
export function GaClickTracker () {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const el = event.target.closest(CLICKABLE_SELECTOR)
      if (!el || el.closest('[data-ga-ignore]')) return
      if (el instanceof HTMLButtonElement && el.disabled) return
      trackClick(el)
    }
    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
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
