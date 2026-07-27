# Translation System (LT/EN) with Geo-Based Locale Detection — Design

## Problem

The storefront (pawscharm.com) is currently Lithuanian-only, with all copy hardcoded
directly in JSX across components and in `src/lib/data.ts`. There is no i18n library,
no locale routing, and no middleware. We want to add English as a second language and
show visitors the right one automatically based on where they're connecting from,
while still letting them switch manually.

## Scope

**Phase 1 (this spec + the implementation plan that follows it):**
- Routing + middleware infrastructure for two locales (`lt` default, `en`)
- Geo-detection + cookie override + language switcher
- `next-intl` wiring and message dictionaries
- Translated pages/components: `/` (landing) and all `src/components/landing/*`
  it renders, `/products`, `/configure`, plus shared chrome (`LandingNav`,
  `LandingFooter`, `CartDrawer`, `MiniCart`)
- `src/lib/data.ts` — collar/charm names & descriptions gain an `en` counterpart
- SEO: `hreflang` alternates, `sitemap.ts` locale entries, locale-aware JSON-LD in
  server components

**Phase 2 (explicitly out of scope here, tracked as follow-up work):**
- `/faq`, `/cart`, `/checkout`, `/account`
- `/guide/*` (server-rendered guide pages)
- `not-found` / `error` pages

**Explicitly out of scope, not part of this codebase at all:**
- Shopify-hosted checkout (`checkout.pawscharm.com`) localization. That's a separate
  system (Shopify Markets / Shopify admin language settings), not this Next.js app.
  If English checkout is wanted later, it's a Shopify admin config change, not a
  code change here.

## Architecture

### Routing

- Move routed pages under `src/app/[locale]/...` (App Router locale segment).
- Two locales: `lt` (default) and `en`.
- `localePrefix: 'as-needed'` — `lt` renders unprefixed (`/`, `/products`,
  `/configure`), `en` is prefixed (`/en`, `/en/products`, `/en/configure`). This
  keeps existing LT URLs stable (no redirect chains, no SEO disruption from the
  domain migration already in progress) while giving English a distinct,
  crawlable, bookmarkable URL space.
- `next-intl`'s App Router plugin (`createNavigation`, `next-intl/plugin` in
  `next.config.ts`) handles the locale-aware `Link`/`useRouter`/`usePathname`
  wrappers so internal links stay correct per-locale without manual string
  concatenation everywhere.

### Locale detection (`middleware.ts`, project root)

Runs on every request, in this priority order:

1. **Cookie override** — if `NEXT_LOCALE` cookie is present (set after a manual
   switcher click), use it. This always wins; it's the user's explicit choice.
2. **IP geolocation** — read `request.geo?.country` (Vercel edge geolocation,
   available for free on every Vercel deployment, no external API call, no added
   latency). Country `LT` → `lt`. Any other resolvable country → `en`.
3. **Accept-Language fallback** — used only when `geo.country` is unavailable
   (e.g. local dev without Vercel's edge context, or the request lacks geo data).
   Parse the header; `lt` prefix → `lt`, everything else → `en`.
4. Default to `lt` if none of the above resolve.

The middleware then delegates to `next-intl`'s `createMiddleware()` for the actual
rewrite/redirect to the resolved locale's path, so we don't hand-roll the routing
mechanics — only the locale-resolution policy above.

### Manual override (language switcher)

- A small locale switcher added to `LandingNav` (visible on both desktop and
  mobile nav states).
- On click: sets `NEXT_LOCALE` cookie (long-lived, e.g. 1 year) and navigates to
  the equivalent path under the other locale via `next-intl`'s locale-aware
  router, so `/products` ↔ `/en/products` swap correctly rather than bouncing to
  the home page.
- Because the cookie is checked first in middleware, this permanently overrides
  geo-detection for that browser until cleared.

### Content storage

- `src/messages/lt.json` and `src/messages/en.json` — the source of truth for all
  UI copy, nested by page/section, e.g.:
  ```json
  { "nav": { "cart": "Krepšelis" }, "landing": { "hero": { "title": "..." } } }
  ```
- Loaded via `next-intl`'s `useTranslations('namespace')` in client components and
  `getTranslations('namespace')` in server components/metadata.
- No runtime translation API, no per-request translation cost — a developer adding
  new copy adds it to both JSON files. This matches the existing project
  convention of static, code-owned content (`docs/design.md`, `src/lib/data.ts`)
  rather than introducing an external content/translation service.

### Product & charm data (`src/lib/data.ts`)

- Existing shape (illustrative):
  ```ts
  { id: 'collar-blossom', name: 'Žydinti', description: '...' }
  ```
- New shape — localized fields become small objects keyed by locale:
  ```ts
  { id: 'collar-blossom', name: { lt: 'Žydinti', en: 'Blossom' }, description: { lt: '...', en: '...' } }
  ```
- A small helper (`getLocalized(field, locale)`) centralizes the lookup so
  components don't repeat `field[locale]` everywhere and so a missing translation
  falls back to `lt` rather than rendering `undefined`.
- IDs, hex colors, prices, and other non-prose fields are untouched.

### SEO

- Per-page `generateMetadata` (or static `metadata` where already static) adds
  `alternates.languages: { lt: '<path>', en: '/en<path>' }` so search engines see
  both versions as declared alternates rather than duplicate content.
- `src/app/sitemap.ts` emits one entry per (route, locale) pair.
- JSON-LD schema blocks (server components only, per existing convention — never
  inside `'use client'`) pull their text from `getTranslations()` instead of
  hardcoded Lithuanian strings, so structured data matches the rendered language.

## Error handling / edge cases

- **Unresolvable geolocation** (local dev, some proxies): falls through to
  `Accept-Language`, then defaults to `lt`. Never blocks the request or 500s —
  worst case is a wrong-but-valid locale.
- **Direct navigation to an out-of-scope Phase 1 page** (e.g. `/en/faq` before
  Phase 2 lands): that route simply doesn't exist under `[locale]` yet for `en`
  content; it renders in Lithuanian only until Phase 2, matching current
  behavior. No broken links — Phase 1 pages don't link to Phase 2 pages using an
  `en`-prefixed path until those pages are translated.
- **Missing translation key**: `next-intl` throws in dev (fail fast, catches
  missed extraction immediately) and falls back to the key string in production
  builds rather than crashing the page.

## Testing

- `npm run build` must pass (TypeScript check + static generation for both locale
  trees).
- Manual verification: visit `/` and `/en` and confirm full LT/EN parity on
  landing, products, and configure flows; confirm the language switcher persists
  across a page reload (cookie set) and across an internal navigation (path
  swap); confirm `/sitemap.xml` lists both locale URLs.
- Simulate geo-detection locally by setting the `NEXT_LOCALE` cookie manually
  (Vercel's `request.geo` isn't populated in local dev) and by testing on a
  Vercel preview deployment where real edge geolocation is active.
