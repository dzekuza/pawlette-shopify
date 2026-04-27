# Tailwind CSS Migration — Full App

**Date:** 2026-04-26  
**Scope:** Full application (~40 files)  
**Status:** Approved, pending implementation plan

---

## Goal

Migrate the entire codebase from inline `style` objects to Tailwind CSS utility classes. Establish shared component primitives for consistency. Eliminate the `useWindowWidth` re-render anti-pattern in favour of CSS breakpoints.

---

## Section 1 — Token Strategy

Add all brand palette tokens to the `@theme` block in `src/app/globals.css` so they generate Tailwind utilities:

```css
@theme {
  /* existing tokens stay unchanged */

  /* brand palette — new additions */
  --color-bark: #3D3530;
  --color-bark-light: #6B6460;
  --color-bark-muted: #9B948F;
  --color-cream: #FAF7F2;
  --color-sage: #A8D5A2;
  --color-blossom: #F4B5C0;
  --color-sky: #B8D8F4;
  --color-honey: #F9E4A0;
  --color-surface-2: #F3EDE6;
  --color-border: #E8E3DC;
  --color-interactive-text: #2a5a25;

  /* font families */
  --font-sans: 'DM Sans', sans-serif;
  --font-display: 'Luckiest Guy', cursive;
  --font-handwriting: 'Caveat', cursive;
}
```

Resulting utilities: `bg-bark`, `text-cream`, `bg-sage`, `border-border`, `text-bark-muted`, `font-sans`, `font-display`, `font-handwriting`, etc.

The `:root` block is kept as-is for GSAP targets and any raw CSS variable references in JS strings.

---

## Section 2 — Class Conventions & `cn()`

All components use `className` with Tailwind utilities. Conditional classes use `cn()` from `src/lib/utils.ts`.

```tsx
// Before
<div style={{
  color: isDark ? 'var(--color-cream)' : 'var(--color-bark)',
  fontSize: 14,
  fontWeight: 600,
}}>

// After
<div className={cn(
  'text-sm font-semibold',
  isDark ? 'text-cream' : 'text-bark'
)}>
```

**Rules:**
- `isDark` boolean props stay — they become `cn()` arguments, not style ternaries
- Framer-motion and GSAP targets keep `style` **only** for animated values (transform, opacity during animation). Static styles move to `className`
- `cn()` is used for all conditional/merged class logic — no template literal string concatenation

---

## Section 3 — Shared Component Audit

All repeated visual patterns are extracted to `src/components/shared/`. Existing components (`PrimaryButton`, `SectionLabel`) are audited and converted to Tailwind.

| Component | Replaces | Used in |
|---|---|---|
| `Heading` | inline `h1/h2/h3` with Luckiest Guy + letter-spacing | LandingPage, PDP, Cart, Checkout, FAQ |
| `Badge` | inline `position: absolute` label overlays | ProductCard, CollarStage, ProductGrid |
| `Divider` | `<div style={{ height: 1, background: ... }}>` | Cart, Checkout, Order summary |
| `TrustNote` | "Secure checkout · Ships from Vilnius" paragraphs | Cart, Checkout |
| `InputField` | duplicated inline in Checkout — promote to shared | Checkout, Account |
| `SectionHeader` | heading + subtitle stacked block | Products, PDP, Landing sections |
| `PrimaryButton` (existing) | audit — ensure every CTA in the app uses it | All pages |
| `SectionLabel` (existing) | audit — ensure consistent usage | All pages |

**Rule:** A pattern appearing in 2+ places with the same visual intent becomes a shared component. One-offs stay local.

---

## Section 4 — Responsive Strategy

`useWindowWidth` is removed from all components.

**CSS breakpoints** (Tailwind prefixes) handle all layout, spacing, and typography differences:

```tsx
// Before
<div style={{ padding: isMobile ? '16px' : '40px' }}>

// After
<div className="px-4 md:px-10">
```

**Breakpoint mapping:**

| Tailwind prefix | px threshold | Replaces |
|---|---|---|
| `md:` | 768px | `width < 768` (isMobile) |
| `lg:` | 1024px | tablet layouts |
| `xl:` | 1280px | `width < 1280` (isCompactHero) |

**JS conditional rendering** stays only where components render structurally different JSX (e.g. `CollarStage` shows accordion on mobile, tabs on desktop). In those cases, replace `useWindowWidth` with `useMediaQuery('(max-width: 767px)')` — fixes the React best practice rule 5.10 re-render issue.

`useWindowWidth` hook is kept in the codebase but deprecated — only called internally by `useMediaQuery`. The `?? 1200` SSR fallback pattern is eliminated since CSS handles SSR natively.

---

## Section 5 — Migration Scope & Order

~40 files, executed in 5 waves. Build must pass after each wave before the next begins.

### Wave 1 — Foundation
- `src/app/globals.css` — add brand tokens + font tokens to `@theme`
- `src/hooks/useMediaQuery.ts` — new hook
- `src/components/shared/Heading.tsx` — new
- `src/components/shared/Badge.tsx` — new
- `src/components/shared/Divider.tsx` — new
- `src/components/shared/TrustNote.tsx` — new
- `src/components/shared/InputField.tsx` — promote from checkout
- `src/components/shared/SectionHeader.tsx` — new
- `CLAUDE.md` — update styling conventions

### Wave 2 — Shared + UI Components
- `src/components/shared/PrimaryButton.tsx` — convert to Tailwind
- `src/components/shared/SectionLabel.tsx` — convert to Tailwind
- `src/components/ui/hero-floating.tsx`
- Other `src/components/ui/` files that use inline styles

### Wave 3 — Landing Page (14 components)
In order: `SocialTicker` → `LandingNav` → `FeaturesStrip` → `FAQ` → `PhotoSlider` → `LandingFooter` → `StickyCTA` → `ExitModal` → `ProductGrid` → `CharmGrid` → `Reviews` → `Hero` → `BentoSection` → `LandingPage`

### Wave 4 — Commerce Pages
- `src/app/cart/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/account/page.tsx`

### Wave 5 — Configurator + PDP
- `src/components/CollarStage.tsx`
- `src/components/ConfigPanel.tsx`
- `src/components/ProductConfigurator.tsx`
- `src/components/UpsellModal.tsx`
- `src/components/products/SingleProductPage.tsx`
- `src/components/products/ProductCard.tsx`
- `src/components/products/ProductsPageContent.tsx`
- `src/components/products/ProductsPageContent.tsx`

---

## Conventions After Migration

| Pattern | Before | After |
|---|---|---|
| Static styles | `style={{ fontSize: 14, color: '...' }}` | `className="text-sm text-bark"` |
| Conditional styles | `style={{ color: isDark ? '...' : '...' }}` | `className={cn('text-bark', isDark && 'text-cream')}` |
| Responsive layout | `isMobile ? '16px' : '40px'` via JS | `px-4 md:px-10` |
| Breakpoint logic | `useWindowWidth() ?? 1200` | CSS `md:` / `xl:` prefixes |
| Structural conditional render | `useWindowWidth()` | `useMediaQuery('(max-width: 767px)')` |
| Animated values | stays in `style` | stays in `style` (GSAP/framer targets only) |
| Font families | `fontFamily: "'Luckiest Guy', cursive"` | `font-display` |
| Shared patterns | inline everywhere | `src/components/shared/` primitives |
