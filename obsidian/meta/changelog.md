---
tags: [meta, changelog]
updated: 2026-10-19
---

# Changelog

Chronological log of notable changes to the project. Newest first.
This is a human-curated log — not a mirror of `git log`. Record *why*, not just
*what*; the diff already covers *what*.

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
