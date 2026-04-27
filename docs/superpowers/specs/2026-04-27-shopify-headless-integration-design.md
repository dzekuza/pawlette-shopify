# Shopify Headless Integration — Design Spec
Date: 2026-04-27

## Overview

Duplicate the `dog` Next.js project into `dog-shopify`, then wire it to the Shopify Storefront API at `floria-lt.myshopify.com`. The store will be cleaned up and repurposed for the Pawlette dog collar/charms brand. All UI stays identical — only the data layer and cart/checkout change.

## Scope

- Duplicate `/projects/dog` → `/projects/dog-shopify`
- Replace static product data with live Shopify Storefront API queries
- Replace localStorage cart items with Shopify Cart API
- Checkout redirects to Shopify hosted checkout URL
- No visual or UX changes

## Architecture

### New Files

**`src/lib/shopify.ts`**
- Initializes `@shopify/storefront-api-client`
- Exports typed query functions: `getCollars()`, `getCharms()`, `getProductByHandle()`
- Uses `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` + `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` env vars

**`src/lib/cart.ts`**
- Encapsulates all Shopify cart mutations: `createCart()`, `addToCart()`, `updateCartLine()`, `removeCartLine()`
- Cart ID persisted in `localStorage` under key `pawlette_cart_id`
- Returns `cart.checkoutUrl` for checkout redirect

### Modified Files

**`src/lib/data.ts`**
- Remove: `COLLARS`, `ALL_CHARMS`, `PRODUCTS` (replaced by Shopify API)
- Keep: `SIZES`, `CHARM_POSITIONS`, `FLOAT_DURATIONS`, `LANDING_REVIEWS`, `TICKER_ITEMS`, `CartItem` interface

**`src/components/ProductConfigurator.tsx`**
- On mount: fetch collars + charms from Shopify via `getCollars()` / `getCharms()`
- Pass fetched data down to `CollarStage` and `ConfigPanel` (same props interface)

**`src/components/landing/ProductGrid.tsx`** + **`CharmGrid.tsx`**
- Fetch products from Shopify on mount instead of importing from `data.ts`

**`src/components/MiniCart.tsx`**
- "Add to Cart" calls `addToCart()` from `cart.ts`
- "Checkout" button navigates to `cart.checkoutUrl`
- Cart count reads from Shopify cart quantity, not localStorage array length

**`src/app/cart/page.tsx`**
- On mount: load cart from Shopify using stored cart ID
- Display live cart from Shopify (quantity, line items, totals)

**`src/app/checkout/page.tsx`**
- Redirect immediately to Shopify hosted checkout URL
- (Shopify handles the full checkout flow)

### Environment Variables

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=floria-lt.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<token from Headless channel>
```

## Shopify Store Setup (manual steps)

1. Delete all existing floria products in Shopify admin
2. Create collar products (4 colors as variants on one product, or 4 separate products)
3. Create charm products (25 charms, each as a product or as variants)
4. Install "Headless" channel from Shopify App Store
5. Generate Storefront API public access token
6. Set permissions: Products, Collections, Cart

## Data Mapping

| Current `data.ts` | Shopify equivalent |
|---|---|
| `COLLARS[].name` | `product.title` |
| `COLLARS[].hex` | `product.metafield` or variant option |
| `ALL_CHARMS[].emoji` | `product.metafield` |
| `ALL_CHARMS[].bg` | `product.metafield` |
| Product price | `variant.price.amount` |

Collar color hex and charm emoji/bg will be stored as Shopify metafields (namespace: `pawlette`).

## What Does NOT Change

- All component files in `src/components/landing/`, `src/components/config-panel/`
- `globals.css` design tokens
- GSAP animations, framer-motion
- SEO infrastructure (`sitemap.ts`, `robots.txt`, JSON-LD)
- Guide pages
- `useWindowWidth` hook
- Font loading
