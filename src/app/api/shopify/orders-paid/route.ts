import { NextResponse } from 'next/server'
import { sendMetaCapiEvent } from '@/lib/meta-capi'
import { buildMetaPurchaseEvent, type ShopifyOrderPayload } from '@/lib/meta-purchase'
import { SITE_URL } from '@/lib/seo'
import { isValidShopifySignature } from '@/lib/shopify-webhook'

/**
 * Shopify `orders/paid` webhook. Mirrors the purchase to Meta's Conversions API so ads can
 * optimise for sales; checkout runs on Shopify's domain, where the browser pixel never loads.
 * Orders from visitors who did not accept cookies are acknowledged but not sent.
 */
export async function POST (request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    console.error('orders-paid: SHOPIFY_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 503 })
  }

  const rawBody = await request.text()
  if (!isValidShopifySignature(rawBody, request.headers.get('x-shopify-hmac-sha256'), secret)) {
    console.warn('orders-paid: rejected invalid signature', { topic: request.headers.get('x-shopify-topic') })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let order: ShopifyOrderPayload
  try {
    order = JSON.parse(rawBody) as ShopifyOrderPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const decision = buildMetaPurchaseEvent(order, SITE_URL, secret)
  if (!decision.send) {
    console.info('orders-paid: skipped', { orderId: order.id, reason: decision.reason })
    return NextResponse.json({ sent: false, reason: decision.reason })
  }

  const { event } = decision
  const results = await sendMetaCapiEvent({
    eventName: event.eventName,
    eventId: event.eventId,
    eventTime: event.eventTime,
    eventSourceUrl: event.eventSourceUrl,
    fbp: event.fbp,
    fbc: event.fbc,
    clientIpAddress: event.clientIpAddress,
    clientUserAgent: event.clientUserAgent,
    userData: event.userData,
    customData: event.customData,
  })

  // One line per order (no customer data) so deliveries can be checked in the Vercel runtime logs.
  console.info('orders-paid: processed', { orderId: order.id, eventId: event.eventId, pixels: results })

  // A non-2xx makes Shopify retry; the order-derived event id lets Meta dedupe repeats.
  if (results.length > 0 && results.every((r) => !r.ok)) {
    return NextResponse.json({ sent: false, reason: 'meta-rejected' }, { status: 502 })
  }
  return NextResponse.json({ sent: results.length > 0, pixels: results })
}
