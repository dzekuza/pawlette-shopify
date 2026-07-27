# LT/EN Translation + Geo-Based Locale Detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English as a second language for the storefront, auto-selected from the
visitor's IP-geolocated country (LT → Lithuanian, everything else → English), with a
manual switcher that overrides detection thereafter — scoped to the landing page,
`/products`, and `/configure` funnel in this phase.

**Architecture:** `next-intl` provides locale-prefixed routing (`lt` unprefixed,
`en` under `/en`). A root `middleware.ts` resolves the locale (cookie override →
`request.geo.country` → `Accept-Language` → default `lt`) and hands off to
`next-intl`'s own middleware for the rewrite. UI copy lives in
`src/messages/{lt,en}.json`; live Shopify product/charm copy gets an English
overlay via a new by-handle lookup table. Only `/`, `/products`, `/configure`, and
their shared chrome move under an `src/app/[locale]/` segment — every other route
(`/faq`, `/cart`, `/checkout`, `/account`, `/guide/*`, `/pavadeliai`,
`/coming-soon`, `not-found`, `error`, `api/*`) is untouched and keeps working
exactly as it does today, rendering Lithuanian regardless of the visitor's locale
until its own Phase 2 plan lands.

**Tech Stack:** Next.js 16.2.4 App Router, `next-intl` (new dependency), existing
Shopify Storefront API integration (`src/lib/shopify.ts`, `src/lib/catalog.ts`),
Vercel edge geolocation (`request.geo`, available on Vercel deployments with zero
config).

## Global Constraints

- Locale-prefixed routes: `lt` is default/unprefixed, `en` is prefixed `/en/...`
  (`localePrefix: 'as-needed'`) — existing Lithuanian URLs must not change or
  redirect.
- Cookie override (`NEXT_LOCALE`) always wins over geo-detection; geo-detection
  (`request.geo.country`) always wins over `Accept-Language`; default is `lt`.
- No runtime/API translation calls — all UI copy is code-owned in
  `src/messages/lt.json` / `src/messages/en.json`.
- Only `/`, `/products`, `/configure` and their shared chrome
  (`LandingNav`, `LandingFooter`, `CartDrawer`, `MiniCart`) get translated content
  in this phase. No other route moves under `[locale]`.
- Shopify-hosted checkout (`checkout.pawscharm.com`) localization is out of scope
  — Shopify Markets/admin config, not this codebase.
- Never hardcode hex colors or inline `fontFamily` — this repo's existing styling
  rules (`CLAUDE.md`) apply unchanged to any file touched here.
- `npm run build` (TypeScript check + static generation) must pass after every
  task that touches routing or a page.

---

### Task 1: Install and configure `next-intl`

**Files:**
- Modify: `package.json` (add dependency)
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/messages/lt.json`
- Create: `src/messages/en.json`
- Modify: `next.config.ts:1-3` (wrap export with `next-intl`'s plugin)

**Interfaces:**
- Produces: `routing` (from `src/i18n/routing.ts`) — exports `locales: ['lt', 'en']`,
  `defaultLocale: 'lt'`; consumed by `middleware.ts` (Task 2) and any component
  needing `next-intl`'s locale-aware navigation APIs.
- Produces: `src/messages/lt.json` / `src/messages/en.json` — empty objects `{}`
  for now; every later content task adds keys here.

- [ ] **Step 1: Install the dependency**

Run: `npm install next-intl`

- [ ] **Step 2: Create the routing config**

```ts
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['lt', 'en'],
  defaultLocale: 'lt',
  localePrefix: 'as-needed',
});
```

- [ ] **Step 3: Create the request config**

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'lt' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create empty message dictionaries**

```json
// src/messages/lt.json
{}
```

```json
// src/messages/en.json
{}
```

- [ ] **Step 5: Wire the plugin into `next.config.ts`**

```ts
// next.config.ts — add this import at the top
import createNextIntlPlugin from 'next-intl/plugin';

// ...(existing storeDomain/storeHostname/OLD_TO_NEW_COLLAR_SLUGS/nextConfig unchanged)...

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Verify the build still passes**

Run: `npm run build`
Expected: succeeds with no new errors (nothing consumes `next-intl` yet, so this
just confirms the plugin wiring and config parse cleanly).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json next.config.ts src/i18n/routing.ts src/i18n/request.ts src/messages/lt.json src/messages/en.json
git commit -m "feat: add next-intl dependency and base i18n config"
```

---

### Task 2: Add locale-resolution middleware (geo + cookie + Accept-Language)

**Files:**
- Create: `middleware.ts` (project root, alongside `next.config.ts`)

**Interfaces:**
- Consumes: `routing` from `src/i18n/routing.ts` (Task 1).
- Produces: the `NEXT_LOCALE` cookie contract — any later code (the language
  switcher in Task 5) that sets this cookie name/value (`'lt'` or `'en'`) will be
  read here with top priority.

- [ ] **Step 1: Write the middleware**

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

function resolveLocale(request: NextRequest): 'lt' | 'en' {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale === 'lt' || cookieLocale === 'en') {
    return cookieLocale;
  }

  const country = request.geo?.country;
  if (country) {
    return country === 'LT' ? 'lt' : 'en';
  }

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  return acceptLanguage.toLowerCase().startsWith('lt') ? 'lt' : 'en';
}

export default function middleware(request: NextRequest) {
  const resolved = resolveLocale(request);
  const response = intlMiddleware(request);

  // next-intl's middleware only picks a locale from the URL/cookie itself when
  // one is present; on a first visit with no NEXT_LOCALE cookie yet, force the
  // geo/Accept-Language result by setting the cookie next-intl reads.
  if (!request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', resolved, { maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/en',
    '/products/:path*',
    '/en/products/:path*',
    '/configure/:path*',
    '/en/configure/:path*',
  ],
};
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: succeeds. `/` still resolves (next-intl middleware rewrites internally
to the `[locale]` segment created in Task 3 — this step will actually 404 until
Task 3 moves the pages; note that and proceed, this is expected until Task 3
lands).

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add geo/cookie-based locale resolution middleware"
```

