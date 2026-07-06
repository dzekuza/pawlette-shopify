# PawCharms Design System

This document is the single source of truth for all UI work in this codebase.
**Always read this before writing any component, page, or section.**

---

## Core Rules

1. **Components before markup.** Before writing a `<div>`, check whether a shared component already exists. If it does, use it.
2. **Tailwind tokens before hex values.** Never hardcode `#3D3530` — use `text-bark`, `bg-bark`, `var(--color-bark)`.
3. **No inline `style` objects** except for dynamic values that cannot be expressed in Tailwind (e.g. a JS-interpolated `transform` or a per-item `background` driven by data).
4. **No new fonts, no new icon packages.** The font stack and lucide-react are fixed.
5. **`cn()` for conditional classes** — never string concatenation.

---

## Design Tokens

All tokens are defined in `src/app/globals.css` inside `@theme {}` and also as `:root` CSS custom properties.
Tailwind v4 auto-generates utility classes from `@theme` — use the class names, not raw hex.

### Color tokens

| CSS variable | Tailwind class | Hex | Usage |
|---|---|---|---|
| `--color-bark` | `text-bark` / `bg-bark` | `#3D3530` | Primary text, dark surfaces, buttons |
| `--color-bark-light` | `text-bark-light` | `#6B6460` | Secondary text |
| `--color-bark-muted` | `text-bark-muted` | `#706B68` | Captions, labels, placeholders |
| `--color-cream` | `bg-cream` / `text-cream` | `#FAF7F2` | Page background, light text on dark |
| `--color-surface-2` | `bg-surface-2` | `#F3EDE6` | Elevated surfaces, muted cards |
| `--color-border` | `border-border` | `#E8E3DC` | Dividers, input borders |
| `--color-sage` | `bg-sage` / `text-sage` | `#A8D5A2` | Green accent — primary CTA |
| `--color-blossom` | `bg-blossom` / `text-blossom` | `#F4B5C0` | Pink accent — collar tint |
| `--color-sky` | `bg-sky` / `text-sky` | `#B8D8F4` | Blue accent — collar tint |
| `--color-honey` | `bg-honey` / `text-honey` | `#F9E4A0` | Yellow accent — collar tint |
| `--color-lavender` | `bg-lavender` / `text-lavender` | `#D4B8F4` | Purple accent |
| `--color-bark-divider` | — | `rgba(61,53,48,0.08)` | Use `border-bark/8` |
| `--color-bark-border` | — | `rgba(61,53,48,0.15)` | Use `border-bark/15` |
| `--color-bark-overlay` | — | `rgba(61,53,48,0.50)` | Use `bg-bark/50` |
| `--color-cream-glass` | — | `rgba(250,247,242,0.96)` | Use `bg-cream/[0.96]` |

### Typography tokens

| CSS variable | Tailwind class | Font |
|---|---|---|
| `--font-sans` | `font-sans` | DM Sans — body, UI, labels |
| `--font-display` | `font-display` | Tomato Grotesk VF — headings (h1/h2/h3) |
| `--font-handwriting` | `font-handwriting` | Caveat — accent / handwritten text |

`Luckiest Guy` is available for display-only hero headings on demo/landing variants. Use it via `fontFamily: "'Luckiest Guy', cursive"` inline only in standalone demo pages, never in shared components.

---

## Component Library

### Typography — `src/components/storefront/Typography.tsx`

Always import these instead of writing raw `<h1>`, `<p>`, or `<span>` with hardcoded classes.

```tsx
import { Eyebrow, DisplayHeading, BodyCopy } from '@/components/storefront/Typography'

// Kicker / overline label
<Eyebrow>Kolekcija</Eyebrow>
// → 11px uppercase, tracking-wide, text-bark-muted

// Section / page heading
<DisplayHeading size="section">Rink savo pakabukai</DisplayHeading>
// sizes: 'hero' | 'page' | 'section' | 'compact' | 'floatingHero'

// Body paragraph
<BodyCopy className="max-w-[48ch]">
  Silikoniniai antkakliai su keičiamais pakabukai.
</BodyCopy>
```

**`DisplayHeading` sizes:**

| Size | Output size | Use case |
|---|---|---|
| `hero` | 48px → 72px | Full-screen hero h1 |
| `page` | clamp(2.4rem, 5vw, 4.4rem) | Page-level h1 |
| `section` | 30px → 40px | Section headings |
| `compact` | 22px → 26px | Card headings, sub-sections |
| `floatingHero` | clamp(3.9rem, 8vw, 6.8rem) | Oversized floating hero |

