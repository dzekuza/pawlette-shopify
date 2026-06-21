# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Knowledge Base

- `docs/design.md` — **Design system: components, tokens, styling rules. Read before writing any UI.**
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
- **Styling convention**: Tailwind token classes are the standard. Use `text-bark`, `bg-cream`, `bg-sage`, etc. — never hardcode hex values. Inline `style={{}}` is only allowed for dynamic JS-driven values (per-item data colors, animation transforms, `isDark` ternaries). When an inline style object must stay (because it mixes dynamic + static values), replace any raw hex with CSS vars (`var(--color-bark)`, `var(--color-cream)`, etc.) — never leave bare hex in a style prop. See `docs/design.md` for the full ruleset.
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

## Design system

**Read `docs/design.md` before writing any UI code.** It documents every shared component, every token, and the rules for when inline styles are vs. are not allowed.

Key token classes (Tailwind v4, generated from `@theme` in `globals.css`):
- `text-bark` / `bg-bark` → `#3D3530` primary text / dark bg
- `bg-cream` / `text-cream` → `#FAF7F2` page bg / light text
- `bg-sage` / `text-sage` → `#A8D5A2` green CTA accent
- `bg-blossom` → `#F4B5C0` · `bg-sky` → `#B8D8F4` · `bg-honey` → `#F9E4A0` — collar tints
- `text-bark-muted` → `#706B68` / `#9B948F` / `#6B6460` captions · `bg-surface-2` → `#F3EDE6` elevated surface
- `text-interactive-text` → `#2a5a25` sage-dark interactive / link color
- `text-bark-light` → `#6B6460` secondary text (lighter than bark-muted)
- Opacity variants: `bg-bark/10`, `bg-bark/50`, `text-cream/45` etc. — use Tailwind opacity syntax, never raw `rgba()`
- **Canonical max-width:** `max-w-[1200px]` — do not use 1160, 1120, or 1292. All layout wrappers use this.
- CSS vars for inline styles: `var(--color-bark)`, `var(--color-cream)`, `var(--color-sage)`, `var(--color-bark-muted)`, `var(--color-surface-2)`, `var(--color-border)`, `var(--color-sage-dark)`

Shared component quick-reference:
- **`PrimaryButton`** (`src/components/shared/`) — variants `dark` / `sage`, sizes `sm/md/lg`, supports `href`
- **`DisplayHeading`** (`src/components/storefront/Typography`) — sizes `hero/page/section/compact/floatingHero`
- **`Eyebrow`** — uppercase kicker label
- **`BodyCopy`** — body paragraph
- **`SectionIntro`** (`src/components/storefront/`) — eyebrow + heading + optional "See all" link
- **`PageHero`** — full page hero with eyebrow, heading, description, aside slot
- **`CatalogCard`** — compound product card (`CatalogCardLink` + `CatalogCardMedia` + sub-parts)
- **`SurfaceCard`** — card shell, variants `white/muted/hero/soft`
- **`ProductPrice`** — formats price, handles sale strikethrough
- **`TestimonialCard`** + **`ReviewStars`** — review cards
- **`TrustNote`** — micro trust line near CTAs
- **`Accordion`** — FAQ expandable item

The `isDark` boolean prop on legacy components (`BentoSection`, `CollarStage`, `UrgencyBar`) uses inline ternaries — this is an accepted pattern for those existing components only. New components should use a `dark:` variant or a wrapper class instead.

## Responsive pattern

`src/hooks/useWindowWidth.ts` returns `number | undefined` (undefined on SSR). All callers must use `useWindowWidth() ?? 1200` to default to desktop layout on first render — this is intentional to avoid hydration mismatches. Do not change the fallback value without updating all callers.

## SEO infrastructure

Static files in `public/`: `robots.txt` (AI bot allowlist), `llms.txt` (AI agent context), `pricing.md` (machine-readable pricing).
`src/app/sitemap.ts` — Next.js App Router sitemap, auto-generates `/sitemap.xml`. Add new routes here when creating pages.
JSON-LD schema is injected via `<script type="application/ld+json" dangerouslySetInnerHTML=…>` in server components (`layout.tsx` for site-wide schemas, `page.tsx` for page-level schemas). Never inject schema inside `'use client'` components.

## Fonts

`DM Sans` → `font-sans`, `Tomato Grotesk VF` → `font-display`, `Caveat` → `font-handwriting`. All three are registered in `@theme` in `globals.css` and available as Tailwind classes. `Luckiest Guy` is loaded via `@font-face` for demo/hero use only — reference it inline as `fontFamily: "'Luckiest Guy', cursive"` only in standalone demo pages (demo3, demo4, hero-floating, hero-3). Do not set fonts inline on shared components — use the Tailwind classes.

