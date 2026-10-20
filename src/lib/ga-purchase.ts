import { GA_CART_ATTRIBUTES, META_CART_ATTRIBUTES } from './meta-cart-attributes'
import type { ShopifyOrderPayload } from './meta-purchase'

export interface GaPurchaseEvent {
  clientId: string
  params: Record<string, unknown>
}

export type GaPurchaseDecision =
  | { send: true, event: GaPurchaseEvent }
  | { send: false, reason: 'test-order' | 'no-consent' | 'no-client-id' }

function attribute (order: ShopifyOrderPayload, name: string): string | undefined {
  return order.note_attributes?.find((a) => a.name === name)?.value || undefined
}

/**
 * Maps a Shopify `orders/paid` payload to a GA4 purchase event. Follows the same consent gate as
 * the Meta event (the storefront only writes the ids once cookies are accepted). `transaction_id`
 * is the order id, so GA4 drops duplicates from webhook retries.
 */
export function buildGaPurchaseEvent (order: ShopifyOrderPayload): GaPurchaseDecision {
  if (order.test) return { send: false, reason: 'test-order' }
  if (attribute(order, META_CART_ATTRIBUTES.consent) !== 'granted') return { send: false, reason: 'no-consent' }
  const clientId = attribute(order, GA_CART_ATTRIBUTES.clientId)
  if (!clientId) return { send: false, reason: 'no-client-id' }

  const sessionId = attribute(order, GA_CART_ATTRIBUTES.sessionId)
  const lines = order.line_items ?? []

  return {
    send: true,
    event: {
      clientId,
      params: {
        transaction_id: String(order.id),
        currency: order.currency,
        value: parseFloat(order.total_price),
        // Without a session id the purchase would land in a separate, unattributed session.
        ...(sessionId ? { session_id: sessionId } : {}),
        engagement_time_msec: 1,
        items: lines.map((l) => ({
          item_id: String(l.variant_id ?? l.product_id ?? 'unknown'),
          price: parseFloat(l.price),
          quantity: l.quantity,
        })),
      },
    },
  }
}

/** Sends the event through the GA4 Measurement Protocol. Returns false when unconfigured or rejected. */
export async function sendGaPurchase (event: GaPurchaseEvent): Promise<boolean> {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret = process.env.GA_API_SECRET
  if (!measurementId || !apiSecret) {
    console.warn('ga-purchase: NEXT_PUBLIC_GA_MEASUREMENT_ID or GA_API_SECRET is not set')
    return false
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ client_id: event.clientId, events: [{ name: 'purchase', params: event.params }] }),
    })
    return response.ok
  } catch {
    return false
  }
}
