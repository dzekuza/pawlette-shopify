import { trackGaEvent } from '@/components/shared/GoogleAnalytics'
import type { ShopifyCart, ShopifyCartLine } from '@/lib/cart'

/** GA4 ecommerce item. See https://developers.google.com/analytics/devguides/collection/ga4/reference/events */
export interface GaItem {
  item_id: string
  item_name: string
  item_variant?: string
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

/** Numeric tail of a Shopify gid (`gid://shopify/ProductVariant/123` -> `123`). */
function shortGid (gid: string): string {
  return gid.split('/').pop() ?? gid
}

/** GA4 item for a cart line; `quantity` overrides the line quantity (add_to_cart reports only what was added). */
export function gaItemFromCartLine (line: ShopifyCartLine, quantity: number = line.quantity): GaItem {
  return {
    item_id: shortGid(line.merchandise.id),
    item_name: line.merchandise.product.title,
    ...(line.merchandise.title && line.merchandise.title !== 'Default Title' ? { item_variant: line.merchandise.title } : {}),
    price: parsePrice(line.merchandise.price.amount),
    quantity,
  }
}

/** Items were added to the cart. `added` lists the variants and quantities of this action only. */
export function trackAddToCartEvent (cart: ShopifyCart, added: { merchandiseId: string, quantity: number }[]): void {
  const items = cart.lines.flatMap((line) => {
    const request = added.find((a) => a.merchandiseId === line.merchandise.id)
    return request ? [gaItemFromCartLine(line, request.quantity)] : []
  })
  if (items.length === 0) return
  trackGaEvent('add_to_cart', {
    currency: cart.cost.totalAmount.currencyCode || CURRENCY,
    value: items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0),
    items,
  })
}

/** The visitor clicked through to the Shopify checkout. */
export function trackBeginCheckoutEvent (cart: ShopifyCart): void {
  if (cart.lines.length === 0) return
  trackGaEvent('begin_checkout', {
    currency: cart.cost.totalAmount.currencyCode || CURRENCY,
    value: parsePrice(cart.cost.totalAmount.amount),
    items: cart.lines.map((line) => gaItemFromCartLine(line)),
  })
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
