import { NextRequest, NextResponse } from 'next/server'
import { sendMetaCapiEvent } from '@/lib/meta-capi'

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
