/** Cart attribute keys that carry Meta browser identifiers through checkout to the order webhook. */
export const META_CART_ATTRIBUTES = {
  consent: 'meta_consent',
  fbp: 'meta_fbp',
  fbc: 'meta_fbc',
  sourceUrl: 'meta_event_source_url',
} as const

/** Cart attribute keys that carry GA4 browser identifiers through checkout to the order webhook. */
export const GA_CART_ATTRIBUTES = {
  clientId: 'ga_client_id',
  sessionId: 'ga_session_id',
} as const
