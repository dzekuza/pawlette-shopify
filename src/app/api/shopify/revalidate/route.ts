import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { SHOPIFY_CACHE_TAG } from '@/lib/shopify';
import { isValidShopifySignature } from '@/lib/shopify-webhook';

/**
 * Shopify webhook receiver (products/create|update|delete, collections/update, inventory_levels/update).
 * Marks the cached Storefront catalog stale so price, stock and product edits show up on the next visit.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!isValidShopifySignature(rawBody, request.headers.get('x-shopify-hmac-sha256'), secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  revalidateTag(SHOPIFY_CACHE_TAG, 'max');
  return NextResponse.json({ revalidated: true, topic: request.headers.get('x-shopify-topic') });
}
