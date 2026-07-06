'use client'

import { useEffect } from 'react'

const META_PIXEL_ID = '1754814685843543'
export const COOKIE_CONSENT_KEY = 'pawcharms_cookie_consent'
export const COOKIE_CONSENT_EVENT = 'pawcharms-consent-granted'

// Vendor bootstrap snippet (Meta's official pixel base code) — typed loosely
// on purpose since it patches a global with a self-referential queue shape
// that doesn't map cleanly onto a static type.
function loadMetaPixel () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.fbq) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n: any = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args)
    else n.queue.push(args)
  }
  w.fbq = n
  w._fbq = w._fbq || n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []

  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const s = document.getElementsByTagName('script')[0]
  s.parentNode?.insertBefore(t, s)

  w.fbq('init', META_PIXEL_ID)
  w.fbq('track', 'PageView')
}

// No <noscript> fallback pixel: that markup would render into the static HTML
// payload and fire unconditionally for no-JS visitors, bypassing consent entirely.
export function MetaPixel () {
  useEffect(() => {
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted') {
      loadMetaPixel()
    }

    const handleConsentGranted = () => loadMetaPixel()
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentGranted)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentGranted)
  }, [])

  return null
}
