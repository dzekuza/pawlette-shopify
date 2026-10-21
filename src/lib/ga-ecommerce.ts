import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import type { ShopifyCart, ShopifyCartLine } from '@/lib/cart'

/** GA4 ecommerce item. See https://developers.google.com/analytics/devguides/collection/ga4/reference/events */
export interface GaItem {
  item_id: string
  item_name: string
  price: number
  quantity?: number
  item_list_name?: string
  index?: number
}

/** Anything list-rendered by `ProductCard` — `LandingCollar` and `ProductDetail` both fit. */
export interface GaListProduct {
  id: string | number
  name: string
  price: string
}

const CURRENCY = 'EUR'

/** Parses display prices like "€33.00" or "33,00 €" — plain parseFloat gives NaN on the currency prefix. */
export function parsePrice (value: string): number {
  const parsed = Number(value.replace(/[^0-9.,]/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export function gaItemFromProduct (product: GaListProduct, listName?: string, index?: number): GaItem {
  return {
    item_id: String(product.id),
    item_name: product.name,
    price: parsePrice(product.price),
    ...(listName ? { item_list_name: listName } : {}),
    ...(index === undefined ? {} : { index }),
  }
}

function gaItemFromCartLine (line: ShopifyCartLine): GaItem {
  return {
    item_id: line.merchandise.id,
    item_name: line.merchandise.product.title,
    price: parsePrice(line.merchandise.price.amount),
    quantity: line.quantity,
  }
}

/** A product list (grid / carousel) was shown to the visitor. */
export function trackViewItemList (listName: string, products: GaListProduct[]): void {
  if (products.length === 0) return
  trackGaEvent('view_item_list', {
    item_list_name: listName,
    items: products.map((product, index) => gaItemFromProduct(product, listName, index)),
  })
}

/** The visitor clicked a product in a list. */
export function trackSelectItem (listName: string, product: GaListProduct, index: number): void {
  trackGaEvent('select_item', {
    item_list_name: listName,
    items: [gaItemFromProduct(product, listName, index)],
  })
}

/** The cart drawer / cart page was opened with items in it. */
export function trackViewCart (cart: ShopifyCart): void {
  if (cart.lines.length === 0) return
  trackGaEvent('view_cart', {
    currency: cart.cost.totalAmount.currencyCode || CURRENCY,
    value: parsePrice(cart.cost.totalAmount.amount),
    items: cart.lines.map(gaItemFromCartLine),
  })
}

/** A line was removed from the cart. Call with the line as it was *before* removal. */
export function trackRemoveFromCart (line: ShopifyCartLine, currency: string = CURRENCY): void {
  trackGaEvent('remove_from_cart', {
    currency,
    value: parsePrice(line.cost.totalAmount.amount),
    items: [gaItemFromCartLine(line)],
  })
}
