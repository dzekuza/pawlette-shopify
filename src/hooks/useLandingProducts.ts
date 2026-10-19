'use client'

import { useEffect, useState } from 'react'
import { getLandingProducts, getLandingProductsSync, type ProductDetail } from '@/lib/db'

/**
 * Landing-page products. Server-provided `initialProducts` render in the first HTML (crawlable,
 * no client fetch); otherwise falls back to the cached sync value and refreshes from the catalog on mount.
 */
export function useLandingProducts(locale?: string, initialProducts?: ProductDetail[]): ProductDetail[] {
  const hasInitial = !!initialProducts && initialProducts.length > 0
  const [products, setProducts] = useState<ProductDetail[]>(() => (hasInitial ? initialProducts : getLandingProductsSync(locale)) ?? [])

  useEffect(() => {
    if (hasInitial) return
    getLandingProducts(locale).then((data) => { if (data.length > 0) setProducts(data) })
  }, [locale, hasInitial])

  return products
}
