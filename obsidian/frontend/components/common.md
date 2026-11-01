---
tags: [frontend, catalog, wip]
updated: 2026-11-02
---

# Common Components Catalog

Shared composed components in `components/common/` — built from [[components/ui]]
primitives, reused across features.

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `PhotoHero` | `components/landing/PhotoHero.tsx` | Homepage card hero: inset rounded 16:9 background video (`public/hero/hero-loop.mp4`, muted/looping/inline, poster `hero-loop-poster.jpg`; replaced the old `park-moment-cover.jpg` photo), headline, chips and two CTAs over the photo from lg, stacked below it on phones/tablets. Card keeps the photo's 2200:1228 ratio and fits the viewport height; text scales with `cqw`. Negative top margin must equal the nav height (92px phones, 94px md+). Replaced `ui/hero-floating.tsx` (kept for rollback) | #stable |
| `HoverImageCarousel` | `components/storefront/HoverImageCarousel.tsx` | Client crossfade carousel used by `CatalogCardMedia` when a card has 2+ images: cycles on mouse hover only (max 4 images, dots), lazy-mounts extras, respects reduced motion | #stable |
| `GalleryMosaic` | `components/landing/GalleryMosaic.tsx` | Landing photo bento: heading + 7 dog photos in a 2→4 column span grid, sits right before the buy section; images/spans in the `TILES` constant | #stable |
| `CollarSwatchPreviews` | `components/products/CollarSwatchPreviews.tsx` | Live 3D collars for the PDP colour swatches: ONE r3f orthographic canvas (one WebGL context) draws a collar per swatch from `collar.glb`, laid out along the camera's screen-right axis to match the flex row (`gap` prop must equal the row's gap, 10px). Loaded with `next/dynamic` (ssr false) in `ConfiguratorSections.ColorSwatches`, overlaid on the buttons with pointer events forced off (`[&_*]:pointer-events-none!`, since r3f sets them inline). Strap colour = `ColorOption.strapColour` (collar hex). Default export, `onReady` must be a stable callback | #stable |
| `CharmSizePicker` | `components/products/CharmSizePicker.tsx` | Segmented Small (S) / Large (M/L) picker for the charm product page (`products.pdp.charmSize.*`). Props `value`, `options`, `onChange`; renders nothing unless both sizes exist. State lives in `CharmProductContext` (`sizeGroup`, `sizeGroups`, `setSizeGroup`) | #stable |
| `ReviewsSection` | `components/landing/ReviewsSection.tsx` | Landing social proof: rating chip, featured quote + two supporting quotes, closing `SectionCta`; copy from `products.pdp.reviews` | #stable |
| `SectionCta` | `components/landing/SectionCta.tsx` | Dark "Build your collar" `PrimaryButton` linking to `#customize` with a GA `cta_click` (pass `location`) | #stable |
| `PrimaryButton` | `components/shared/PrimaryButton.tsx` | The one animated CTA button (label slides out, label + arrow slides in). Variants `dark` / `sage` / `ghost` (outline; white-on-glass over the hero photo from lg), sizes `sm/md/lg`, `href` / `onClick` / `type` / `disabled` / `fullWidth`. Strips a trailing "→" from string labels because the hover reveal draws its own arrow. Hover motion is limited to `transition-[transform,opacity]` (no `transition-all`). Use it for every action button; icon buttons, selectors, accordions and text links stay custom | #stable |
| `LandingBuySection` | `components/landing/LandingBuySection.tsx` | Homepage buy block: 3D preview + flat `CollarConfigurator` sections (Colors, Sizes, Charms, AddToCart, TrustStrip, ReviewCarousel) — same options as the PDP `CollarBuyPanel`, minus videos, divider and info accordion | #stable |
| `Eyebrow` | `components/storefront/Typography.tsx` | Kicker label above a heading. Sentence case, 13px, no tracking (was uppercase 11px; changed in the 2026-11-02 landing unslop pass, see ADR-0007) | #stable |
| `ExitModal` | `components/landing/ExitModal.tsx` | Exit-intent newsletter dialog with a top photo banner (no 3D) (token classes, `PrimaryButton`, validated form, Esc to close). Posts to `/api/newsletter` (consent checkbox required), shows the discount code, fires GA `generate_lead` | #stable |
| `GuideLayout` | `components/guide/GuideLayout.tsx` | Server shell for guide pages: nav, footer, width, JSON-LD scripts | #stable |
| `GuideHeader`, `GuideSection`, `GuideCallout`, `GuideBullets`, `GuideLink`, `GuideNumberedList`, `GuideTable`, `GuideFaq`, `GuideCta` | `components/guide/GuideBlocks.tsx` | Content blocks for `/guide/*` pages (all server components) | #stable |

## Related

[[component-conventions]] · [[components/ui]]
