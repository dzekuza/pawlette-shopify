---
tags: [meta, changelog]
updated: 2026-10-19
---

# Changelog

Chronological log of notable changes to the project. Newest first.
This is a human-curated log — not a mirror of `git log`. Record *why*, not just
*what*; the diff already covers *what*.

## 2026-10-20 — Conversion batch (landing)

- **Hero price anchor:** `PhotoHero` takes `startingPrice` (lowest collar price from the landing products, via `lowestCollarPrice` in `LandingPage`) and shows "From €33.00 · 5 charms included" above the CTAs (`landing.hero.priceFrom`). The sticky bar's hardcoded "from €32.99" copy was corrected to €33.00 to match.
- **Mid-page CTAs:** new `SectionCta` ("Build your collar" → `#customize`, GA `cta_click` tagged per location) after the how-it-works timeline, the features bento, the gallery mosaic and the reviews section.
- **Reviews section:** new `ReviewsSection` before the buy card — rating chip, one featured quote and two supporting quotes (asymmetric, no equal 3-up), from the existing `products.pdp.reviews` + `PDP_REVIEW_*` constants. Those are still hard-coded; replace with real, verified reviews before using them in schema.
- **Newsletter consent:** `NewsletterSignup` and `ScratchGiftWidget` now require an explicit consent checkbox; `/api/newsletter` rejects requests without `consent: true` (400) and sets `acceptsMarketing` from it instead of always `true`.

## 2026-10-19 — "Browse every charm" grid removed from charm pages

- Removed the all-charms grid (`CharmCard` list) from `ProductPageShell`. It was the only internal-link path to the individual charm PDPs (`/products/charm-<letter>-<colour>`) for search crawlers; those URLs are still in the sitemap if listed there. `CharmCard.tsx` and the `products.pdp.allCharms` strings are now unused and left in place.

## 2026-10-19 — LandingFooter redesigned

- Footer is now a dark `bark` rounded card (`max-w-[1152px]`, 32px radius) inset on a cream strip: logo, tagline, handwriting "swap" note in sage and translucent pills on the left; three link columns on the right with cream-toned links and an underline on hover; thin divider and muted copyright/contact row. Inline styles and JS hover handlers replaced with classes. Copy and links unchanged. Used on every page that renders `LandingFooter` (landing, PDP, FAQ, cart, checkout).

## 2026-10-19 — ComparisonTable layout fixed

- Cards now span the full 1152px content width (the 920px cap is gone) in two equal columns. The collar image floats at the top-right of the PawsCharm card instead of taking a tall block, so the competitor card no longer has a large empty gap (image sized 330×250 on md+); both lists are bottom-aligned with matching rows, and the VS badge sits on the seam, vertically centred.

## 2026-10-19 — Section content width unified at 1152px

- `FeaturesStrip`, `GalleryMosaic`, `NewsletterSignup` (card) and `LandingBuySection` had inner boxes of 1200px / 1112px sitting inside the section's own `px-6`, so their content was wider/narrower than the nav pill, hero and the other sections (1200px container minus `px-6` = 1152px). All four now use `max-w-[1152px]`.

## 2026-10-19 — Hero card width matches the page container

- `PhotoHero` card max width is now 1152px (the content width of the 1200px / `px-6` container every other section and the nav pill use), down from 1400px; it still shrinks to fit the viewport height. Docs that mention the card limit: see the `PhotoHero` row in `components/common.md`.

## 2026-10-19 — Rest of the product page sections restyled

- `ProductStorySection`: photo pair (large frame + tilted overlapping second photo `hero-dsc02225.jpg`), pill eyebrow, roomier spacing.
- `ProductValueShowcase`: value badges are now pills with a sage check, bowed around the product (md+) instead of boxed columns; the product sits on soft drifting colour blobs (`animate-drift-*`); the `useWindowWidth` mobile/desktop branch was replaced by a CSS grid.
- `ComparisonTable`: two flat rounded cards (PawsCharm side tinted sage and wider, competitor side `surface-2`), row dividers, VS badge between them; shadow and inline styles removed.
- `FAQ` (also on the landing page): two columns on lg — heading (+ CTA) pinned on the left, accordion on the right; inline styles replaced with classes.
- All section eyebrows use the same soft pill. `About` and `PhotoSlider` had already been restyled.

## 2026-10-19 — About bento restyled

- `About` cards (used on the PDP and `LandingPageV2`): flat (no drop shadow), 28px radius, roomier padding and min-height, eyebrow as a soft pill, 26px heading and lighter 15px description in `bark-light`, sage tint via `color-mix` instead of raw rgba, inline `style` objects replaced with classes (`cn`, `object-contain object-right`). Header heading now uses the standard `section` size (the `md:text-[48px]` override was dropped).

