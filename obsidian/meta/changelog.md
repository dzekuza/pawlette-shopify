---
tags: [meta, changelog]
updated: 2026-10-19
---

# Changelog

Chronological log of notable changes to the project. Newest first.
This is a human-curated log — not a mirror of `git log`. Record *why*, not just
*what*; the diff already covers *what*.

## 2026-10-19 — Shopify catalog: webhook revalidation + server-rendered landing products

- New `shopifyCatalogClient` (`src/lib/shopify.ts`): read-only Storefront client whose
  server requests go through Next's data cache, tagged `shopify` (5 min `revalidate` as a
  backstop). Only `getCollars`, `getCharms`, `getLeashes` and `getCollectionProductHandles`
  use it. `shopifyClient` stays uncached for mutations, carts and account calls.
- New `POST /api/shopify/revalidate`: verifies Shopify's HMAC (`SHOPIFY_WEBHOOK_SECRET`) and
  calls `revalidateTag('shopify', 'max')`, so price and stock edits appear on the next visit.
  Register it in Shopify Admin > Settings > Notifications > Webhooks for products/create,
  products/update, products/delete, collections/update, inventory_levels/update.
- Server renders no longer use the per-instance in-memory memos (`CACHE_TTL_MS` is 0 on the
  server; `getLandingProducts` skips its Map on the server); browsers keep them.
- Homepage fetches `getLandingProducts(locale)` on the server and passes `initialProducts`
  to `LandingPage`, so the product grid is in the first HTML (0 -> 6 product mentions;
  previously loaded only after hydration).
- Hardening: the homepage now `notFound()`s any `[locale]` other than `lt`/`en` before fetching,
  and `getLandingProducts` no longer writes its per-locale memo on the server, so arbitrary URL
  segments can't grow server memory.

## 2026-10-19 — Lithuanian SEO copy for the "antkaklis su vardu" cluster

- Search Console (28 days) showed "antkakliai šunims su vardu" at position ~4 and
  "šuns antkaklis su vardu" at ~10, while `/products` and the collar PDP sat at
  positions ~60 for generic terms. Tuned copy around the name-collar phrasing:
  LT homepage H1 (`landing.hero.heading` in `lt.json`) and meta description,
  `/products` title and description, and the collar parent PDP title and description
  (`buildProductSeoTitle` / `buildProductSeoDescription` in `src/lib/seo.ts`).
- Titles and descriptions were checked to stay under Google's display limits; the PDP
  description is kept short because `clampDescription` truncates mid-sentence.

## 2026-10-19 — fix Vercel build: stale `Accordion` prop

- The composition-patterns refactor removed `isMobile` from `Accordion`, but
  `PavadeliaiPageContent` and `ProductsPageContent` still passed it, failing
  `next build` type-check on Vercel. Removed the prop at both call sites.
  Run `npx tsc --noEmit` before pushing.

## 2026-10-19 — second Meta Pixel

- `MetaPixel` now initialises two pixel IDs (`NEXT_PUBLIC_META_PIXEL_ID` and
  `NEXT_PUBLIC_META_PIXEL_ID_SECONDARY`, defaulting to `1738084163919588`). Client-side
  events (`PageView` and `trackMetaEvent`) reach both. The Conversions API mirror
  (`src/lib/meta-capi.ts`) still posts to the primary pixel only.
- The pasted raw snippet and its `<noscript>` image were deliberately not used: they fire
  before cookie consent. The second pixel loads behind the same consent gate.

## 2026-10-19 — single H1 on the homepage

- OpenSEO audit flagged two H1s on `/en`: the hero headline plus the product title in
  the `#customize` buy section (`CollarConfigurator.Header`, which always rendered an H1).
  `Header` now takes `as?: 'h1' | 'h2'` (default `h1`, so product pages are unchanged) and
  `LandingBuySection` passes `as="h2"`.
- Audit's noindex (9 single-letter charm variant pages) and canonical
  (`pawcharms-pakabuciai` -> `charm-charms`) notes are intentional; left as is.

## 2026-09-20 — vault initialised

- Project brain scaffolded from the shared `.project-brain` template: vault,
  root shims (`AGENTS.md` / `CLAUDE.md` / `.cursorrules`), and the three Claude
  Code hooks that keep this vault in sync.
