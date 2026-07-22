import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  ShopifySalesChannel,
} from '@shopify/hydrogen-react'
import type { CurrencyCode } from '@shopify/hydrogen-react/storefront-api-types'
import { shopifyClient } from './shopify'
import type { ShopifyCart } from './cart'
import { COOKIE_CONSENT_KEY } from '@/components/shared/MetaPixel'

const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
// sendShopifyAnalytics posts to https://{shopDomain}/.well-known/shopify/monorail/...
// — per hydrogen-react's own docs this must be the checkout domain (same top-level
// domain as checkout) so the session cookie it sets there actually matches the
// domain the buyer completes checkout on. Passing the .myshopify.com API domain
// here silently breaks session-to-order attribution.
const CHECKOUT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN!

const SHOP_ID_QUERY = `query ShopId { shop { id } }`

let shopIdPromise: Promise<string> | null = null

// Cached for the lifetime of the page — the shop gid never changes.
function getShopId (): Promise<string> {
  if (!shopIdPromise) {
    shopIdPromise = shopifyClient.request(SHOP_ID_QUERY).then(({ data }) => data.shop.id as string)
  }
  return shopIdPromise
}

function hasConsent (): boolean {
  return typeof window !== 'undefined' && localStorage.getItem(COOKIE_CONSENT_KEY) === 'granted'
}

export async function trackShopifyPageView (): Promise<void> {
  if (!hasConsent()) return
  const shopId = await getShopId()
  await sendShopifyAnalytics({
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload: {
      shopId,
      currency: 'EUR' as CurrencyCode,
      hasUserConsent: true,
      shopifySalesChannel: ShopifySalesChannel.headless,
      ...getClientBrowserParameters(),
    },
  }, CHECKOUT_DOMAIN)
}

export async function trackShopifyAddToCart (
  cart: ShopifyCart,
  addedLines: { merchandiseId: string; quantity: number }[],
): Promise<void> {
  if (!hasConsent()) return
  const shopId = await getShopId()
  const addedIds = addedLines.map((l) => l.merchandiseId)
  const totalValue = cart.lines
    .filter((l) => addedIds.includes(l.merchandise.id))
    .reduce((sum, l) => {
      const requested = addedLines.find((rl) => rl.merchandiseId === l.merchandise.id)
      return sum + parseFloat(l.merchandise.price.amount) * (requested?.quantity ?? l.quantity)
    }, 0)

  await sendShopifyAnalytics({
    eventName: AnalyticsEventName.ADD_TO_CART,
    payload: {
      shopId,
      currency: cart.cost.totalAmount.currencyCode as CurrencyCode,
      hasUserConsent: true,
      shopifySalesChannel: ShopifySalesChannel.headless,
      cartId: cart.id,
      totalValue,
      ...getClientBrowserParameters(),
    },
  }, CHECKOUT_DOMAIN)
}
