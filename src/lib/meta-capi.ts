import { createHash } from 'crypto'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '27330734433257068'
const META_PIXEL_ID_SECONDARY = process.env.NEXT_PUBLIC_META_PIXEL_ID_SECONDARY || '3252638168278408'
const GRAPH_API_VERSION = 'v21.0'

export interface MetaCapiEvent {
  eventName: string
  eventId: string
  eventSourceUrl: string
  /** Unix seconds; defaults to now. Use the order time for webhook-driven events. */
  eventTime?: number
  fbp?: string
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
  /** Already-hashed customer fields (em, ph, fn, ln, ct, zp, country, external_id). */
  userData?: Record<string, string>
  customData?: Record<string, unknown>
}

export interface MetaCapiResult {
  pixelId: string
  ok: boolean
}

function sha256 (value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

/** Pixels that can receive server events: each needs its own Conversions API token. */
function getTargets (): { pixelId: string, accessToken: string | undefined }[] {
  return [
    { pixelId: META_PIXEL_ID, accessToken: process.env.META_CAPI_ACCESS_TOKEN },
    { pixelId: META_PIXEL_ID_SECONDARY, accessToken: process.env.META_CAPI_ACCESS_TOKEN_SECONDARY },
  ]
}

export async function sendMetaCapiEvent (event: MetaCapiEvent): Promise<MetaCapiResult[]> {
  const targets = getTargets().filter((t) => t.pixelId)
  if (!targets.some((t) => t.accessToken)) {
    console.warn('META_CAPI_ACCESS_TOKEN is not set — skipping Conversions API event', event.eventName)
    return []
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: 'website',
        user_data: {
          client_ip_address: event.clientIpAddress,
          client_user_agent: event.clientUserAgent,
          fbp: event.fbp,
          fbc: event.fbc,
          external_id: event.fbp ? sha256(event.fbp) : undefined,
          ...event.userData,
        },
        custom_data: event.customData,
      },
    ],
    ...(process.env.META_CAPI_TEST_EVENT_CODE ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE } : {}),
  }

  return Promise.all(
    targets
      .filter((t): t is { pixelId: string, accessToken: string } => Boolean(t.accessToken))
      .map(async ({ pixelId, accessToken }): Promise<MetaCapiResult> => {
        try {
          const res = await fetch(
            `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          )
          if (!res.ok) {
            console.error('Meta Conversions API error', pixelId, res.status, await res.text())
          }
          return { pixelId, ok: res.ok }
        } catch (error) {
          console.error('Meta Conversions API request failed', pixelId, error instanceof Error ? error.message : error)
          return { pixelId, ok: false }
        }
      })
  )
}
