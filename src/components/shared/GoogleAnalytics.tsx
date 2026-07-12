'use client'

import { useEffect } from 'react'
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_EVENT } from '@/components/shared/MetaPixel'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-CD28613MD9'

// Vendor bootstrap snippet (Google's official gtag.js base code) — typed loosely
// on purpose since it patches a global with a self-referential queue shape
// that doesn't map cleanly onto a static type.
function loadGoogleAnalytics () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.gtag) return

  w.dataLayer = w.dataLayer || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag (...args: unknown[]) {
    w.dataLayer.push(args)
  }
  w.gtag = gtag

  const t = document.createElement('script')
  t.async = true
  t.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  const s = document.getElementsByTagName('script')[0]
  s.parentNode?.insertBefore(t, s)

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID)
}

// No <noscript> fallback: that markup would render into the static HTML
// payload and fire unconditionally for no-JS visitors, bypassing consent entirely.
export function GoogleAnalytics () {
  useEffect(() => {
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted') {
      loadGoogleAnalytics()
    }

    const handleConsentGranted = () => loadGoogleAnalytics()
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentGranted)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentGranted)
  }, [])

  return null
}