---

### Task 3: Move landing/products/configure routes under `src/app/[locale]/`

**Files:**
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- Move: `src/app/products/page.tsx` → `src/app/[locale]/products/page.tsx`
- Move: `src/app/products/layout.tsx` → `src/app/[locale]/products/layout.tsx`
- Move: `src/app/configure/page.tsx` → `src/app/[locale]/configure/page.tsx`
- Move: `src/app/configure/layout.tsx` → `src/app/[locale]/configure/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/layout.tsx` (read locale for `<html lang>`, no structural
  change otherwise)

**Interfaces:**
- Consumes: `routing` from `src/i18n/routing.ts` (Task 1) for
  `generateStaticParams`.
- Produces: the `[locale]` segment that Tasks 6–17 (content migration) and
  Task 19 (product/catalog overrides) render inside.

- [ ] **Step 1: Move the three route subtrees**

```bash
mkdir -p src/app/[locale]
git mv src/app/page.tsx src/app/[locale]/page.tsx
git mv src/app/products src/app/[locale]/products
git mv src/app/configure src/app/[locale]/configure
```

- [ ] **Step 2: Create the locale segment layout**

This layout does *not* render `<html>`/`<body>` — those stay in the existing
root `src/app/layout.tsx`, which still wraps every route including the
untouched ones (`/faq`, `/cart`, etc.). This layout only provides the
`next-intl` message context to the three migrated routes.

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'lt' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 3: Set `<html lang>` from the resolved locale in the root layout**

Modify `src/app/layout.tsx` — the top-level `RootLayout` function currently
renders `<html lang="lt">` (or no `lang` attribute; check the existing JSX
around the `<html>` tag while editing) — change it to read the locale via
`next-intl`'s server API so routes outside `[locale]` still get a sensible
`lang` attribute (defaulting to `lt` since those routes are LT-only):

```tsx
// src/app/layout.tsx — add this import
import { getLocale } from 'next-intl/server';

// inside the RootLayout function body, before the return:
const locale = await getLocale();

// on the <html> tag:
<html lang={locale}>
```

- [ ] **Step 4: Run the build**

