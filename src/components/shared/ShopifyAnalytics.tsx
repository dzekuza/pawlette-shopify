'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useShopifyCookies } from '@shopify/hydrogen-react'
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_EVENT } from '@/components/shared/MetaPixel'
import { trackShopifyPageView } from '@/lib/shopifyAnalytics'

const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!

// Feeds Shopify's native Admin Analytics (Sessions, Conversion rate) with real
// funnel data, which a fully headless storefront otherwise never reports —
// Shopify's own tracking only fires on Shopify-hosted theme/checkout pages.
// Gated by the same cookie-consent flag as MetaPixel/GoogleAnalytics.
export function ShopifyAnalytics () {
  const pathname = usePathname()
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    setConsent(localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted')
    const handleConsentGranted = () => setConsent(true)
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentGranted)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentGranted)
  }, [])

  useShopifyCookies({
    hasUserConsent: consent,
    fetchTrackingValues: consent,
    storefrontAccessToken: STOREFRONT_TOKEN,
    checkoutDomain: SHOP_DOMAIN,
  })

  useEffect(() => {
    if (!consent) return
    trackShopifyPageView().catch(() => {})
  }, [consent, pathname])

  return null
}