---

### Heading — `src/components/shared/Heading.tsx`

Use when you need a simple semantic heading without the `DisplayHeading` color treatment.

```tsx
import { Heading } from '@/components/shared/Heading'

<Heading as="h2" size="lg">Tavo šuo, tavo taisyklės</Heading>
// sizes: 'xl' | 'lg' | 'md' | 'sm'
```

---

### SectionIntro — `src/components/storefront/SectionIntro.tsx`

Use at the top of every content section that needs an eyebrow + heading + optional "See all" link.

```tsx
import { SectionIntro } from '@/components/storefront/SectionIntro'

<SectionIntro
  eyebrow="Pakabukai"
  title="Rink savo kolekciją"
  description="18+ skirtingų dizainų."     // optional
  actionHref="/products"                    // optional
  actionLabel="Visi pakabukai →"            // optional
/>
```

---

### SectionHeader — `src/components/shared/SectionHeader.tsx`

Lighter alternative to `SectionIntro` — just title + subtitle, no eyebrow or action link.

```tsx
import { SectionHeader } from '@/components/shared/SectionHeader'

<SectionHeader title="Kaip tai veikia?" subtitle="Trys žingsniai iki tobulo antkaklio." />
```

---

### PageHero — `src/components/storefront/PageHero.tsx`

Full page-level hero with eyebrow, display heading, optional description and aside slot.

```tsx
import { PageHero } from '@/components/storefront/PageHero'

<PageHero
  eyebrow="Personalizuoti šunų antkakliai"
  title="Antkakliai, kurie kalba."
  description="Silikoniniai antkakliai su keičiamais pakabukai."
  centered={false}      // default false — left-aligned
  tone="hero"           // 'plain' | 'hero'
  aside={<Image ... />} // optional right-column slot
/>
```

---

### PrimaryButton — `src/components/shared/PrimaryButton.tsx`

The only button to use for primary actions. Wraps `ui/button` with brand variants.

```tsx
import { PrimaryButton } from '@/components/shared/PrimaryButton'

// Link button
<PrimaryButton href="/products" variant="dark" size="lg">
  Kurk savo antkaklį →
</PrimaryButton>

// Callback button
<PrimaryButton onClick={handleAddToCart} variant="sage" size="md" fullWidth>
  Pridėti į krepšelį
</PrimaryButton>
```

**Variants:** `dark` (bark background, cream text) · `sage` (green background, bark text)
**Sizes:** `sm` · `md` (default) · `lg`

---

### CatalogCard — `src/components/storefront/CatalogCard.tsx`

The standard product card. Always use for product grids — never build ad-hoc cards.

```tsx
import {
  CatalogCardLink,
  CatalogCardMedia,
  CatalogCardTitle,
  CatalogCardDescription,
} from '@/components/storefront/CatalogCard'

<CatalogCardLink href={`/products/${product.slug}`}>
  <CatalogCardMedia
    image={product.image}
    alt={product.name}
    background={product.bgTint}  // optional tinted bg
  />
  <CatalogCardTitle>{product.name}</CatalogCardTitle>
  <CatalogCardDescription>{product.price}</CatalogCardDescription>
</CatalogCardLink>
```

---

### SurfaceCard — `src/components/storefront/SurfaceCard.tsx`

Card shell with brand-consistent border radius (28px) and surface variants. Use for feature cards, testimonial wrappers, stat blocks.

```tsx
import { SurfaceCard, SurfaceCardBody } from '@/components/storefront/SurfaceCard'

<SurfaceCard variant="muted" padding="compact">
  <SurfaceCardBody>
    <p>Content here</p>
  </SurfaceCardBody>
</SurfaceCard>
```

**Variants:** `white` · `muted` (surface-2 bg) · `hero` (multi-stop gradient) · `soft` (subtle gradient)
**Padding:** `compact` · `default` · `roomy`

---

### ProductPrice — `src/components/storefront/ProductPrice.tsx`

Formats price strings, handles sale state with strikethrough + savings badge.

```tsx
import { ProductPrice } from '@/components/storefront/ProductPrice'

<ProductPrice
  currentPrice="29.99"
  originalPrice="39.99"   // optional — shows strikethrough + savings badge
  size="detail"            // 'card' | 'detail'
  showSavingsBadge         // optional
/>
```

---

