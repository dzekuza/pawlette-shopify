---
tags: [frontend, catalog, wip]
updated: 2026-09-20
---

# Common Components Catalog

Shared composed components in `components/common/` — built from [[components/ui]]
primitives, reused across features.

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `PhotoHero` | `components/landing/PhotoHero.tsx` | Homepage card hero: inset rounded 16:9 photo (`public/hero/park-moment-cover.jpg`, one `next/image` for all sizes), headline, chips and two CTAs over the photo from lg, stacked below it on phones/tablets. Card keeps the photo's 2200:1228 ratio and fits the viewport height; text scales with `cqw`. Negative top margin must equal the nav height (92px phones, 94px md+). Replaced `ui/hero-floating.tsx` (kept for rollback) | #stable |
| `HeroHotspot` | `components/landing/HeroHotspot.tsx` | Crosshair frame + label over the lettered collar; percent-positioned against the photo, so only valid while the card keeps the photo's aspect ratio; xl+ only | #stable |
| `HoverImageCarousel` | `components/storefront/HoverImageCarousel.tsx` | Client crossfade carousel used by `CatalogCardMedia` when a card has 2+ images: cycles on mouse hover only (max 4 images, dots), lazy-mounts extras, respects reduced motion | #stable |
| `GalleryMosaic` | `components/landing/GalleryMosaic.tsx` | Landing photo bento: heading + 7 dog photos in a 2→4 column span grid, sits right before the buy section; images/spans in the `TILES` constant | #stable |
| `GuideLayout` | `components/guide/GuideLayout.tsx` | Server shell for guide pages: nav, footer, width, JSON-LD scripts | #stable |
| `GuideHeader`, `GuideSection`, `GuideCallout`, `GuideBullets`, `GuideLink`, `GuideNumberedList`, `GuideTable`, `GuideFaq`, `GuideCta` | `components/guide/GuideBlocks.tsx` | Content blocks for `/guide/*` pages (all server components) | #stable |

## Related

[[component-conventions]] · [[components/ui]]
