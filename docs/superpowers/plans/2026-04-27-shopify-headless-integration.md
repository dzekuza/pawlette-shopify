# Shopify Headless Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Duplicate the `dog` Next.js project into `dog-shopify` and wire it to Shopify's Storefront API at `floria-lt.myshopify.com`, replacing Supabase and static data with live Shopify product/cart data.

**Architecture:** Product data (collars, charms) fetched from Shopify Storefront API via `@shopify/storefront-api-client`. Cart managed via Shopify Cart API mutations with cart ID in `localStorage`. Checkout redirects to Shopify's hosted checkout URL. All UI components stay unchanged.

**Tech Stack:** Next.js 16.2.4, React 19, `@shopify/storefront-api-client`, Shopify Storefront API (GraphQL), Tailwind CSS v4, GSAP, framer-motion

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `/projects/dog-shopify/` | Create | Duplicate of `dog` |
| `src/lib/shopify.ts` | Create | Storefront API client + product queries |
| `src/lib/cart.ts` | Create | Shopify cart mutations |
| `src/lib/db.ts` | Modify | Replace Supabase queries with Shopify |
| `src/lib/data.ts` | Modify | Remove COLLARS, ALL_CHARMS, PRODUCTS |
| `src/lib/supabase.ts` | Delete | No longer needed |
| `src/components/ProductConfigurator.tsx` | Modify | Fetch collars/charms from Shopify on mount |
| `src/components/landing/CharmGrid.tsx` | Modify | Fetch charms from Shopify |
| `src/components/MiniCart.tsx` | Modify | Checkout button uses Shopify checkoutUrl |
| `src/app/cart/page.tsx` | Modify | Load cart from Shopify using stored cart ID |
| `src/app/checkout/page.tsx` | Modify | Redirect to Shopify hosted checkout |
| `.env.local` | Create | Shopify API credentials |
| `package.json` | Modify | Add `@shopify/storefront-api-client`, remove `@supabase/supabase-js` |

---

## Task 1: Duplicate Project Folder

**Files:**
- Create: `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/`

- [ ] **Step 1: Copy the folder**

```bash
cp -r /Users/rysardgvozdovic/Desktop/projects/dog /Users/rysardgvozdovic/Desktop/projects/dog-shopify
```

- [ ] **Step 2: Remove git history and node_modules from the copy**

```bash
rm -rf /Users/rysardgvozdovic/Desktop/projects/dog-shopify/.git
rm -rf /Users/rysardgvozdovic/Desktop/projects/dog-shopify/node_modules
rm -rf /Users/rysardgvozdovic/Desktop/projects/dog-shopify/.next
```

- [ ] **Step 3: Init new git repo**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git init
git add .
git commit -m "feat: initial copy of dog project for Shopify integration"
```

---

## Task 2: Install Shopify Client, Remove Supabase

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Delete: `src/lib/supabase.ts`

- [ ] **Step 1: Install Shopify Storefront API client**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
npm install @shopify/storefront-api-client
```

- [ ] **Step 2: Remove Supabase dependency**

```bash
npm uninstall @supabase/supabase-js
```

- [ ] **Step 3: Create `.env.local`**

Create file at `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/.env.local`:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=floria-lt.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token_here
```

> **Note:** Replace `your_storefront_token_here` after installing the Headless channel in Shopify admin (Shopify Admin → Sales Channels → Headless → Add storefront → copy Public access token).

- [ ] **Step 4: Delete `src/lib/supabase.ts`**

```bash
rm /Users/rysardgvozdovic/Desktop/projects/dog-shopify/src/lib/supabase.ts
```

- [ ] **Step 5: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add .
git commit -m "feat: install shopify storefront api client, remove supabase"
```

---

## Task 3: Create `src/lib/shopify.ts`

**Files:**
- Create: `src/lib/shopify.ts`

- [ ] **Step 1: Create the file**

Create `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/src/lib/shopify.ts`:

