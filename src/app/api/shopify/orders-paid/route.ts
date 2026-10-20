import { NextResponse } from 'next/server'
import { buildGaPurchaseEvent, sendGaPurchase } from '@/lib/ga-purchase'
import { sendMetaCapiEvent } from '@/lib/meta-capi'
import { buildMetaPurchaseEvent, type ShopifyOrderPayload } from '@/lib/meta-purchase'
import { SITE_URL } from '@/lib/seo'
import { isValidShopifySignature } from '@/lib/shopify-webhook'

/**
 * Shopify `orders/paid` webhook. Mirrors the purchase to Meta's Conversions API so ads can
 * optimise for sales, and to GA4 (Measurement Protocol) so revenue shows in reports; checkout
 * runs on Shopify's domain, where neither the browser pixel nor gtag loads.
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

  // GA4 first and independent of Meta: a Meta rejection must not block (or retry-duplicate) it.
  const gaDecision = buildGaPurchaseEvent(order)
  const gaSent = gaDecision.send ? await sendGaPurchase(gaDecision.event) : false
  console.info('orders-paid: ga4', { orderId: order.id, sent: gaSent, reason: gaDecision.send ? undefined : gaDecision.reason })

  const decision = buildMetaPurchaseEvent(order, SITE_URL, secret)
  if (!decision.send) {
    console.info('orders-paid: skipped', { orderId: order.id, reason: decision.reason })
    return NextResponse.json({ sent: false, reason: decision.reason, ga: gaSent })
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
    return NextResponse.json({ sent: false, reason: 'meta-rejected', ga: gaSent }, { status: 502 })
  }
  return NextResponse.json({ sent: results.length > 0, pixels: results, ga: gaSent })
}
