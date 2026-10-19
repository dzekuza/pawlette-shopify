import { createHmac, timingSafeEqual } from 'node:crypto'

/** Verifies Shopify's `X-Shopify-Hmac-Sha256` header against the raw request body. */
export function isValidShopifySignature (rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest()
  const received = Buffer.from(signature, 'base64')
  return received.length === expected.length && timingSafeEqual(received, expected)
}
