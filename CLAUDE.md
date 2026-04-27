# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Knowledge Base

Business research and brand strategy are documented in `/docs`:

- `docs/brand.md` — Brand name (Pawlette), color palette, typography, tone, Instagram strategy
- `docs/suppliers.md` — BioThane webbing, silicone charms, hardware, packaging, COGS breakdown
- `docs/3d-printing.md` — Custom charm printing: materials, local LT suppliers, EU services, workflow
- `docs/competitors.md` — Competitive landscape: Distinguish Me, Springland Pets, market gap analysis
- `docs/photography.md` — AI image generation prompts for product photography, including charm mounting detail

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server (usually port 3000 or 3001 if 3000 is taken)
npm run build     # production build + TypeScript check — run this before pushing
npm run lint      # ESLint
```

There are no tests. TypeScript type-checking runs as part of `next build`.

## Stack

- **Next.js 16.2.4** with App Router and Turbopack. See AGENTS.md — this version may differ from training data. Check `node_modules/next/dist/docs/` for current API.
- **React 19** — `use client` is required on all interactive components; the project uses no RSC data fetching.
- **Tailwind CSS v4** — configured via `@theme` blocks in `globals.css`, not `tailwind.config.*`. Use `cn()` from `src/lib/utils.ts` for conditional classes.
- **Styling convention**: inline `style` objects are the dominant pattern throughout the codebase. Tailwind utility classes appear mostly in `src/components/ui/`. Don't mix the two styles in the same component.
- **Animations**: GSAP (ScrollTrigger scroll animations in `LandingPage`) + framer-motion (`src/components/ui/hero-floating.tsx`, `hero-3.tsx`). GSAP is imported dynamically inside `useEffect` to keep it out of the initial bundle — maintain that pattern.

## Architecture

Two independent user flows, each with its own orchestrator:

**Landing page** (`/`) → `src/app/page.tsx` → `LandingPage.tsx`
Assembles `src/components/landing/` subcomponents. GSAP scroll animations are wired here via `data-animate="section"` and `data-animate="card"` attributes on wrapper divs. `StickyCTA` and `ExitModal` are toggled by scroll/mouseleave state owned by `LandingPage`.
Render order: `SocialTicker → LandingNav → FloatingHero → FeaturesStrip → ProductGrid → CharmGrid → PhotoSlider → BentoSection → Reviews → FAQ → LandingFooter`.

**Configurator** (`/configure`) → `src/app/configure/page.tsx` → `ProductConfigurator.tsx`
Owns all cart/selection state and passes it down to `CollarStage` (visual preview), `ConfigPanel` (4-step selection UI), `MiniCart`, and `UpsellModal`. State shape: `selectedCollar`, `selectedCharms: (string|null)[]`, `size`, `engraving`, `cartItems: CartItem[]`.

**Products page** (`/products`) → `src/app/products/page.tsx`
Self-contained page component with local `SimpleNav` and `CollarCard`/`CharmCard` helpers defined at module level in the same file. Has a server-component `src/app/products/layout.tsx` sibling that injects metadata + JSON-LD schema — this is the pattern for adding SEO to a `'use client'` page without restructuring it.

**Guide pages** (`/guide/*`) → `src/app/guide/*/page.tsx`
Fully server-rendered — **no `'use client'`**. These are the only pages in the project that are not client components. Do not add `'use client'` to them. Current guides: `how-to-measure-dog-collar`, `silicone-vs-nylon-dog-collars`.

**Commerce pages** — all `'use client'`, use `export default function`, `LandingNav` + `LandingFooter`:
- `/faq` → `src/app/faq/page.tsx` — full FAQ page with accordion
- `/cart` → `src/app/cart/page.tsx` — reads cart from `localStorage` key `pawlette_cart` (JSON array of `CartItem`)
- `/checkout` → `src/app/checkout/page.tsx` — contact/shipping/payment form, reads same localStorage cart
- `/account` → `src/app/account/page.tsx` — local `isLoggedIn` state, order history + profile tabs

## Cart persistence

Cart items are stored in `localStorage` under key `pawlette_cart` as a JSON array of `CartItem`. Read on mount via `useEffect` (hydration-safe pattern used in `/cart` and `/checkout`). `LandingNav`'s `onCart` prop should always call `router.push('/cart')` — it navigates, not opens a modal.

## Data layer

All product data lives in `src/lib/data.ts` — no API calls, no database. Key exports:
- `COLLARS` — 4 collar definitions (id, name, hex color, bgTint, glowColor)
- `ALL_CHARMS` — 25 charms with emoji and bg color
- `SIZES` — XS/S/M/L with neck range strings
- `CHARM_POSITIONS` / `FLOAT_DURATIONS` — used by `CollarStage` for animated charm placement
- `PRODUCTS` / `LANDING_REVIEWS` / `TICKER_ITEMS` — landing page static content
- `CartItem` interface — the shape passed into `MiniCart` and `UpsellModal`

## Design tokens

Brand colors are CSS custom properties defined in `src/app/globals.css`:
- `--color-sage: #A8D5A2` (green accent, CTAs)
- `--color-bark: #3D3530` (primary text/dark bg)
- `--color-cream: #FAF7F2` (page background)
- `--color-blossom / --color-sky / --color-honey` — collar palette tints

The `isDark` boolean prop on many components (e.g. `BentoSection`, `CollarStage`, `UrgencyBar`) switches between cream and dark-bark themes using inline style ternaries.

