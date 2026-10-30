---
tags: [frontend, catalog, wip]
updated: 2026-10-20
---

# Common Components Catalog

Shared composed components in `components/common/` — built from [[components/ui]]
primitives, reused across features.

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `PhotoHero` | `components/landing/PhotoHero.tsx` | Homepage card hero: inset rounded 16:9 background video (`public/hero/hero-loop.mp4`, muted/looping/inline, poster `hero-loop-poster.jpg`; replaced the old `park-moment-cover.jpg` photo), headline, chips and two CTAs over the photo from lg, stacked below it on phones/tablets. Card keeps the photo's 2200:1228 ratio and fits the viewport height; text scales with `cqw`. Negative top margin must equal the nav height (92px phones, 94px md+). Replaced `ui/hero-floating.tsx` (kept for rollback) | #stable |
| `HoverImageCarousel` | `components/storefront/HoverImageCarousel.tsx` | Client crossfade carousel used by `CatalogCardMedia` when a card has 2+ images: cycles on mouse hover only (max 4 images, dots), lazy-mounts extras, respects reduced motion | #stable |
| `GalleryMosaic` | `components/landing/GalleryMosaic.tsx` | Landing photo bento: heading + 7 dog photos in a 2→4 column span grid, sits right before the buy section; images/spans in the `TILES` constant | #stable |
| `ReviewsSection` | `components/landing/ReviewsSection.tsx` | Landing social proof: rating chip, featured quote + two supporting quotes, closing `SectionCta`; copy from `products.pdp.reviews` | #stable |
| `SectionCta` | `components/landing/SectionCta.tsx` | Dark "Build your collar" `PrimaryButton` linking to `#customize` with a GA `cta_click` (pass `location`) | #stable |
| `PrimaryButton` | `components/shared/PrimaryButton.tsx` | The one animated CTA button (label slides out, label + arrow slides in). Variants `dark` / `sage` / `ghost` (outline; white-on-glass over the hero photo from lg), sizes `sm/md/lg`, `href` / `onClick` / `type` / `disabled` / `fullWidth`. Strips a trailing "→" from string labels because the hover reveal draws its own arrow. Use it for every action button; icon buttons, selectors, accordions and text links stay custom | #stable |
| `LandingBuySection` | `components/landing/LandingBuySection.tsx` | Homepage buy block: 3D preview + flat `CollarConfigurator` sections (Colors, Sizes, Charms, AddToCart, TrustStrip, ReviewCarousel) — same options as the PDP `CollarBuyPanel`, minus videos, divider and info accordion | #stable |
| `ExitModal` | `components/landing/ExitModal.tsx` | Exit-intent newsletter dialog with a top photo banner (no 3D) (token classes, `PrimaryButton`, validated form, Esc to close). Posts to `/api/newsletter` (consent checkbox required), shows the discount code, fires GA `generate_lead` | #stable |
| `GuideLayout` | `components/guide/GuideLayout.tsx` | Server shell for guide pages: nav, footer, width, JSON-LD scripts | #stable |
| `GuideHeader`, `GuideSection`, `GuideCallout`, `GuideBullets`, `GuideLink`, `GuideNumberedList`, `GuideTable`, `GuideFaq`, `GuideCta` | `components/guide/GuideBlocks.tsx` | Content blocks for `/guide/*` pages (all server components) | #stable |

## Related

[[component-conventions]] · [[components/ui]]
