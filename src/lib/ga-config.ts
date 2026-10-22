/**
 * Hostnames allowed to send data to the production GA4 property. Anything else
 * (localhost, LAN IPs, Vercel previews) is dropped so it never pollutes reports.
 */
export const GA_ALLOWED_HOSTNAMES = ['pawscharm.com', 'www.pawscharm.com'] as const

/** Shopify checkout host that GA4 cross-domain linking must cover. */
export const GA_DEFAULT_CHECKOUT_DOMAIN = 'checkout.pawscharm.com'

/** True only in a production build running on an allowed hostname. Safe on the server (returns false). */
export function isGaEnabledHost (): boolean {
  if (process.env.NODE_ENV !== 'production') return false
  if (typeof window === 'undefined') return false
  return (GA_ALLOWED_HOSTNAMES as readonly string[]).includes(window.location.hostname)
}
