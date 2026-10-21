import { useEffect, useRef } from 'react'
import { trackViewItemList, type GaListProduct } from '@/lib/ga-ecommerce'

/**
 * Fires GA4 `view_item_list` once per distinct set of products shown in a list.
 * Re-fires when the visible set changes (e.g. a category filter), not on every re-render.
 */
export function useViewItemList (listName: string, products: GaListProduct[]): void {
  const lastKey = useRef<string | null>(null)

  useEffect(() => {
    const key = `${listName}:${products.map((product) => product.id).join(',')}`
    if (products.length === 0 || key === lastKey.current) return
    lastKey.current = key
    trackViewItemList(listName, products)
  }, [listName, products])
}
