# Floating Gift Scratch-Card Discount Widget

**Date:** 2026-07-10
**Status:** Approved

## Goal

Add a floating gift icon (bottom-left, site-wide) that opens a full-screen "scratch card" dialog. The user scratches to reveal a discount amount, enters their email, and receives a discount code.

## Component

`src/components/shared/ScratchGiftWidget.tsx` — single self-contained `'use client'` component. Mounted once in `src/app/layout.tsx`, sibling to `<CookieConsentBanner />`, so it renders on every page (landing, products, cart, checkout, guides).

## States

Local state: `step: 'closed' | 'scratch' | 'email' | 'code'`.

1. **Floating icon** — fixed bottom-left circular button (`Gift` icon from lucide-react), `bg-sage`, `z-[400]`. Not rendered at all if `localStorage['pawlette_gift_claimed']` is already set (checked on mount, client-only).
2. **Scratch step** — full-screen modal, `fixed inset-0 z-[600]`, backdrop matching `UpsellModal`'s overlay pattern. A `<canvas>` covers a hidden reveal panel showing the discount ("10% NUOLAIDA", from `NEWSLETTER_DISCOUNT_PERCENT`). Pointer/touch drag erases the canvas via `globalCompositeOperation = 'destination-out'`. Canvas alpha is sampled periodically (e.g. every few move events, throttled) to compute % scratched; once > 50%, the canvas is cleared automatically and the view advances to the email step after a short delay.
3. **Email step** — same modal shell. Shows the revealed discount copy, an `InputField` for email, and a `PrimaryButton` ("Gauti kodą"). Submits to the existing `POST /api/newsletter` route unchanged — it already creates/upserts the Shopify customer with `acceptsMarketing: true` and returns `{ success, code }` using `NEWSLETTER_DISCOUNT_CODE`. No backend changes.
4. **Code step** — displays the returned code in a copyable pill (click-to-copy), a close button. On reaching this step, sets `localStorage['pawlette_gift_claimed'] = 'true'`.

## Behavior details

- Closing the dialog (backdrop click or a close `×`) before reaching the code step does **not** set the claimed flag — the icon remains and the user can retry (scratch progress is not persisted; reopening restarts the scratch step).
- Body scroll is locked while any dialog step is open (existing pattern: toggle a class / inline `overflow: hidden` on `<body>`, matching how other full-screen modals in this app behave — check `UpsellModal`/`ExitModal` for the established approach before adding new logic).
- ESC key closes the dialog.
- No new libraries. Canvas scratch effect is vanilla `<canvas>` + pointer events. Styling uses existing Tailwind tokens (`bg-sage`, `bg-cream`, `text-bark`, etc.) and CSS vars (`var(--color-sage)`, `var(--color-cream)`) only where canvas fill colors require actual color values (canvas APIs can't consume Tailwind classes).
- Reuses `NEWSLETTER_DISCOUNT_PERCENT` / `NEWSLETTER_DISCOUNT_CODE` from `src/lib/site-config.ts` — single fixed discount amount, no randomized tiers.

## Out of scope

- No new Shopify discount codes/tiers.
- No persistence of in-progress scratch state across reloads.
- No admin configuration for the widget — copy/percent come from existing `site-config.ts` constants.
