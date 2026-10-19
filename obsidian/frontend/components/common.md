---
tags: [frontend, catalog, wip]
updated: 2026-09-20
---

# Common Components Catalog

Shared composed components in `components/common/` — built from [[components/ui]]
primitives, reused across features.

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `PhotoHero` | `components/landing/PhotoHero.tsx` | Homepage hero: full-bleed photo (`public/hero/park-moment-cover*.jpg`), art-directed desktop/phone images via `getImageProps`, headline + CTA. Negative top margin must equal the nav height (92px phones, 94px md+). Replaced `ui/hero-floating.tsx` (3D scroll hero, kept for rollback) | #stable |
| `GuideLayout` | `components/guide/GuideLayout.tsx` | Server shell for guide pages: nav, footer, width, JSON-LD scripts | #stable |
| `GuideHeader`, `GuideSection`, `GuideCallout`, `GuideBullets`, `GuideLink`, `GuideNumberedList`, `GuideTable`, `GuideFaq`, `GuideCta` | `components/guide/GuideBlocks.tsx` | Content blocks for `/guide/*` pages (all server components) | #stable |

## Related

[[component-conventions]] · [[components/ui]]
