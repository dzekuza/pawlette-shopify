import { createHash } from 'crypto'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '27330734433257068'
const GRAPH_API_VERSION = 'v21.0'

export interface MetaCapiEvent {
  eventName: string
  eventId: string
  eventSourceUrl: string
  fbp?: string
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
  customData?: Record<string, unknown>
}

function sha256 (value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function sendMetaCapiEvent (event: MetaCapiEvent): Promise<void> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!accessToken) {
    console.warn('META_CAPI_ACCESS_TOKEN is not set — skipping Conversions API event', event.eventName)
    return
  }

  const externalId = event.fbp ? sha256(event.fbp) : undefined

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: 'website',
        user_data: {
          client_ip_address: event.clientIpAddress,
          client_user_agent: event.clientUserAgent,
          fbp: event.fbp,
          fbc: event.fbc,
          external_id: externalId,
        },
        custom_data: event.customData,
      },
    ],
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    console.error('Meta Conversions API error', res.status, body)
  }
}