## 2026-10-19 — Collar configurator: no preselected variant

- `useCollarConfigurator` no longer defaults `selectedColor` / `selectedSize` (colour tiles and sizes start unselected on the PDP and the landing buy card). New `canAddToCart` flag (colour chosen and, if the collar has sizes, size chosen) disables the add-to-cart button — which shows "Select color and size to buy" (`products.configurator.selectOptionsToBuy`) — and guards `buildCollarBundleLines` / `addCollarCharmToCart` so no arbitrary variant can be added. Changing colour keeps the size only if the new collar offers it, otherwise clears it.
- Not changed: the separate leash PDP (`LeashContext`) still defaults its colour/size; the 3D preview still shows the matched collar.

## 2026-10-19 — Collar configurator panel restyled

- Shared `CollarConfigurator` parts (used on the PDP and the landing buy card) moved from inline styles to Tailwind classes and refreshed: review chip + name/price stack, field labels with a value pill, rounded colour tiles with a selected border + check badge, sizes as a segmented control on a `surface-2` track (bark-filled selection), taller `h-14` add-to-cart using `hover:bg-sage-dark` instead of JS hover handlers/hex, and softer trust pills. Behaviour and props unchanged; the charm decorator panel, stepper, reviews and accordion were not touched.

## 2026-10-19 — Animated gradient behind the buy section

- `LandingBuySection` now has four blurred brand-colour blobs (sky, blossom, sage, honey) drifting slowly behind the 3D collar and configurator, faded out top and bottom with a CSS mask. New `drift-a/b/c` keyframes + `.animate-drift-*` classes in `globals.css` (transform-only, 18–28s loops); disabled under `prefers-reduced-motion` via `motion-reduce:animate-none`.

## 2026-10-19 — GalleryMosaic section added

- New `GalleryMosaic` (`components/landing/`) between `FeaturesStrip` and `LandingBuySection`: centred heading + a 7-photo bento mosaic (2 cols on phones, 4 on md+, spans tile with no gaps) built from existing studio photos plus `timeline-dog-3.jpg`. Tiles use `data-animate="card"` and a slow hover zoom. Copy under `landing.gallery` in `lt.json` / `en.json`.

## 2026-10-19 — HowItWorks photo stack grown to four cards

- Two new Gemini-generated portraits (`timeline-dog-3.jpg`, `timeline-dog-4.jpg`) join the existing two in a fanned four-card stack, driven by a `PHOTO_CARDS` array in `HowItWorks.tsx`; new `dog3Alt` / `dog4Alt` strings in `lt.json` / `en.json`. Prompts and lessons are in `docs/photography.md`.

## 2026-10-19 — PhotoSlider ("Your colorful moments") restyled

- Video cards are larger (280×440 desktop, 240×380 phones) with the product info moved into a frosted-glass chip overlaid at the bottom of the video (thumb, name, price, add-to-cart) instead of a strip underneath.
- The faded cream overlay on inactive cards is gone (inactive cards sit at 97% scale instead); the playing card shows a story-style progress bar driven by `timeupdate` (ref-based, no re-renders). Add-to-cart button uses lucide `Plus`/`Check` and classes instead of inline styles. The PDP video-only usage is unchanged. No drop shadows or bottom gradient on the cards or the chip. Heading and description are centred and stacked.

## 2026-10-19 — FeaturesStrip redesigned as a bento grid

- The six feature items are now frosted-glass bento tiles (4+2 / 2+4 / 3+3 on lg, 2 cols on md, 1 col on phones) with icon tile top-left and title + description bottom-aligned; hover lifts the tile. Tiles use `data-animate="card"` for the GSAP stagger.
- Section background moved off inline hex to `from-sky/35 to-sky`. 3D collar showcase and floating stickers unchanged. Titles stay `<p>` because the global unlayered `h1–h6` rule overrides Tailwind font utilities.

## 2026-10-19 — Card features as badges

- `ProductCard` features are now wrapping sage-tinted pill badges (check icon + text) instead of a stacked list.

## 2026-10-19 — HowItWorks section redesigned

- Two-column grid: heading + photo pair pinned (`lg:sticky`) on the left, a vertical timeline on the right (one gradient rail, a node per step, last node pulses; uppercase week label in `interactive-text`, display-font step titles, no pill chips). Steps use `data-animate="card"` for the existing GSAP stagger. Heading uses the standard `section` size.
- LT week labels were still English ("Week 1"); now "1 savaitė" / "4 savaitė" / "8 savaitė".

## 2026-10-19 — Product card features replace charm swatches

- `ProductCard` no longer shows the row of charm colour swatches; it lists three check-marked features per product type (collar / leash / charm), from `products.card.features` in `lt.json` / `en.json`. The Shopify `features` metafield is empty on all products, so copy is per type, not per product.
- Removed the `charmColorTitle` message key. `useAvailableCharmSwatches` is now unused by `ProductCard` (hook left in place).

