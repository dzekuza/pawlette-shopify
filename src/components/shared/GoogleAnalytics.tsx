'use client'

import { useEffect } from 'react'
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_EVENT } from '@/components/shared/MetaPixel'

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
