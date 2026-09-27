'use client';

import { useEffect, useState } from 'react';
import { getCharms, type ShopifyCharm } from '@/lib/shopify';

export const MAX_CARD_SWATCHES = 5;

/** Distinct colors of in-stock charms, in catalog order. */
export function getAvailableCharmSwatches(charms: readonly ShopifyCharm[], limit = MAX_CARD_SWATCHES): string[] {
  const colors = new Set<string>();
  for (const charm of charms) {
    if (charm.availableForSale && charm.bg) colors.add(charm.bg);
  }
  return [...colors].slice(0, limit);
}

/**
 * Charm swatch colors that are currently purchasable. Returns [] until the (module-cached,
 * in-flight-deduped) charm catalog resolves — starts empty so SSR and first client render match.
 */
export function useAvailableCharmSwatches(): string[] {
  const [swatches, setSwatches] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getCharms()
      .then((charms) => { if (!cancelled) setSwatches(getAvailableCharmSwatches(charms)); })
      .catch(() => { /* keep empty: no swatches rather than wrong ones */ });
    return () => { cancelled = true; };
  }, []);

  return swatches;
}