## 2026-10-19 — Rating star contrast

- New token `--color-honey-dark` (`#E5AE1C`, `fill-honey-dark`/`text-honey-dark`) for stars on light chips; `ProductCard`'s rating star uses it because pale `honey` was nearly invisible on the grey chip. `ReviewStars` (PDP header chip, testimonial cards) now uses it too.

## 2026-10-19 — Product card hover image carousel

- New `HoverImageCarousel` (`components/storefront/`, client): when a mouse hovers a catalog card's media it crossfades through the product's gallery (first 4 images, 1.1s each) with a dot indicator, and resets on leave. Extra images mount only after first hover; touch and `prefers-reduced-motion` keep the static first image.
- `CatalogCardMedia` takes an optional `images` prop (uses the carousel when 2+ images); `ProductCard` passes `product.images` for `ProductDetail` items.

## 2026-10-19 — ProductGrid heading size

- Dropped the `text-[32px] md:text-[48px]` override on the ProductGrid H2 so it uses the standard `DisplayHeading` `section` size (30px / 40px md+).

## 2026-10-19 — Hero text tweak

- `PhotoHero` overlay: default left padding cut to 48px (grows to clear the video widget only when the card margin is small, 84px reference) and the lg+ H1 enlarged to `clamp(2.25rem,4.6cqw,4.75rem)`.

## 2026-10-19 — Header (`LandingNav`) redesigned

- Frosted-glass floating pill (`bg-cream/80` + blur, inner highlight, tinted shadow that strengthens after 8px scroll). Height is unchanged (92px phones, 94px md+) because `PhotoHero`'s negative top margin depends on it.
- Desktop: 3-column grid centres the links; active page gets a soft pill + sage dot (`aria-current`); CTA is now the dark `PrimaryButton`. Icons are lucide (`Gift`, `ShoppingBag`) in a shared `NavIconButton`.
- Phones: logo + gift + cart + dark hamburger; language switcher moves into the menu below `sm`. Menu overlay rebuilt with class-based transitions (no inline styles), numbered display links, a full-width sage CTA and footer row.
- `LanguageSwitcher` restyled as a hover chip. No new deps, fonts or i18n keys.

## 2026-10-19 — Hero restyled as an inset card (reference: Aurelia hero)

- `PhotoHero` is now a rounded inset photo card on a honey→cream→sage gradient: white headline over a bark gradient at the
  bottom-left, two chips (handmade in Vilnius, free shipping over the threshold), subheading, a filled sage CTA plus an outlined
  "browse charms" CTA, and a thin crosshair frame (`HeroHotspot`) calling out the EDIS collar ("Swap letters in 5 seconds").
  Phones and tablets stack the text under the photo; the overlay layout starts at 1024px and the hotspot at 1280px.
- Phones use the same 16:9 photo as desktop (the 4:5 crop was removed); headline line-height raised to 1.18 so descenders and the "ų" hook no longer touch the next line.
- LT H1 shortened to "Antkaklis šuniui su vardu" (still the head keyword phrase); "per 5 sekundes" moved into the subheading.
- Text is sized in container-query units and the left padding adapts so it never collides with the fixed bottom-left video widget.
- New `landing.hero` keys in lt/en: subheading, secondaryCta, chipHandmade, chipShipping, hotspot.

## 2026-10-19 — Photo hero replaces the 3D scroll hero

- Homepage hero is now `components/landing/PhotoHero.tsx`: the Gemini park-moment photo full-bleed on desktop (headline left over a
  cream scrim) and a 4:5 crop on phones with the headline below; one H1, same CTA and `hero_buy_now` GA event, new
  `landing.hero.imageAlt` translations (lt/en). It loads one priority image instead of three.js, which should also cut main-thread time.
- `ui/hero-floating.tsx` (pinned GSAP + 3D collar) is no longer rendered but was left in place for an easy rollback.
- Fixed a visible cream seam under the top bar: the sticky nav is 92px (phones) / 94px (md+) tall, so the hero's negative top margin
  must match exactly; verified 0px gap at 390, 768, 1024 and 1440 wide.

## 2026-10-19 — Hero cover images and Shopify catalog cleanup

- Added three hero cover images in `public/hero/` (desktop, alternate, 4:5 mobile crop) generated with Gemini from real product
  references; prompt and settings in `docs/photography.md`. Not yet wired into the hero component.
- Shopify store data (not code), done via the Admin API: rewrote collar, leash and both charm descriptions (removed the old
  "Pawlette" brand name and the unsupported "magnetic" claim, fixed a typo, added engraving/size/handmade facts the site already
  states), filled SEO title and description on all four products, added Lithuanian alt text to the 15 collar and leash images,
  and set SKUs on all 320 variants (`PAWS-COL-<colour>-<size>`, `PAWS-LSH-<colour>`, `PAWS-CHS-…` small and `PAWS-CHL-…` large charms).
