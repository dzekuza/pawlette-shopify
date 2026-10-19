import { createHash } from 'node:crypto'
import { META_CART_ATTRIBUTES } from './meta-cart-attributes'

interface ShopifyAddress {
  first_name?: string | null
  last_name?: string | null
  city?: string | null
  zip?: string | null
  country_code?: string | null
  phone?: string | null
}

export interface ShopifyOrderPayload {
  id: number | string
  test?: boolean
  email?: string | null
  phone?: string | null
  currency: string
  total_price: string
  processed_at?: string | null
  created_at?: string | null
  browser_ip?: string | null
  client_details?: { browser_ip?: string | null, user_agent?: string | null } | null
  note_attributes?: { name: string, value: string }[] | null
  billing_address?: ShopifyAddress | null
  shipping_address?: ShopifyAddress | null
  customer?: { id?: number | string, email?: string | null, phone?: string | null } | null
  line_items?: { variant_id?: number | null, product_id?: number | null, quantity: number, price: string }[] | null
}

export interface MetaPurchaseEvent {
  eventName: 'Purchase'
  eventId: string
  eventTime: number
  eventSourceUrl: string
  fbp?: string
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
  userData: Record<string, string>
  customData: Record<string, unknown>
}

export type PurchaseDecision =
  | { send: true, event: MetaPurchaseEvent }
  | { send: false, reason: 'test-order' | 'no-consent' }

function hash (value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function digitsOnly (value: string): string {
  return value.replace(/\D/g, '')
}

function attribute (order: ShopifyOrderPayload, name: string): string | undefined {
  return order.note_attributes?.find((a) => a.name === name)?.value || undefined
}

/**
 * Maps a Shopify `orders/paid` payload to a Meta Purchase event.
 * Only orders whose cart carried `meta_consent=granted` (written by the storefront when the
 * visitor accepted cookies) are sent, so server-side purchases follow the same consent gate
 * as the browser pixel. The event id is derived from the order id so webhook retries dedupe.
 */
export function buildMetaPurchaseEvent (order: ShopifyOrderPayload, siteUrl: string): PurchaseDecision {
  if (order.test) return { send: false, reason: 'test-order' }
  if (attribute(order, META_CART_ATTRIBUTES.consent) !== 'granted') return { send: false, reason: 'no-consent' }

  const address = order.billing_address ?? order.shipping_address ?? undefined
  const email = order.email ?? order.customer?.email ?? undefined
  const phone = order.phone ?? order.customer?.phone ?? address?.phone ?? undefined
  const fbp = attribute(order, META_CART_ATTRIBUTES.fbp)
  const fbc = attribute(order, META_CART_ATTRIBUTES.fbc)

  const userData: Record<string, string> = {}
  if (email) userData.em = hash(email)
  if (phone && digitsOnly(phone)) userData.ph = hash(digitsOnly(phone))
  if (address?.first_name) userData.fn = hash(address.first_name)
  if (address?.last_name) userData.ln = hash(address.last_name)
  if (address?.city) userData.ct = hash(address.city.replace(/\s+/g, ''))
  if (address?.zip) userData.zp = hash(address.zip.replace(/\s+/g, ''))
  if (address?.country_code) userData.country = hash(address.country_code)
  const externalId = order.customer?.id ?? email
  if (externalId) userData.external_id = hash(String(externalId))

  const lines = (order.line_items ?? []).filter((l) => l.variant_id)
  const contentIds = lines.map((l) => `gid://shopify/ProductVariant/${l.variant_id}`)

  return {
    send: true,
    event: {
      eventName: 'Purchase',
      eventId: `purchase-${order.id}`,
      eventTime: Math.floor(new Date(order.processed_at ?? order.created_at ?? Date.now()).getTime() / 1000),
      eventSourceUrl: attribute(order, META_CART_ATTRIBUTES.sourceUrl) ?? siteUrl,
      fbp,
      fbc,
      clientIpAddress: order.browser_ip ?? order.client_details?.browser_ip ?? undefined,
      clientUserAgent: order.client_details?.user_agent ?? undefined,
      userData,
      customData: {
        currency: order.currency,
        value: parseFloat(order.total_price),
        content_type: 'product',
        content_ids: contentIds,
        contents: lines.map((l, i) => ({ id: contentIds[i], quantity: l.quantity, item_price: parseFloat(l.price) })),
        num_items: lines.reduce((sum, l) => sum + l.quantity, 0),
        order_id: String(order.id),
      },
    },
  }
}