## Responsive pattern

`src/hooks/useWindowWidth.ts` returns `number | undefined` (undefined on SSR). All callers must use `useWindowWidth() ?? 1200` to default to desktop layout on first render — this is intentional to avoid hydration mismatches. Do not change the fallback value without updating all callers.

## SEO infrastructure

Static files in `public/`: `robots.txt` (AI bot allowlist), `llms.txt` (AI agent context), `pricing.md` (machine-readable pricing).
`src/app/sitemap.ts` — Next.js App Router sitemap, auto-generates `/sitemap.xml`. Add new routes here when creating pages.
JSON-LD schema is injected via `<script type="application/ld+json" dangerouslySetInnerHTML=…>` in server components (`layout.tsx` for site-wide schemas, `page.tsx` for page-level schemas). Never inject schema inside `'use client'` components.

## Fonts

`DM Sans` (body/UI), `Caveat` (handwritten accent), `Luckiest Guy` (headings — loaded from `/public/LuckiestGuy-Regular.ttf`). Always specify `fontFamily: "'DM Sans',sans-serif"` inline on top-level wrappers; there is no global body font set in CSS.

## Figma MCP Integration Rules

These rules govern all Figma-to-code work. Follow every step — do not skip.

### Required Flow

1. Call `get_design_context` with the node's `fileKey` and `nodeId` (convert `-` to `:` in the node ID from the URL).
2. If the response is truncated or too large, call `get_metadata` to get the high-level node map, then re-fetch only the needed nodes with `get_design_context`.
3. Call `get_screenshot` for a visual reference of the exact node variant being implemented.
4. Only after obtaining both `get_design_context` and `get_screenshot`, download any assets and begin implementation.
5. Translate the Figma output (React + Tailwind reference) into this project's conventions (see rules below).
6. Validate the finished UI against the Figma screenshot before marking complete.

### Styling Translation Rules

- IMPORTANT: The dominant styling pattern is **inline `style` objects**, not Tailwind classes. Translate any Tailwind from the Figma output into inline styles.
- Use Tailwind utility classes **only** inside `src/components/ui/` (shadcn primitives). Never introduce Tailwind into landing, config, or product components.
- Use `cn()` from `src/lib/utils.ts` exclusively for conditional class merging in `src/components/ui/` components.
- IMPORTANT: Never hardcode hex colors. Map Figma colors to CSS custom properties:
  - Cream/off-white → `var(--color-cream)` (`#FAF7F2`)
  - Dark/near-black → `var(--color-bark)` (`#3D3530`)
  - Green CTA → `var(--color-sage)` (`#A8D5A2`)
  - Pink tint → `var(--color-blossom)`
  - Blue tint → `var(--color-sky)`
  - Yellow tint → `var(--color-honey)`
  - All tokens are defined in `src/app/globals.css`.
- Dark/light theming is controlled by an `isDark` boolean prop — use inline ternaries (`isDark ? var(--color-bark) : var(--color-cream)`) rather than class toggling.

### Component Organization Rules

- Landing-page sections → `src/components/landing/`
- Configurator sub-panels → `src/components/config-panel/`
- Product/PDP components → `src/components/products/`
- Shared primitives (shadcn wrappers) → `src/components/ui/`
- Root-level orchestrators stay at `src/components/` (e.g. `LandingPage.tsx`, `ProductConfigurator.tsx`).
- All interactive components must have `'use client'` at the top.
- Export pattern: named export `export function ComponentName()` for components; `export default function PageName()` for page files in `src/app/`.

### Typography Rules

- Headings (h1/h2/h3): `fontFamily: "'Luckiest Guy', cursive"` — loaded from `/public/LuckiestGuy-Regular.ttf`.
- Body / UI text: `fontFamily: "'DM Sans', sans-serif"` — always set inline on top-level wrappers.
- Handwritten accent text: `fontFamily: "'Caveat', cursive"`.
- IMPORTANT: Never introduce new font imports. Use only the three families above.

### Responsive Rules

- Use `useWindowWidth()` from `src/hooks/useWindowWidth.ts` for breakpoint logic.
- IMPORTANT: Always default to `useWindowWidth() ?? 1200` — never change the fallback value.
- Implement responsive layouts with inline style ternaries keyed off `width`: `width < 768 ? mobileValue : desktopValue`.

### Asset Handling Rules

- IMPORTANT: If the Figma MCP server returns a `localhost` source URL for an image or SVG, use that source directly — do not copy or re-host the asset.
- Static assets (images, fonts) live in `public/`. Reference them as `/filename.ext` (no `/public` prefix).
- IMPORTANT: Do not install new icon packages. Use lucide-react (already installed) or inline SVGs from the Figma payload.
- Do not use placeholder images if a real Figma asset is available.

### Animation Rules

- Scroll animations use GSAP + ScrollTrigger. Import GSAP dynamically inside `useEffect` — never at the module top level.
- Component-level enter/exit animations use framer-motion.
- Do not add new animation libraries.

### Architecture Guardrails

- Guide pages (`/guide/*`) are fully server-rendered — never add `'use client'` to them.
- JSON-LD schema must only be injected in server components (`layout.tsx` or server `page.tsx`) — never inside `'use client'` components.
- All product/content data goes in `src/lib/data.ts` — no API calls or database queries.
