import { COOKIE_CONSENT_KEY } from '@/components/shared/MetaPixel'

function hasConsent (): boolean {
  return typeof window !== 'undefined' && localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted'
}

// GA4 Enhanced Ecommerce event, gated by the same cookie-consent flag as
// MetaPixel/ShopifyAnalytics. gtag/dataLayer is bootstrapped unconditionally
// in the root layout, so this only needs to push the event itself.
export function trackGA4Event (eventName: string, params?: Record<string, unknown>): void {
  if (!hasConsent()) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.gtag?.('event', eventName, params)
}