Run: `npm run build`
Expected: succeeds. `/` and `/en` both render (Lithuanian content on both, since
no message keys exist yet — that's expected and fixed starting Task 6). `/faq`,
`/cart`, etc. are unaffected.

- [ ] **Step 5: Manual check**

Run `npm run dev`, visit `http://localhost:3000/` and
`http://localhost:3000/en` — both should render the existing Lithuanian landing
page without errors. Visit `/products`, `/en/products`, `/configure`,
`/en/configure` — same expectation.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: move landing/products/configure routes under [locale] segment"
```

---

### Task 4: `hreflang` alternates + sitemap locale entries

**Files:**
- Modify: `src/app/[locale]/layout.tsx` or add `generateMetadata` to
  `src/app/[locale]/page.tsx`, `src/app/[locale]/products/layout.tsx`,
  `src/app/[locale]/configure/layout.tsx` (each needs its own `alternates`
  since each has distinct canonical/OG metadata today)
- Modify: `src/app/sitemap.ts:19-37` (the three static entries for `/`,
  `/products`, `/configure`)

**Interfaces:**
- Consumes: `routing.locales` from `src/i18n/routing.ts`.

- [ ] **Step 1: Add `alternates.languages` to the three migrated pages' metadata**

For each of `src/app/[locale]/products/layout.tsx` and
`src/app/[locale]/configure/layout.tsx` (both already export a static
`metadata: Metadata` object with an `alternates: { canonical: '...' }` field —
extend that same object), add the `languages` key alongside the existing
`canonical`:

```ts
// src/app/[locale]/products/layout.tsx — extend the existing `alternates` field
alternates: {
  canonical: 'https://pawscharm.com/products',
  languages: {
    lt: 'https://pawscharm.com/products',
    en: 'https://pawscharm.com/en/products',
  },
},
```

```ts
// src/app/[locale]/configure/layout.tsx — extend the existing `alternates` field
alternates: {
  canonical: 'https://pawscharm.com/configure',
  languages: {
    lt: 'https://pawscharm.com/configure',
    en: 'https://pawscharm.com/en/configure',
  },
},
```

For `src/app/[locale]/page.tsx` (the landing page), check whether it currently
exports a `metadata` object or relies entirely on the root layout's `metadata`
— if it has no local `metadata` export, add one with just the `alternates`
field so it doesn't otherwise override the root layout's title/description:

```ts
// src/app/[locale]/page.tsx — add alongside existing imports/consts
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://pawscharm.com',
    languages: {
      lt: 'https://pawscharm.com',
      en: 'https://pawscharm.com/en',
    },
  },
};
```

- [ ] **Step 2: Add locale entries to the sitemap**

```ts
// src/app/sitemap.ts — replace the three static entries (currently lines 19-37)
{
  url: 'https://pawscharm.com',
  lastModified,
  changeFrequency: 'weekly',
  priority: 1,
},
{
  url: 'https://pawscharm.com/en',
  lastModified,
  changeFrequency: 'weekly',
  priority: 1,
},
{
  url: 'https://pawscharm.com/products',
  lastModified,
  changeFrequency: 'weekly',
  priority: 0.9,
},
{
  url: 'https://pawscharm.com/en/products',
  lastModified,
  changeFrequency: 'weekly',
  priority: 0.9,
},
{
  url: 'https://pawscharm.com/configure',
  lastModified,
  changeFrequency: 'weekly',
  priority: 0.85,
},
{
  url: 'https://pawscharm.com/en/configure',
  lastModified,
  changeFrequency: 'weekly',
  priority: 0.85,
},
```

(Leave the `/faq`, `/guide/*`, and `...productEntries` entries below this block
untouched — they're out of scope for this phase.)

- [ ] **Step 3: Run the build and check the sitemap**

Run: `npm run build && npm run start &` then `curl -s http://localhost:3000/sitemap.xml | grep pawscharm.com`
Expected: both `https://pawscharm.com` and `https://pawscharm.com/en` (and the
`/products`, `/configure` pairs) are listed. Stop the server afterward
(`kill %1`).

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts "src/app/[locale]/page.tsx" "src/app/[locale]/products/layout.tsx" "src/app/[locale]/configure/layout.tsx"
git commit -m "feat: add hreflang alternates and sitemap entries for /en routes"
```

---

### Task 5: Language switcher (manual override)

**Files:**
- Create: `src/components/shared/LanguageSwitcher.tsx`
- Modify: `src/components/landing/LandingNav.tsx` (render the switcher; exact
  insertion point is next to the existing cart icon button — read the file's
  current JSX around the cart button before editing to match its layout/spacing
  conventions)

**Interfaces:**
- Consumes: `routing` from `src/i18n/routing.ts` (Task 1).
- Produces: `LanguageSwitcher` component — no props, self-contained; sets the
  `NEXT_LOCALE` cookie and navigates, which the middleware (Task 2) reads on
  the next request.

- [ ] **Step 1: Create the switcher**

```tsx
// src/components/shared/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const LOCALE_LABEL: Record<string, string> = { lt: 'LT', en: 'EN' };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === 'lt' ? 'en' : 'lt';

  const handleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    const segments = pathname.split('/').filter(Boolean);
    const withoutLocalePrefix = segments[0] === 'en' ? segments.slice(1) : segments;
    const nextPath = nextLocale === 'en'
      ? `/en${withoutLocalePrefix.length ? `/${withoutLocalePrefix.join('/')}` : ''}`
      : `/${withoutLocalePrefix.join('/')}`;

    router.push(nextPath || '/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      aria-label={`Switch language to ${LOCALE_LABEL[nextLocale]}`}
      className="text-sm font-medium text-bark-muted transition-colors hover:text-bark"
    >
      {LOCALE_LABEL[nextLocale]}
    </button>
  );
}
```

- [ ] **Step 2: Render it in `LandingNav`**

Read `src/components/landing/LandingNav.tsx` in full, find the JSX block
rendering the cart icon button (desktop nav — search for the element wired to
`CART_DRAWER_OPEN_EVENT`), and add `<LanguageSwitcher />` immediately before or
after it, matching the surrounding `flex`/`gap` classes already used there. Do
the same in the mobile menu's JSX block. Import it at the top:

```tsx
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`, visit `/`, click the switcher — confirm it navigates to
`/en` and the button now reads "LT". Reload the page — confirm it stays on
`/en` (cookie persisted). Navigate to `/en/products` and click the switcher —
confirm it lands on `/products` (not `/`).

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/LanguageSwitcher.tsx src/components/landing/LandingNav.tsx
git commit -m "feat: add manual language switcher to LandingNav"
```

---

### Task 6: Establish the content-migration pattern — `TopBar.tsx` (worked example)

Every remaining content task (7–17) repeats this exact procedure against a
different file. `TopBar.tsx` is small (54 lines) and is done here in full to
lock the convention: message namespace naming, `useTranslations` usage for a
component with an array of strings, and how `lt.json`/`en.json` grow together.

**Files:**
- Modify: `src/components/landing/TopBar.tsx` (full current contents already
  read — the `TAGLINE_SLIDES` array of 5 strings, and two `aria-label` strings)
- Modify: `src/messages/lt.json`, `src/messages/en.json`

**Interfaces:**
- Establishes: namespace convention `landing.<componentName>.<key>` — Task 7
  onward uses `landing.nav.*`, `landing.footer.*`, `landing.hero.*`, etc.

- [ ] **Step 1: Add the `topBar` namespace to both message files**

```json
// src/messages/lt.json
{
  "landing": {
    "topBar": {
      "slides": [
        "{discountPercent}% nuolaida pirmam užsakymui su kodu {discountCode}",
        "{shippingCopy} · siunčiama iš Vilniaus 🇱🇹",
        "Pakabukus pakeisite per 5 sekundes ir be jokių įrankių",
        "BioThane medžiaga – atspari vandeniui, purvui ir dilimui",
        "Personalizuok pakabukais ir sukurk unikalų antkaklio dizainą"
      ],
      "prevSlide": "Ankstesnis šūkis",
      "nextSlide": "Kitas šūkis"
    }
  }
}
```

```json
// src/messages/en.json
{
  "landing": {
    "topBar": {
      "slides": [
        "{discountPercent}% off your first order with code {discountCode}",
        "{shippingCopy} · shipped from Vilnius 🇱🇹",
        "Swap charms in 5 seconds, no tools needed",
        "BioThane material – resistant to water, mud, and wear",
        "Personalize with charms and create a unique collar design"
      ],
      "prevSlide": "Previous tagline",
      "nextSlide": "Next tagline"
    }
  }
}
```

Note the first two slides interpolate `FREE_SHIPPING_COPY`,
`NEWSLETTER_DISCOUNT_CODE`, `NEWSLETTER_DISCOUNT_PERCENT` from
`src/lib/site-config.ts` — these stay as runtime values passed into the
translation via `t()`'s interpolation parameters, not duplicated as literal
text in the JSON (that config already has a single source of truth; don't
fork it into the message files).

- [ ] **Step 2: Update the component**

```tsx
// src/components/landing/TopBar.tsx
'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FREE_SHIPPING_COPY, NEWSLETTER_DISCOUNT_CODE, NEWSLETTER_DISCOUNT_PERCENT } from '@/lib/site-config';

export function TopBar() {
  const t = useTranslations('landing.topBar');
  const slides = t.raw('slides') as string[];
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToTagline = (dir: 1 | -1) => {
    setTaglineIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const renderSlide = (template: string) =>
    template
      .replace('{discountPercent}', String(NEWSLETTER_DISCOUNT_PERCENT))
      .replace('{discountCode}', NEWSLETTER_DISCOUNT_CODE)
      .replace('{shippingCopy}', FREE_SHIPPING_COPY);

  return (
    <div className="flex h-9 items-center justify-center gap-3 bg-sage px-4 text-center">
      <button
        type="button"
        aria-label={t('prevSlide')}
        onClick={() => goToTagline(-1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronLeft className="size-3.5" />
      </button>

      <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-tomato text-sm font-medium tracking-[0.02em] text-interactive-text">
        {renderSlide(slides[taglineIndex])}
      </p>

      <button
        type="button"
        aria-label={t('nextSlide')}
        onClick={() => goToTagline(1)}
        className="hidden size-6 shrink-0 items-center justify-center rounded-full text-interactive-text transition-colors hover:bg-bark/10 md:flex"
      >
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`, visit `/` — confirm the tagline strip still cycles through
5 Lithuanian slides with the discount code/shipping copy correctly
interpolated. Visit `/en` — confirm the same slides now render in English.

- [ ] **Step 4: Run the build**

Run: `npm run build`
Expected: succeeds, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/TopBar.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate TopBar and establish next-intl content pattern"
```

---

### Task 7: Translate `LandingNav.tsx`

**Files:**
- Modify: `src/components/landing/LandingNav.tsx` (the `NAV_LINKS` array
  labels — `Antkakliai`, `Pavadeliai`, `Pakabukai` — plus any other literal
  Lithuanian strings found when reading the full file: menu toggle
  `aria-label`s, the mobile menu heading, etc.)
- Modify: `src/messages/lt.json`, `src/messages/en.json` under a new
  `landing.nav` namespace

**Interfaces:**
- Consumes: the namespace/`useTranslations` pattern from Task 6.

- [ ] **Step 1: Read the full current file**

Read `src/components/landing/LandingNav.tsx` end to end (it's larger than the
excerpt already seen — includes desktop nav, mobile menu, and the cart/gift
icon buttons) and list every hardcoded Lithuanian string: the 3 `NAV_LINKS`
labels, any `aria-label`s on icon buttons, and any other visible text.

- [ ] **Step 2: Add a `landing.nav` namespace to both message files**

Add the keys found in Step 1 to `src/messages/lt.json` (Lithuanian, matching
the current literal text exactly) and `src/messages/en.json` (accurate
English translation), following the same nested-object shape used for
`landing.topBar` in Task 6.

- [ ] **Step 3: Replace the literals with `useTranslations('landing.nav')`**

Import `useTranslations` from `next-intl`, call
`const t = useTranslations('landing.nav')` inside `LandingNav`, and replace
each hardcoded string (including inside the `NAV_LINKS` array — restructure it
so labels come from `t()` while `href`s stay as-is) with the corresponding
`t('key')` call.

- [ ] **Step 4: Verify visually**

`npm run dev` — confirm `/` nav shows Lithuanian labels/links unchanged, `/en`
nav shows English labels with the same `href`s.

- [ ] **Step 5: Run the build**

Run: `npm run build` — expected to pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/LandingNav.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate LandingNav"
```

---

### Task 8: Translate `LandingFooter.tsx`

**Files:**
- Modify: `src/components/landing/LandingFooter.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json` (`landing.footer`
  namespace)

- [ ] **Step 1: Read the full file, list every hardcoded Lithuanian string**

Include link labels, section headings, legal/copyright text, and any
newsletter or contact microcopy rendered directly in this component.

- [ ] **Step 2: Add the `landing.footer` namespace to both message files**

Follow the Task 6 pattern exactly (nested keys, LT literal text preserved
verbatim in `lt.json`, accurate translation in `en.json`).

- [ ] **Step 3: Replace literals with `useTranslations('landing.footer')`**

- [ ] **Step 4: Verify visually** — `/` and `/en` footers render correctly in
  their respective language.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/LandingFooter.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate LandingFooter"
```

---

### Task 9: Translate `hero-floating.tsx` (`FloatingHero`)

**Files:**
- Modify: `src/components/ui/hero-floating.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json` (`landing.hero`
  namespace)

- [ ] **Step 1: Read the full file, list every hardcoded Lithuanian string**

This is the component actually rendered by `LandingPage` (not the unused
`src/components/landing/Hero.tsx` — do not touch that file, it isn't imported
anywhere in the render tree per `LandingPage.tsx`'s import list).

- [ ] **Step 2: Add the `landing.hero` namespace to both message files**

- [ ] **Step 3: Replace literals with `useTranslations('landing.hero')`**

Note this file uses framer-motion per `CLAUDE.md` — translating text content
does not touch any animation/transform logic; only literal JSX text and
`aria-label`/`alt` strings change.

- [ ] **Step 4: Verify visually** — hero renders correctly on `/` and `/en`,
  animations still play.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/hero-floating.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate FloatingHero"
```

---

### Task 10: Translate `FeaturesStrip.tsx`

**Files:**
- Modify: `src/components/landing/FeaturesStrip.tsx` (contains at least a
  `title` field per feature, e.g. `'Reguliuojamas dydis šuniui augant'`, seen
  earlier — read the full file for the complete list of feature titles/
  descriptions/icons)
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`landing.featuresStrip` namespace, likely an array of `{title, description}`
  objects mirroring the component's existing data shape)

- [ ] **Step 1: Read the full file, list every feature's title/description text**

- [ ] **Step 2: Add the `landing.featuresStrip` namespace to both message files**

Use `t.raw('items')` (as in Task 6's `slides` array) if the component's data is
an array of objects, so icons/other non-text fields stay in the component
while text fields come from the message array.

- [ ] **Step 3: Replace literals with `useTranslations('landing.featuresStrip')`**

- [ ] **Step 4: Verify visually** — feature titles/descriptions correct on
  both `/` and `/en`.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/FeaturesStrip.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate FeaturesStrip"
```

---

### Task 11: Translate `ProductGrid.tsx`

**Files:**
- Modify: `src/components/landing/ProductGrid.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`landing.productGrid` namespace — section heading/intro/CTA copy only;
  actual product names/prices come from Shopify via `getLandingProducts()` and
  are handled separately in Task 19, not here)

- [ ] **Step 1: Read the full file**

Separate the component's own static copy (section heading, "See all" link
text, empty-state text if any) from the per-product data it receives as
props (which Task 19 handles) — only the former belongs in this task.

- [ ] **Step 2: Add the `landing.productGrid` namespace to both message files**

- [ ] **Step 3: Replace static literals with `useTranslations('landing.productGrid')`**

- [ ] **Step 4: Verify visually** — section heading/CTA text correct on `/`
  and `/en` (product names may still show Lithuanian until Task 19 — that's
  expected at this point).

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/ProductGrid.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate ProductGrid static copy"
```

---

### Task 12: Translate `PhotoSlider.tsx`, `FAQ.tsx`, `HowItWorks.tsx`

**Files:**
- Modify: `src/components/landing/PhotoSlider.tsx`,
  `src/components/landing/FAQ.tsx`, `src/components/landing/HowItWorks.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`landing.photoSlider`, `landing.faq`, `landing.howItWorks` namespaces)

These three are grouped into one task since they're independent, same-pattern,
moderate-sized sections rendered back-to-back on the landing page.

- [ ] **Step 1: Read all three files in full, list every hardcoded string per file**

For `FAQ.tsx` specifically, check whether its question/answer data overlaps
with the `faqSchema` JSON-LD already defined in `src/app/[locale]/page.tsx`
(seen earlier, e.g. "Ar PawCharms antkakliai yra atsparūs vandeniui?") — if so,
those questions should be pulled from the same `landing.faq` message keys in
both places (the component and the JSON-LD in Task 18) rather than kept as two
separately-maintained copies of the same Lithuanian text.

- [ ] **Step 2: Add the three namespaces to both message files**

- [ ] **Step 3: Replace literals in each component with its own
  `useTranslations(...)` call**

- [ ] **Step 4: Verify visually** — all three sections correct on `/` and
  `/en`.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/PhotoSlider.tsx src/components/landing/FAQ.tsx src/components/landing/HowItWorks.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate PhotoSlider, FAQ, and HowItWorks sections"
```

---

### Task 13: Translate `LandingBuySection.tsx`, `NewsletterSignup.tsx`

**Files:**
- Modify: `src/components/landing/LandingBuySection.tsx`,
  `src/components/landing/NewsletterSignup.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`landing.buySection`, `landing.newsletter` namespaces)

- [ ] **Step 1: Read both files in full, list every hardcoded string**

For `NewsletterSignup.tsx`, pay attention to form validation/success/error
messages (e.g. "Įvesk el. paštą", "Ačiū! Patikrink savo pašto dėžutę") — these
are as important to translate as the visible static copy.

- [ ] **Step 2: Add the two namespaces to both message files**

- [ ] **Step 3: Replace literals in each component**

- [ ] **Step 4: Verify visually**, including submitting the newsletter form on
  both `/` and `/en` to confirm success/error states show the right language.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/LandingBuySection.tsx src/components/landing/NewsletterSignup.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate LandingBuySection and NewsletterSignup"
```

---

### Task 14: Translate `StickyCTA.tsx`, `StickyVideoWidget.tsx`, `ExitModal.tsx`

**Files:**
- Modify: `src/components/landing/StickyCTA.tsx`,
  `src/components/landing/StickyVideoWidget.tsx`,
  `src/components/landing/ExitModal.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`landing.stickyCta`, `landing.stickyVideo`, `landing.exitModal`
  namespaces)

- [ ] **Step 1: Read all three files in full, list every hardcoded string**

Per `CLAUDE.md`, `StickyCTA` and `ExitModal` are toggled by scroll/mouseleave
state owned by `LandingPage` — translating their text content doesn't change
that toggling logic, only the literal strings they render once shown.

- [ ] **Step 2: Add the three namespaces to both message files**

- [ ] **Step 3: Replace literals in each component**

- [ ] **Step 4: Verify visually** — trigger each (scroll down for `StickyCTA`,
  wait/trigger the video widget, move the mouse to the top edge for
  `ExitModal`) on both `/` and `/en`.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/StickyCTA.tsx src/components/landing/StickyVideoWidget.tsx src/components/landing/ExitModal.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate StickyCTA, StickyVideoWidget, and ExitModal"
```

---

### Task 15: Translate `CartDrawer.tsx` and `MiniCart.tsx`

**Files:**
- Modify: `src/components/shared/CartDrawer.tsx`
- Modify: `src/components/MiniCart.tsx` (confirm exact path — search
  `find src/components -iname "MiniCart*"` — the `ProductConfigurator.tsx`
  import shown earlier is `./MiniCart`, i.e. `src/components/MiniCart.tsx`)
- Modify: `src/messages/lt.json`, `src/messages/en.json` (`shared.cartDrawer`,
  `shared.miniCart` namespaces)

Both cart UIs are shared chrome used by all three migrated routes (`CartDrawer`
is mounted globally in the root layout per `CLAUDE.md`; `MiniCart` is part of
the configurator), so they get a `shared.*` namespace rather than `landing.*`.

- [ ] **Step 1: Read both files in full, list every hardcoded string**

Include empty-cart state text, quantity/remove button labels, subtotal/total
labels, and the "Peržiūrėti visą krepšelį" footer link mentioned in
`CLAUDE.md` (verify it's still present as literal text and translate it too).

- [ ] **Step 2: Add the two namespaces to both message files**

- [ ] **Step 3: Replace literals in each component**

`CartDrawer` is mounted in `src/app/layout.tsx` (outside `[locale]`) but is
only actually populated/opened from pages inside `[locale]` in this phase —
it still needs `useTranslations` to work correctly there, which requires it
to render only where an ancestor `NextIntlClientProvider` exists. Since
`CartDrawer` renders on every route including non-migrated ones, wrap its
translated text access defensively: if `useTranslations` throws outside the
`[locale]` tree (no messages context), catch that at the call site by reading
messages via `useMessages()` with a guard, or — simpler and consistent with
this plan's "untouched routes stay untouched" rule — leave `CartDrawer`'s
cross-cutting always-mounted instance rendering Lithuanian by default via a
non-hook fallback, and only apply `useTranslations` inside the drawer's
content when accessed from within `[locale]` routes. Confirm the actual
behavior with the manual check in Step 4 before committing.

- [ ] **Step 4: Verify visually** — open the cart drawer from `/`, `/en`,
  and also from `/faq` (outside `[locale]`) to confirm it doesn't crash on
  the non-migrated route; open `MiniCart` from `/configure` and `/en/configure`.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/CartDrawer.tsx src/components/MiniCart.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate CartDrawer and MiniCart"
```

---

### Task 16: Translate `ProductConfigurator.tsx`'s own copy, `ConfigPanel.tsx`, `BentoSection.tsx`, `UpsellModal.tsx`

**Files:**
- Modify: `src/components/ProductConfigurator.tsx`,
  `src/components/ConfigPanel.tsx`, `src/components/BentoSection.tsx`,
  `src/components/UpsellModal.tsx` (confirm exact paths with
  `find src/components -iname "ConfigPanel*" -o -iname "BentoSection*" -o -iname "UpsellModal*"`)
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`configure.*` namespace — `configure.panel`, `configure.bento`,
  `configure.upsell`)

**Interfaces:**
- Consumes: `SIZES` from `src/lib/data.ts` — per the spec, `SIZES` display
  strings (`'S — 28–36 cm'`, etc.) move into `configure.sizes` message keys in
  this task rather than staying in `src/lib/data.ts` as a plain array; update
  `src/lib/data.ts` to remove the display-string tuple only if nothing else
  outside this component tree consumes `SIZES` for its string content — check
  with `grep -rn "SIZES" src/` first and confirm every remaining usage is
  within the files this task modifies before removing it from `data.ts`.

- [ ] **Step 1: Confirm exact file paths and read each in full**

- [ ] **Step 2: Check all other consumers of `SIZES`**

Run: `grep -rn "from '@/lib/data'" src/ | grep -i size`
If any file outside this task's scope imports `SIZES`, keep `SIZES` in
`data.ts` as-is and instead add a `configure.sizes` array purely for display
strings, leaving `SIZES` for whatever non-display logic depends on it (e.g.
matching against Shopify variant option values).

- [ ] **Step 3: Add the `configure.*` namespaces to both message files,
  including size labels**

- [ ] **Step 4: Replace literals in all four files**

- [ ] **Step 5: Verify visually** — full configurator flow on `/configure`
  and `/en/configure`: select a collar, add charms, pick a size, see the
  upsell modal, confirm every label is in the right language.

- [ ] **Step 6: Run the build** — `npm run build` passes.

- [ ] **Step 7: Commit**

```bash
git add src/components/ProductConfigurator.tsx src/components/ConfigPanel.tsx src/components/BentoSection.tsx src/components/UpsellModal.tsx src/lib/data.ts src/messages/lt.json src/messages/en.json
git commit -m "feat: translate ProductConfigurator, ConfigPanel, BentoSection, and UpsellModal"
```

---

### Task 17: Translate `ProductsPageContent.tsx` and `CollarStage.tsx`

**Files:**
- Modify: `src/components/products/ProductsPageContent.tsx`
- Modify: `src/components/CollarStage.tsx`
- Modify: `src/messages/lt.json`, `src/messages/en.json`
  (`products.pageContent`, `configure.collarStage` namespaces)

- [ ] **Step 1: Read both files in full, list every hardcoded string**

`ProductsPageContent` is the actual client component rendered by
`src/app/[locale]/products/page.tsx` — confirm this via
`grep -n "ProductsPageContent" src/app/[locale]/products/page.tsx` before
starting (already confirmed above — this is the correct file).

- [ ] **Step 2: Add the two namespaces to both message files**

Product names/descriptions themselves come from Shopify via
`getLandingProducts()`/`getCollars()`/etc. and are out of scope here (handled
in Task 19) — only this page's own static chrome (headings, filter labels,
empty states) belongs in this task.

- [ ] **Step 3: Replace literals in both components**

- [ ] **Step 4: Verify visually** — `/products`, `/en/products` (static chrome
  translated; product names still LT until Task 19), and the collar 3D stage
  on `/configure`/`/en/configure`.

- [ ] **Step 5: Run the build** — `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/products/ProductsPageContent.tsx src/components/CollarStage.tsx src/messages/lt.json src/messages/en.json
git commit -m "feat: translate ProductsPageContent static copy and CollarStage"
```

---

### Task 18: Localize JSON-LD schema in `src/app/[locale]/page.tsx` and `products/layout.tsx`

**Files:**
- Modify: `src/app/[locale]/page.tsx` (the `faqSchema` object seen earlier —
  question/answer text)
- Modify: `src/app/[locale]/products/layout.tsx` (the `productListSchema`
  object seen earlier — `collars` array `name`/`color` fields used to build
  it)

**Interfaces:**
- Consumes: `getTranslations` from `next-intl/server` (server-component API,
  distinct from the client `useTranslations` used in Tasks 6–17) and the
  `landing.faq` namespace from Task 12.

- [ ] **Step 1: Convert `src/app/[locale]/page.tsx`'s schema construction to
  use `getTranslations`**

```tsx
// src/app/[locale]/page.tsx — inside the (now async) page/metadata function
import { getTranslations } from 'next-intl/server';

const t = await getTranslations('landing.faq');
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: t('waterproof.question'),
      acceptedAnswer: { '@type': 'Answer', text: t('waterproof.answer') },
    },
    {
      '@type': 'Question',
      name: t('charms.question'),
      acceptedAnswer: { '@type': 'Answer', text: t('charms.answer') },
    },
    {
      '@type': 'Question',
      name: t('sizing.question'),
      acceptedAnswer: { '@type': 'Answer', text: t('sizing.answer') },
    },
  ],
};
```

(Match the exact key names chosen in Task 12's `landing.faq` namespace — if
Task 12 used different key names for these three Q&A pairs, use those instead
of `waterproof`/`charms`/`sizing`.)

- [ ] **Step 2: Convert `src/app/[locale]/products/layout.tsx`'s
  `productListSchema` similarly**, pulling the 4 collar `name`/`color` strings
  from a new `products.schemaCollars` message array (add it to both message
  files) rather than the hardcoded `collars` array currently in that file.

- [ ] **Step 3: Verify the JSON-LD output per locale**

Run `npm run dev`, visit `/` and `/en`, view source, confirm the
`application/ld+json` script tag content is in the correct language for each.
Same check for `/products` and `/en/products`.

- [ ] **Step 4: Run the build** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/page.tsx" "src/app/[locale]/products/layout.tsx" src/messages/lt.json src/messages/en.json
git commit -m "feat: localize FAQ and product-list JSON-LD schema"
```

---

### Task 19: English overlay for live Shopify product/charm/leash data

**Files:**
- Create: `src/lib/productTranslations.ts`
- Modify: `src/lib/catalog.ts` (the functions that build `ProductDetail`
  objects from `getCollars()`/`getCharms()`/`getLeashes()` — read the full
  file to find every function that constructs a `ProductDetail`, since each
  needs the overlay applied)

**Interfaces:**
- Produces: `PRODUCT_TRANSLATIONS_EN: Record<string, { name?: string;
  shortDescription?: string; longDescription?: string }>` — keyed by the same
  handle/slug `catalog.ts` already computes via `slugFromProductName` /
  `slugFromCharmId` / the raw Shopify handle for leashes.
- Produces: an `applyLocaleOverlay(detail: ProductDetail, locale: string):
  ProductDetail` helper in `catalog.ts`, called at the end of each
  `ProductDetail`-constructing function.

- [ ] **Step 1: Enumerate every current collar, leash, and charm**

Run the app locally and inspect `getCollars()`/`getCharms()`/`getLeashes()`
output (or query the Shopify Storefront API directly with the existing
`COLLARS_QUERY`/equivalent queries in `src/lib/shopify.ts`) to get the
authoritative list of every current handle/id and its Lithuanian
title/description — do not guess names from earlier partial greps.

- [ ] **Step 2: Write `src/lib/productTranslations.ts`**

```ts
// src/lib/productTranslations.ts
export interface ProductTranslationOverride {
  name?: string;
  shortDescription?: string;
  longDescription?: string;
}

// Keyed by the same handle/slug catalog.ts already computes
// (slugFromProductName / slugFromCharmId / raw Shopify handle for leashes).
// A missing key, or a missing field within an entry, falls back to the
// Lithuanian Shopify value — never render undefined.
export const PRODUCT_TRANSLATIONS_EN: Record<string, ProductTranslationOverride> = {
  // Populated in Step 1 with the real handle → English copy for every
  // collar, leash, and charm found in the live Shopify catalog.
};
```

- [ ] **Step 3: Add the overlay helper and call sites in `catalog.ts`**

```ts
// src/lib/catalog.ts — add near the other helper functions
import { PRODUCT_TRANSLATIONS_EN } from '@/lib/productTranslations';

export function applyLocaleOverlay(detail: ProductDetail, locale: string): ProductDetail {
  if (locale !== 'en') return detail;

  const override = PRODUCT_TRANSLATIONS_EN[detail.slug];
  if (!override) return detail;

  return {
    ...detail,
    name: override.name ?? detail.name,
    shortDescription: override.shortDescription ?? detail.shortDescription,
    longDescription: override.longDescription ?? detail.longDescription,
  };
}
```

Then, in every function in `catalog.ts` that returns a `ProductDetail` (or an
array of them), thread a `locale: string` parameter through and call
`applyLocaleOverlay(detail, locale)` on each constructed object before
returning.

- [ ] **Step 4: Thread `locale` from the calling pages**

In `src/app/[locale]/products/page.tsx`, `src/app/[locale]/configure/page.tsx`,
and `src/components/landing/ProductGrid.tsx`'s data-fetching path
(`getLandingProducts()` in `src/lib/db.ts` — check whether it also needs a
`locale` parameter threaded through to `catalog.ts`), read the resolved locale
via `getLocale()` (server) or `useLocale()` (client) and pass it down to
whichever `catalog.ts`/`db.ts` function ultimately builds the `ProductDetail`
list.

- [ ] **Step 5: Verify visually**

Visit `/en/products` and `/en/configure` — confirm every collar/leash/charm
with an entry in `PRODUCT_TRANSLATIONS_EN` shows its English name/description;
confirm any handle without an entry falls back to Lithuanian (not
`undefined`/blank). Visit `/products` and `/configure` — confirm Lithuanian is
completely unaffected.

- [ ] **Step 6: Run the build** — `npm run build` passes.

- [ ] **Step 7: Commit**

```bash
git add src/lib/productTranslations.ts src/lib/catalog.ts src/lib/db.ts "src/app/[locale]/products/page.tsx" "src/app/[locale]/configure/page.tsx" src/components/landing/ProductGrid.tsx
git commit -m "feat: add English overlay for Shopify product, leash, and charm data"
```

---

### Task 20: Full end-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: succeeds with no TypeScript or lint errors.

- [ ] **Step 2: Manual locale-resolution check**

Run `npm run start`. Since `request.geo` isn't populated in local/non-Vercel
serving, verify the cookie-override and Accept-Language paths manually:
- Clear cookies, set browser `Accept-Language` to `en-US` → visiting `/`
  should land on `/en` (or render English if middleware rewrites internally —
  confirm via the rendered language, not just the URL).
- Clear cookies, set `Accept-Language` to `lt-LT` → `/` renders Lithuanian.
- Manually set a `NEXT_LOCALE=en` cookie, then set `Accept-Language` to
  `lt-LT` → confirm the cookie wins (English still renders).

- [ ] **Step 3: Deploy to a Vercel preview and verify real geolocation**

Push the branch and open the Vercel preview URL from two different
network locations/VPN exit points (one Lithuanian IP, one non-Lithuanian IP)
with no `NEXT_LOCALE` cookie set, and confirm each lands on the expected
language.

- [ ] **Step 4: Full funnel walkthrough on both locales**

On both `/` (or preview root) and `/en`: browse the landing page, click
through to `/products` and `/en/products`, configure a collar end-to-end on
`/configure`/`/en/configure` including adding it to cart, open the cart
drawer, and confirm every piece of UI text, every product name, and the
JSON-LD (view source) is in the correct language throughout.

- [ ] **Step 5: Confirm non-migrated routes are unaffected**

Visit `/faq`, `/cart`, `/checkout`, `/account`, `/guide/how-to-measure-dog-collar`,
`/pavadeliai`, `/coming-soon` — confirm all render exactly as they did before
this plan, in Lithuanian, with no console errors from a missing
`NextIntlClientProvider` context.

No commit for this task — it's verification only. If any step surfaces a bug,
fix it as part of the task where it was introduced and re-run the affected
task's own build/verify steps before returning here.