Font inline style rules:
- **Never** write `style={{ fontFamily: "'DM Sans', sans-serif" }}` — DM Sans is the body default, removing the inline style is sufficient. Only add `font-sans` explicitly when an element needs to override a parent that sets a different font.
- **Never** write `style={{ fontFamily: "'Tomato Grotesk VF'..." }}` — use `className="font-display"` or wrap with `<DisplayHeading>`.
- **Never** write `style={{ fontFamily: "'Caveat', cursive" }}` — use `className="font-handwriting"` or wrap with `<Eyebrow>`.

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

- IMPORTANT: Use **shared components first** — `DisplayHeading`, `SectionIntro`, `PrimaryButton`, `SurfaceCard`, `CatalogCard`, etc. before writing raw markup. See `docs/design.md` for the full component reference.
- Use **Tailwind token classes** (`text-bark`, `bg-cream`, `bg-sage`, `bg-surface-2`, etc.) for all static styles. Never hardcode hex values in `className` or `style`.
- Inline `style={{}}` is allowed **only** for dynamic JS-driven values: per-item data colors, animation transforms, or `isDark` ternaries on legacy components.
- When an inline style object must remain (dynamic sibling values), replace any raw hex with CSS vars — e.g. `color: 'var(--color-bark)'` not `color: '#3D3530'`.
- Use `cn()` from `src/lib/utils.ts` for all conditional class merging.
- Map Figma colors to tokens — never to raw hex:
  - Cream/off-white → `bg-cream` / `var(--color-cream)`
  - Dark/near-black → `text-bark` / `bg-bark` / `var(--color-bark)`
  - Green CTA → `bg-sage` / `var(--color-sage)`
  - Pink → `bg-blossom` · Blue → `bg-sky` · Yellow → `bg-honey` · Purple → `bg-lavender`
  - Surface/elevated → `bg-surface-2` / `var(--color-surface-2)` (covers `#F3EDE6`, `#F0EDE8`, `#EDEAE4`, `#F0EBE5`)
  - Muted text → `text-bark-muted` (covers `#9B948F`, `#6B6460`, `#706B68`, `#8f8680`)
  - Interactive green → `text-interactive-text` / `var(--color-interactive-text)` (covers `#2a5a25`, `#3a7a3a`)
  - Border lines → `var(--color-border)` (covers `#E8E3DC`)
- Dark/light theming on **new** components: use a wrapper class or `dark:` variant. On existing `isDark`-prop components, continue using inline ternaries.

### Component Organization Rules

- Landing-page sections → `src/components/landing/`
- Configurator sub-panels → `src/components/config-panel/`
- Product/PDP components → `src/components/products/`
- Shared primitives (shadcn wrappers) → `src/components/ui/`
- Root-level orchestrators stay at `src/components/` (e.g. `LandingPage.tsx`, `ProductConfigurator.tsx`).
- All interactive components must have `'use client'` at the top.
- Export pattern: named export `export function ComponentName()` for components; `export default function PageName()` for page files in `src/app/`.

### Typography Rules

- Use `DisplayHeading`, `Eyebrow`, `BodyCopy` from `src/components/storefront/Typography.tsx` for all section/page text.
- Use `Heading` from `src/components/shared/Heading.tsx` for semantic headings that don't need the `DisplayHeading` green color treatment.
- Font classes: `font-display` (Tomato Grotesk VF — headings), `font-sans` (DM Sans — body/UI), `font-handwriting` (Caveat — accent).
- `Luckiest Guy` is for standalone demo pages only (demo3, demo4, hero-floating, hero-3) — never in shared landing components, not-found, or commerce pages.
- IMPORTANT: Never write `fontFamily` inline in any shared component — always use the Tailwind class or the component wrapper.
- IMPORTANT: Never introduce new font imports. The three families above plus Luckiest Guy are fixed.

### Responsive Rules

- Use Tailwind responsive prefixes (`md:`, `lg:`) for layout changes that can be expressed in CSS.
- Only fall back to `useWindowWidth()` for logic that requires JS (conditionally rendering a component, toggling JS behavior).
- IMPORTANT: Always default to `useWindowWidth() ?? 1200` — never change the fallback value.
- When JS breakpoint logic is needed: `const isMobile = (useWindowWidth() ?? 1200) < 768`.

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