```typescript
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2025-04',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});

export interface ShopifyCollar {
  id: string;
  handle: string;
  title: string;
  variantId: string;
  price: string;
  color: string;       // hex from metafield pawlette.color
  bgTint: string;      // computed
  glowColor: string;   // computed
}

export interface ShopifyCharm {
  id: string;
  handle: string;
  title: string;
  variantId: string;
  price: string;
  bg: string;          // hex from metafield pawlette.bg
  category: string;    // from metafield pawlette.category
  image: string;       // featuredImage.url
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const COLLARS_QUERY = `
  query GetCollars {
    products(first: 10, query: "product_type:collar") {
      edges {
        node {
          id
          handle
          title
          variants(first: 1) {
            edges {
              node {
                id
                price { amount }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "color" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

const CHARMS_QUERY = `
  query GetCharms {
    products(first: 100, query: "product_type:charm") {
      edges {
        node {
          id
          handle
          title
          featuredImage { url }
          variants(first: 1) {
            edges {
              node {
                id
                price { amount }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "pawlette", key: "bg" },
            { namespace: "pawlette", key: "category" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

export async function getCollars(): Promise<ShopifyCollar[]> {
  const { data, errors } = await shopifyClient.request(COLLARS_QUERY);
  if (errors || !data) return [];

  return data.products.edges.map(({ node }: any) => {
    const colorMeta = node.metafields?.find((m: any) => m?.key === 'color');
    const color = colorMeta?.value ?? '#A8D5A2';
    const variant = node.variants.edges[0]?.node;
    return {
      id: node.handle,
      handle: node.handle,
      title: node.title,
      variantId: variant?.id ?? '',
      price: variant ? `€${parseFloat(variant.price.amount).toFixed(0)}` : '€28',
      color,
      bgTint: hexToRgba(color, 0.15),
      glowColor: hexToRgba(color, 0.5),
    };
  });
}

export async function getCharms(): Promise<ShopifyCharm[]> {
  const { data, errors } = await shopifyClient.request(CHARMS_QUERY);
  if (errors || !data) return [];

  return data.products.edges.map(({ node }: any) => {
    const bgMeta = node.metafields?.find((m: any) => m?.key === 'bg');
    const catMeta = node.metafields?.find((m: any) => m?.key === 'category');
    const variant = node.variants.edges[0]?.node;
    return {
      id: node.handle,
      handle: node.handle,
      title: node.title,
      variantId: variant?.id ?? '',
      price: variant ? `€${parseFloat(variant.price.amount).toFixed(0)}` : '€6',
      bg: bgMeta?.value ?? '#B8D8F4',
      category: catMeta?.value ?? 'icon',
      image: node.featuredImage?.url ?? '',
    };
  });
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/lib/shopify.ts
git commit -m "feat: add shopify storefront api client and product queries"
```

---

## Task 4: Create `src/lib/cart.ts`

**Files:**
- Create: `src/lib/cart.ts`

- [ ] **Step 1: Create the file**

Create `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/src/lib/cart.ts`:

```typescript
import { shopifyClient } from './shopify';

const CART_ID_KEY = 'pawlette_shopify_cart_id';

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string };
    price: { amount: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: ShopifyCartLine[];
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount }
              product { title }
            }
          }
        }
      }
    }
    cost {
      totalAmount { amount currencyCode }
    }
  }
`;

const CREATE_CART = `
  ${CART_FRAGMENT}
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
    }
  }
`;

const ADD_TO_CART = `
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
`;

const GET_CART = `
  ${CART_FRAGMENT}
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

const REMOVE_CART_LINES = `
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
    }
  }
`;

function parseCart(cartData: any): ShopifyCart {
  return {
    id: cartData.id,
    checkoutUrl: cartData.checkoutUrl,
    totalQuantity: cartData.totalQuantity,
    lines: cartData.lines.edges.map((e: any) => e.node),
    cost: cartData.cost,
  };
}

export function getStoredCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

export function setStoredCartId(id: string): void {
  localStorage.setItem(CART_ID_KEY, id);
}

export async function addLineToCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
  const cartId = getStoredCartId();

  if (cartId) {
    const { data } = await shopifyClient.request(ADD_TO_CART, {
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    });
    return parseCart(data.cartLinesAdd.cart);
  }

  const { data } = await shopifyClient.request(CREATE_CART, {
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
  });
  const cart = parseCart(data.cartCreate.cart);
  setStoredCartId(cart.id);
  return cart;
}

export async function fetchCart(): Promise<ShopifyCart | null> {
  const cartId = getStoredCartId();
  if (!cartId) return null;
  const { data } = await shopifyClient.request(GET_CART, { variables: { cartId } });
  if (!data?.cart) return null;
  return parseCart(data.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const { data } = await shopifyClient.request(REMOVE_CART_LINES, {
    variables: { cartId, lineIds: [lineId] },
  });
  return parseCart(data.cartLinesRemove.cart);
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/lib/cart.ts
git commit -m "feat: add shopify cart api helpers"
```

---

## Task 5: Update `src/lib/db.ts`

Replace Supabase queries with Shopify queries. Keep the `LandingCollar` interface and `getLandingCollars()` signature so `ProductGrid.tsx` needs no changes.

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Replace the entire file**

Replace contents of `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/src/lib/db.ts` with:

```typescript
import { getCollars, getCharms, type ShopifyCollar, type ShopifyCharm } from './shopify';

export type { ShopifyCollar as LandingCollar };
export type { ShopifyCharm as LandingCharm };

export interface LandingCollar {
  id: string | number;
  name: string;
  price: string;
  collarColor: string;
  bg: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  desc: string;
  charms: readonly { bg: string; e: string }[];
}

export async function getLandingCollars(): Promise<LandingCollar[]> {
  const collars = await getCollars();
  return collars.map((c) => ({
    id: c.id,
    name: c.title,
    price: c.price,
    collarColor: c.color,
    bg: c.bgTint,
    image: '',
    desc: 'Waterproof silicone collar with snap-on charms.',
    charms: [
      { bg: '#A8D5A2', e: '🌿' },
      { bg: '#B8D8F4', e: '⭐' },
      { bg: '#F9E4A0', e: '☀️' },
      { bg: '#D4B8F4', e: '🌸' },
    ],
  }));
}

export async function getLandingCharms(): Promise<LandingCollar[]> {
  return [];
}
```

> **Note:** The `image` field will be populated from Shopify product images once products are added in the admin. For now it returns empty string and the ProductGrid image element renders nothing gracefully.

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/lib/db.ts
git commit -m "feat: replace supabase db queries with shopify storefront api"
```

---

## Task 6: Update `src/lib/data.ts`

Remove `COLLARS`, `ALL_CHARMS`, `PRODUCTS` (now from Shopify). Keep static UI content.

**Files:**
- Modify: `src/lib/data.ts`

- [ ] **Step 1: Replace the file**

Replace contents of `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/src/lib/data.ts` with:

```typescript
export const SIZES = ['XS — 20–28 cm', 'S — 28–36 cm', 'M — 36–44 cm', 'L — 44–52 cm'] as const;

export const REVIEWS = [
  { name: 'Laima K.', dog: 'Luna, Beagle',   rating: 5, text: 'The collar survived two months of swimming and mud walks. Zero smell, zero stains.' },
  { name: 'Marta S.', dog: 'Bruno, Golden',  rating: 5, text: "Charms really do snap on in seconds. I was skeptical but it's genuinely that fast." },
  { name: 'Rūta P.',  dog: 'Mochi, Shiba',  rating: 5, text: 'Bought one, immediately ordered two more as gifts. Love that it\'s made in Lithuania.' },
] as const;

export interface CartItem {
  collarId: string;
  collarName: string;
  collarColor: string;
  collarBgTint: string;
  collarVariantId: string;
  charmIds: (string | null)[];
  charmVariantIds: (string | null)[];
  size: string;
  engraving: string;
  extra?: boolean;
}

export const CHARM_POSITIONS = [
  { x: -170, y: -55 },
  { x: -90,  y: -115 },
  { x: 0,    y: -135 },
  { x: 90,   y: -115 },
  { x: 170,  y: -55 },
] as const;

export const FLOAT_DURATIONS = [3.8, 4.2, 3.5, 4.8, 3.2] as const;

export const LANDING_REVIEWS = [
  { name: 'Laima K.', dog: 'Luna (Beagle)', rating: 5, text: "Ordered the Sage set and my dog gets compliments every walk. The charms really do snap on in seconds — I was skeptical but it's genuinely that fast." },
  { name: 'Marta S.', dog: 'Bruno (Golden)', rating: 5, text: 'The collar survived two months of swimming, mud walks, and a particularly rough beach day. Zero smell, zero stains. Absolutely worth it.' },
  { name: 'Rūta P.', dog: 'Mochi (Shiba)', rating: 5, text: "Bought one, immediately ordered two more as gifts. The Blossom collar in particular is just gorgeous. Love that it's made in Lithuania." },
] as const;

export const TICKER_ITEMS = [
  '🐾 Laima from Vilnius just ordered the Blossom set',
  '⭐ Marta rated the Sage collar 5 stars',
  '💧 Bruno survived a lake swim — collar looks brand new',
  '🛍 Rūta ordered 3 sets as gifts',
  '🌸 Mochi is wearing the new Hibiscus charm',
  '🇱🇹 Just restocked — Honey set is back',
  '⚡ "Took literally 5 seconds to swap" — Jurgita K.',
  '🐕 Luna got 4 compliments on one walk',
] as const;
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/lib/data.ts
git commit -m "feat: remove static product data from data.ts, keep ui content"
```

---

## Task 7: Update `ProductConfigurator.tsx`

Fetch collars and charms from Shopify on mount. Adapt local state to use `ShopifyCollar` / `ShopifyCharm`.

**Files:**
- Modify: `src/components/ProductConfigurator.tsx`

- [ ] **Step 1: Replace the imports and add fetch logic**

Find the top of `ProductConfigurator.tsx`. Replace:

```typescript
import { COLLARS, SIZES, type CartItem, type Collar } from '@/lib/data'
```

With:

```typescript
import { useState, useEffect } from 'react'
import { SIZES, type CartItem } from '@/lib/data'
import { getCollars, getCharms, type ShopifyCollar, type ShopifyCharm } from '@/lib/shopify'
import { addLineToCart, fetchCart } from '@/lib/cart'
```

- [ ] **Step 2: Replace state initialization**

Find the existing state declarations in `ProductConfigurator`:

```typescript
const [collar, setCollar] = useState<Collar>(COLLARS[0])
const [selectedCharms, setSelectedCharms] = useState<(string | null)[]>(['c1', 'c2', 'c3', null, null])
```

Replace with:

```typescript
const [collars, setCollars] = useState<ShopifyCollar[]>([])
const [charms, setCharms] = useState<ShopifyCharm[]>([])
const [collar, setCollar] = useState<ShopifyCollar | null>(null)
const [selectedCharms, setSelectedCharms] = useState<(string | null)[]>([null, null, null, null, null])
const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
```

- [ ] **Step 3: Add fetch useEffect**

After the existing state declarations, add:

```typescript
useEffect(() => {
  getCollars().then(data => {
    setCollars(data)
    if (data.length > 0) setCollar(data[0])
  })
  getCharms().then(setCharms)
  fetchCart().then(c => { if (c) setCheckoutUrl(c.checkoutUrl) })
}, [])
```

- [ ] **Step 4: Update addToCart handler**

Find the existing `addToCart` handler in ProductConfigurator (look for where `setCart` is called). Replace it with:

```typescript
const handleAddToCart = async () => {
  if (!collar) return
  const item: CartItem = {
    collarId: collar.id,
    collarName: collar.title,
    collarColor: collar.color,
    collarBgTint: collar.bgTint,
    collarVariantId: collar.variantId,
    charmIds: selectedCharms,
    charmVariantIds: selectedCharms.map(id => {
      if (!id) return null
      return charms.find(c => c.id === id)?.variantId ?? null
    }),
    size,
    engraving,
  }
  const updatedCart = await addLineToCart(collar.variantId)
  setCheckoutUrl(updatedCart.checkoutUrl)
  setCart(prev => [...prev, item])
  setCartOpen(true)
}
```

- [ ] **Step 5: Pass `charms` and `collars` down to child components**

Find where `CollarStage` and `ConfigPanel` are rendered. Add the new props:

```typescript
// CollarStage — add charms prop:
<CollarStage
  collar={collar ?? collars[0]}
  selectedCharms={selectedCharms}
  charms={charms}
  // ...existing props
/>

// ConfigPanel — add collars and charms props:
<ConfigPanel
  collars={collars}
  collar={collar ?? null}
  charms={charms}
  selectedCharms={selectedCharms}
  // ...existing props
/>
```

- [ ] **Step 6: Pass checkoutUrl to MiniCart**

Find where `MiniCart` is rendered and add the `checkoutUrl` prop:

```typescript
<MiniCart
  items={cart}
  checkoutUrl={checkoutUrl}
  onClose={() => setCartOpen(false)}
  onRemove={(i) => setCart(prev => prev.filter((_, idx) => idx !== i))}
/>
```

- [ ] **Step 7: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/components/ProductConfigurator.tsx
git commit -m "feat: fetch collars and charms from shopify in product configurator"
```

---

## Task 8: Update `CollarStage.tsx` and `ConfigPanel.tsx`

These components receive collar/charm data as props. Update prop types to accept `ShopifyCollar` / `ShopifyCharm` instead of the old static types.

**Files:**
- Modify: `src/components/CollarStage.tsx`
- Modify: `src/components/ConfigPanel.tsx`

- [ ] **Step 1: Update CollarStage prop types**

In `src/components/CollarStage.tsx`, find the props interface (e.g. `CollarStageProps`). Replace any import of `Collar` or `ALL_CHARMS` from `data.ts` with:

```typescript
import type { ShopifyCollar, ShopifyCharm } from '@/lib/shopify'
```

Update the props interface to use:
```typescript
interface CollarStageProps {
  collar: ShopifyCollar | null
  selectedCharms: (string | null)[]
  charms: ShopifyCharm[]
  // ...rest of existing props
}
```

Replace any internal reference to `ALL_CHARMS` (used to look up charm data by id) with a lookup on the `charms` prop:

```typescript
// Instead of: ALL_CHARMS.find(c => c.id === id)
// Use:        charms.find(c => c.id === id)
```

Replace any reference to `collar.color` or `collar.bgTint` — these field names are identical on `ShopifyCollar` so no change needed. If the old type used `collar.name`, replace with `collar.title`.

- [ ] **Step 2: Update ConfigPanel prop types**

In `src/components/ConfigPanel.tsx`, find the props interface. Replace any import of `Collar`, `ALL_CHARMS`, `COLLARS` from `data.ts` with:

```typescript
import type { ShopifyCollar, ShopifyCharm } from '@/lib/shopify'
```

Update the props interface:
```typescript
interface ConfigPanelProps {
  collars: ShopifyCollar[]
  collar: ShopifyCollar | null
  charms: ShopifyCharm[]
  selectedCharms: (string | null)[]
  // ...rest of existing props unchanged
}
```

Replace internal references:
- `COLLARS` array → `collars` prop
- `ALL_CHARMS` array → `charms` prop
- `collar.name` → `collar.title`
- Charm lookup: `ALL_CHARMS.find(c => c.id === id)` → `charms.find(c => c.id === id)`
- Charm image src: was `encodeURI(charm.image)` — keep the same, `ShopifyCharm.image` is a full URL

- [ ] **Step 3: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/components/CollarStage.tsx src/components/ConfigPanel.tsx
git commit -m "feat: update CollarStage and ConfigPanel to use ShopifyCollar/ShopifyCharm types"
```

---

## Task 9: Update `MiniCart.tsx`

Add `checkoutUrl` prop. Replace the hardcoded checkout navigation with a redirect to Shopify's hosted checkout.

**Files:**
- Modify: `src/components/MiniCart.tsx`

- [ ] **Step 1: Update MiniCartProps interface**

Find:
```typescript
interface MiniCartProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (i: number) => void;
}
```

Replace with:
```typescript
interface MiniCartProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (i: number) => void;
  checkoutUrl?: string | null;
}
```

- [ ] **Step 2: Update the Checkout button**

Find the Checkout button (search for "Checkout" text in the file). Replace the `onClick` handler:

```typescript
// Replace any existing router.push('/checkout') with:
onClick={() => {
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  }
}}
```

Add `checkoutUrl` to the destructured props at the top of the component:
```typescript
export function MiniCart({ items, onClose, onRemove, checkoutUrl }: MiniCartProps) {
```

- [ ] **Step 3: Update CartItem rendering**

The `CartItem` interface changed — `collar` is now flat fields. Update the render:

Find:
```typescript
item.collar.bgTint
item.collar.color
item.collar.name
item.charms.filter(Boolean)...
```

Replace with:
```typescript
item.collarBgTint
item.collarColor
item.collarName
item.charmIds.filter(Boolean)...
```

For charm lookup in MiniCart (was `ALL_CHARMS.find(ch => ch.id === id)`), MiniCart doesn't have access to charms array now. Simplify the charm display to just show count:

```typescript
// Replace the charm emoji dots with a simple count badge:
<div style={{ fontSize: 11, color: '#9B948F' }}>
  {item.charmIds.filter(Boolean).length} charms
</div>
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/components/MiniCart.tsx
git commit -m "feat: update MiniCart to use Shopify checkoutUrl"
```

---

## Task 10: Update `src/app/cart/page.tsx`

Load cart from Shopify using stored cart ID. Show live Shopify cart data.

**Files:**
- Modify: `src/app/cart/page.tsx`

- [ ] **Step 1: Replace the cart loading logic**

Find the `useEffect` that reads `localStorage.getItem('pawlette_cart')`. Replace the entire useEffect with:

```typescript
useEffect(() => {
  setMounted(true);
  fetchCart().then(cart => {
    if (cart) {
      setShopifyCart(cart);
      setCheckoutUrl(cart.checkoutUrl);
    }
  });
}, []);
```

- [ ] **Step 2: Replace cart state**

Replace `useState<CartItem[]>([])` with Shopify cart state:

```typescript
import { fetchCart, removeCartLine, type ShopifyCart } from '@/lib/cart';

const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
```

- [ ] **Step 3: Replace cart rendering**

Replace the existing cart items render with Shopify cart lines:

```typescript
const lines = shopifyCart?.lines ?? [];

// In JSX, replace CartItem map with:
{lines.length === 0 ? (
  <div style={{ textAlign: 'center', color: '#9B948F', padding: '60px 0' }}>
    Your cart is empty.
  </div>
) : lines.map((line) => (
  <div key={line.id} style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 0', borderBottom: '1px solid #E8E3DC',
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#3D3530' }}>
        {line.merchandise.product.title}
      </div>
      <div style={{ fontSize: 13, color: '#9B948F', marginTop: 2 }}>
        Qty: {line.quantity}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#3D3530' }}>
        €{(parseFloat(line.merchandise.price.amount) * line.quantity).toFixed(0)}
      </div>
      <button
        onClick={async () => {
          if (!shopifyCart) return;
          const updated = await removeCartLine(shopifyCart.id, line.id);
          setShopifyCart(updated);
        }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0A8A2', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}
      >
        Remove
      </button>
    </div>
  </div>
))}
```

- [ ] **Step 4: Update Checkout button**

Find the checkout button. Replace its `onClick`:

```typescript
onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
```

- [ ] **Step 5: Update totals display**

Replace hardcoded total calculation with Shopify cart cost:

```typescript
const total = shopifyCart
  ? parseFloat(shopifyCart.cost.totalAmount.amount).toFixed(2)
  : '0.00';
const currency = shopifyCart?.cost.totalAmount.currencyCode ?? 'EUR';
```

- [ ] **Step 6: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/app/cart/page.tsx
git commit -m "feat: update cart page to load from shopify cart api"
```

---

## Task 11: Update `src/app/checkout/page.tsx`

Replace the custom checkout form with a redirect to Shopify's hosted checkout.

**Files:**
- Modify: `src/app/checkout/page.tsx`

- [ ] **Step 1: Replace the entire file content**

Replace the contents of `/Users/rysardgvozdovic/Desktop/projects/dog-shopify/src/app/checkout/page.tsx` with:

```typescript
'use client';

import { useEffect } from 'react';
import { fetchCart } from '@/lib/cart';
import { LandingNav } from '@/components/landing/LandingNav';

export default function CheckoutPage() {
  useEffect(() => {
    fetchCart().then(cart => {
      if (cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl;
      }
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', fontFamily: "'DM Sans', sans-serif" }}>
      <LandingNav cartCount={0} onCart={() => {}} isDark={false} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div style={{ fontSize: 18, color: '#3D3530', fontWeight: 500 }}>
          Redirecting to checkout…
        </div>
        <div style={{ fontSize: 14, color: '#9B948F' }}>
          You&apos;ll complete your order on Shopify&apos;s secure checkout.
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/app/checkout/page.tsx
git commit -m "feat: replace custom checkout form with shopify hosted checkout redirect"
```

---

## Task 12: Update `CharmGrid.tsx`

Fetch charms from Shopify instead of importing `ALL_CHARMS` from `data.ts`.

**Files:**
- Modify: `src/components/landing/CharmGrid.tsx`

- [ ] **Step 1: Replace static import with Shopify fetch**

Find:
```typescript
import { ALL_CHARMS } from '@/lib/data';
```

Replace with:
```typescript
import { useEffect, useState } from 'react';
import { getCharms, type ShopifyCharm } from '@/lib/shopify';
```

- [ ] **Step 2: Replace static array with state**

Inside `CharmGrid()`, replace:

```typescript
const [selected, setSelected] = useState<string | null>(null);
const selectedCharm = ALL_CHARMS.find(c => c.id === selected);
```

With:

```typescript
const [charms, setCharms] = useState<ShopifyCharm[]>([]);
const [selected, setSelected] = useState<string | null>(null);
const selectedCharm = charms.find(c => c.id === selected);

useEffect(() => {
  getCharms().then(setCharms);
}, []);
```

- [ ] **Step 3: Replace ALL_CHARMS references**

Find all occurrences of `ALL_CHARMS` inside the component JSX and replace with `charms`.

For charm image rendering, the `image` field on `ShopifyCharm` is a full Shopify CDN URL (not a local path), so replace:
```typescript
src={encodeURI(charm.image)}
```
with:
```typescript
src={charm.image}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add src/components/landing/CharmGrid.tsx
git commit -m "feat: fetch charms from shopify in CharmGrid"
```

---

## Task 13: Fix TypeScript Build

Run the build and fix any remaining type errors.

- [ ] **Step 1: Run build**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
npm run build 2>&1 | head -80
```

- [ ] **Step 2: Fix type errors**

Common errors to expect and fix:

**`Collar` type not found** — any file still importing `Collar` from `data.ts` needs to be updated to import `ShopifyCollar` from `@/lib/shopify`.

**`ALL_CHARMS` not exported** — any file still importing `ALL_CHARMS` from `data.ts` needs to be updated to receive charms as props or use `getCharms()`.

**`CartItem` shape mismatch** — the new `CartItem` has `collarId`, `collarName`, `collarColor`, `collarBgTint` instead of `collar: Collar`. Update any component destructuring `item.collar.*` to use `item.collarName`, etc.

- [ ] **Step 3: Run build again to confirm clean**

```bash
npm run build 2>&1 | tail -20
```

Expected output ends with: `✓ Compiled successfully` or `Route (app)` table with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add -A
git commit -m "fix: resolve typescript build errors after shopify migration"
```

---

## Task 14: Shopify Admin Setup (Manual)

These steps are done in the browser at https://admin.shopify.com/store/floria-lt/

- [ ] **Step 1: Clean up existing products**

Go to Products → select all → Delete. This removes the floria flower products.

- [ ] **Step 2: Create collar products**

Create 4 products (one per collar color):

| Title | Product type | Price | Metafield `pawlette.color` |
|---|---|---|---|
| Blossom Collar | collar | 28.00 | #F4B5C0 |
| Sage Collar | collar | 28.00 | #A8D5A2 |
| Sky Collar | collar | 28.00 | #B8D8F4 |
| Honey Collar | collar | 28.00 | #F9E4A0 |

For each: add a product image, set the handle to `collar-blossom`, `collar-sage`, etc.

To add metafields: Settings → Custom data → Products → Add definition → Namespace: `pawlette`, Key: `color`, Type: Single line text. Then fill in the value on each product.

- [ ] **Step 3: Create charm products**

Create products for each charm with:
- Product type: `charm`
- Price: €6.00
- Metafields: `pawlette.bg` (hex color), `pawlette.category` (`letter` or `icon`)
- Add charm image as product image

- [ ] **Step 4: Install Headless channel**

Go to https://apps.shopify.com/headless and install. Then:
- Click "Create storefront"
- Copy the **Public access token**
- Paste it into `.env.local` as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

- [ ] **Step 5: Set API permissions**

In the Headless channel → Storefront API permissions → Enable:
- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_write_checkouts`
- `unauthenticated_write_customers`

---

## Task 15: Test End-to-End

- [ ] **Step 1: Start dev server**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
npm run dev
```

- [ ] **Step 2: Verify product data loads**

Open `http://localhost:3000` and confirm:
- Landing page ProductGrid shows collars fetched from Shopify
- CharmGrid shows charms fetched from Shopify
- No console errors about missing env vars

- [ ] **Step 3: Verify configurator**

Open `http://localhost:3000/configure` and confirm:
- Collar selector shows Shopify collars
- Charm grid shows Shopify charms
- Clicking "Add to Cart" calls Shopify Cart API (check Network tab for `cartCreate` or `cartLinesAdd` mutation)

- [ ] **Step 4: Verify checkout flow**

- Add item to cart
- Click "Checkout" in MiniCart
- Confirm browser redirects to `checkout.shopify.com/...`
- Confirm Shopify checkout shows the correct item

- [ ] **Step 5: Final commit**

```bash
cd /Users/rysardgvozdovic/Desktop/projects/dog-shopify
git add -A
git commit -m "chore: shopify headless integration complete"
```