### TestimonialCard + ReviewStars — `src/components/storefront/TestimonialCard.tsx`

```tsx
import { TestimonialCard, ReviewStars } from '@/components/storefront/TestimonialCard'

<ReviewStars rating={4.9} showValue />

<TestimonialCard
  author="Greta K."
  avatar="/avatars/greta.jpg"
  quote="Mano Snukutis dabar labiausiai stilingas parke!"
  rating={5}
  preview="/photos/greta-dog.jpg"
/>
```

---

### TrustNote — `src/components/shared/TrustNote.tsx`

Micro trust line shown near CTAs and add-to-cart buttons.

```tsx
import { TrustNote } from '@/components/shared/TrustNote'

<TrustNote />
// → "Saugus atsiskaitymas · Siunčiama iš Vilniaus 🇱🇹"

<TrustNote>Nemokamas pristatymas nuo €40</TrustNote>
```

---

### SectionLabel — `src/components/shared/SectionLabel.tsx`

Standalone eyebrow label when `SectionIntro` is overkill.

```tsx
import { SectionLabel } from '@/components/shared/SectionLabel'
<SectionLabel>Pakabukai</SectionLabel>
```

---

### Badge — `src/components/shared/Badge.tsx` → `src/components/ui/badge.tsx`

```tsx
import { Badge } from '@/components/shared/Badge'
<Badge variant="outline">Naujiena</Badge>
<Badge variant="secondary">Populiaru</Badge>
```

---

### Accordion — `src/components/shared/Accordion.tsx`

Expandable FAQ item. Use for FAQ sections — not raw `<details>` or custom toggles.

```tsx
import { Accordion } from '@/components/shared/Accordion'
<Accordion title="Ar antkakliai vandeniui atsparūs?">
  Taip — maistinio silikono medžiaga.
</Accordion>
```

---

## Responsive pattern

Use Tailwind responsive prefixes (`md:`, `lg:`) in component classes.
Only fall back to `useWindowWidth()` for logic that cannot be expressed in CSS (e.g. conditionally rendering a component, toggling JS behavior).

```tsx
// Correct — CSS-only responsive
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">

// Only when JS logic is genuinely required
const w = useWindowWidth() ?? 1200
const isMobile = w < 768
```

---

## File placement

| What | Where |
|---|---|
| Shadcn primitives | `src/components/ui/` |
| Storefront atoms (Price, Card, Hero, Typography) | `src/components/storefront/` |
| Shared primitives (Button, Heading, Badge) | `src/components/shared/` |
| Landing-page sections | `src/components/landing/` |
| PDP / product-specific | `src/components/products/` |
| Configurator sub-panels | `src/components/config-panel/` |

---

## What NOT to do

```tsx
// ✗ Hardcoded hex in className
<div className="text-[#3D3530] bg-[#FAF7F2]">

// ✓ Token class
<div className="text-bark bg-cream">

// ✗ Inline style for a static value
<h2 style={{ fontFamily: "'DM Sans', sans-serif", color: '#3D3530' }}>

// ✓ Token class + font-sans from @theme
<h2 className="font-sans text-bark">

// ✗ Ad-hoc card markup
<div style={{ borderRadius: 20, background: '#F3EDE6', padding: 24 }}>

// ✓ SurfaceCard
<SurfaceCard variant="muted" padding="compact">

// ✗ Raw heading
<h2 style={{ fontFamily: "'Tomato Grotesk VF'", fontSize: 40 }}>Heading</h2>

// ✓ DisplayHeading
<DisplayHeading size="section">Heading</DisplayHeading>

// ✗ Custom pill button
<button style={{ background: '#A8D5A2', borderRadius: 100, padding: '12px 28px' }}>

// ✓ PrimaryButton
<PrimaryButton variant="sage">Pirkti dabar</PrimaryButton>
```

---

## Allowed inline styles (exceptions)

These are the only cases where `style={{}}` is acceptable:

- **Per-item dynamic values from data** — e.g. `style={{ background: charm.bgColor }}` where `bgColor` is a runtime value per charm
- **JS-driven animation values** — e.g. `style={{ transform: \`translateY(${offset}px)\` }}` inside a GSAP or spring animation
- **Conditional opacity/visibility tied to JS state** — e.g. `style={{ opacity: isVisible ? 1 : 0 }}`
- **`isDark` theme switching** — `style={{ color: isDark ? 'var(--color-cream)' : 'var(--color-bark)' }}`

In all other cases, use Tailwind token classes.
