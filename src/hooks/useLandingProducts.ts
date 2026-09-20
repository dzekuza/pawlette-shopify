'use client'

import { useEffect, useState } from 'react'
import { getLandingProducts, getLandingProductsSync, type ProductDetail } from '@/lib/db'

/** Landing-page products: cached sync value on first render, refreshed from the catalog on mount. */
export function useLandingProducts(locale?: string): ProductDetail[] {
  const [products, setProducts] = useState<ProductDetail[]>(() => getLandingProductsSync(locale) ?? [])

  useEffect(() => {
    getLandingProducts(locale).then((data) => { if (data.length > 0) setProducts(data) })
  }, [locale])

  return products
}