- Product titles were deliberately not changed: the storefront derives slugs and lookups from them. Inventory tracking is still off
  for collars and leashes (zero-stock variants remain purchasable); that is a business decision left open.

## 2026-10-19 — Meta domain verification tag

- Added `facebook-domain-verification` to the root layout metadata (`verification.other`), so it renders in the
  static `<head>` of every page, including the home page. Needed to verify pawscharm.com in Meta Business
  Settings (Brand safety → Domains) before configuring events for ad optimisation. The value is a public tag.

## 2026-10-19 — two Lithuanian buyer guides for AI and search visibility

- OpenSEO's AI visibility check (ChatGPT, Gemini, Google AI Overviews; 14 answers) named PawsCharm in 4:
  on shopping questions ("where to find / compare / best for everyday use"), never on the informational
  ones ("how to choose", "what to check when ordering"). Added two server-rendered guides for those gaps:
  `/guide/kaip-isrinkti-antkakli-su-vardu` and `/guide/ka-patikrinti-uzsakant-antkakli-su-vardu`
  (answer-first intro, FAQ, Article + FAQPage + BreadcrumbList JSON-LD, comparison table).
- Claims only repeat what the site already states (S/M/L sizes, engraving at checkout, charms in ~5 s,
  handmade in Vilnius, free shipping threshold); material comparisons are labelled as general guidance.
- New shared building blocks in `src/components/guide/` (`GuideLayout`, `GuideBlocks`) and
  `src/lib/guide-schema.ts`. Added sitemap entries, two footer links (`chooseCollar`, `orderChecklist`)
  and `llms.txt` lines. Existing guides were not refactored onto the new components.
- Re-run the AI visibility check in a few weeks to see whether mentions on the informational prompts change.

## 2026-10-19 — orders-paid webhook logging

- `/api/shopify/orders-paid` now logs one line per delivery (rejected signature, skipped with reason,
  or processed with the per-pixel Conversions API result). Only the order number and event id are logged,
  never customer data, so webhook deliveries can be checked in Vercel runtime logs (a successful run
  previously left no trace there).

## 2026-10-19 — second Meta pixel moved into the business portfolio

- The personal pixel `1738084163919588` could not get a Conversions API token (Meta requires a business
  portfolio admin). Replaced the default second pixel with `3252638168278408`, owned by "Prosto Rička's
  Business" and connected to ad account `1429766462703402` ("PawsCharm account", EUR). Both defaults live in
  `MetaPixel.tsx` and `meta-capi.ts` and can be overridden with `NEXT_PUBLIC_META_PIXEL_ID_SECONDARY`.
  The old personal pixel and ad account `2759794937618469` are no longer used.

## 2026-10-19 — Purchase events to Meta via Shopify webhook

- Checkout runs on Shopify's domain, so the browser pixel never saw purchases (Shopify had 8 orders,
  Meta 0 `Purchase`). New `POST /api/shopify/orders-paid` verifies Shopify's HMAC and sends a
  `Purchase` to the Conversions API (`src/lib/meta-purchase.ts` maps the order; hashed email, phone,
  name, city, zip, country; order-derived `event_id` so Shopify retries dedupe).
- Consent gate: on add-to-cart the storefront writes `meta_consent`, `meta_fbp`, `meta_fbc` and
  `meta_event_source_url` to the Shopify cart (`syncMetaCartAttributes` in `src/lib/cart.ts`) only when the
  visitor accepted cookies. The webhook sends only orders carrying `meta_consent=granted`; others return
  `{ sent: false, reason: 'no-consent' }`. Shopify test orders are skipped.
- `sendMetaCapiEvent` now returns per-pixel results and posts to both pixels when each has a token
  (`META_CAPI_ACCESS_TOKEN`, `META_CAPI_ACCESS_TOKEN_SECONDARY`); `META_CAPI_TEST_EVENT_CODE` routes
  events to Events Manager's Test events tab. Signature check moved to `src/lib/shopify-webhook.ts`.
- Hardening: purchase event ids are now an HMAC of the order id (unguessable, still stable across
  Shopify retries), and `/api/meta-events` accepts only `ViewContent`, `AddToCart` and `InitiateCheckout`,
  rejecting `Purchase` and ids starting with `purchase-`, so a visitor can't forge or pre-empt a purchase.
- Verified: 12 unit tests (mapping, hashing, consent, signatures), route behaviour on a production
  build (401/400/405, skipped, rejected-by-Meta 502 with a fake token), and in the browser against the
  real Shopify cart (attributes present after accepting cookies, absent after declining).

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
