import { NextRequest, NextResponse } from 'next/server'
import { sendMetaCapiEvent } from '@/lib/meta-capi'

// Browser-originated events only. Purchase is sent server-side from the signed Shopify webhook;
// accepting it here would let anyone forge purchases or pre-empt the real event's id.
const ALLOWED_BROWSER_EVENTS = new Set(['ViewContent', 'AddToCart', 'InitiateCheckout'])

interface MetaEventRequestBody {
  eventName: string
  eventId: string
  eventSourceUrl: string
  fbp?: string
  fbc?: string
  customData?: Record<string, unknown>
}

export async function POST (request: NextRequest) {
  const body = (await request.json()) as MetaEventRequestBody

  if (!body.eventName || !body.eventId || !body.eventSourceUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!ALLOWED_BROWSER_EVENTS.has(body.eventName) || body.eventId.startsWith('purchase-')) {
    return NextResponse.json({ error: 'Event not allowed' }, { status: 400 })
  }

  await sendMetaCapiEvent({
    eventName: body.eventName,
    eventId: body.eventId,
    eventSourceUrl: body.eventSourceUrl,
    fbp: body.fbp,
    fbc: body.fbc,
    customData: body.customData,
    clientIpAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
    clientUserAgent: request.headers.get('user-agent') ?? undefined,
  })

  return NextResponse.json({ ok: true })
}
