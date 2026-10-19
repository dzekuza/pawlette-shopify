---
tags: [frontend, wip]
updated: 2026-09-20
---

# SEO & Metadata

## Conventions

- Metadata via the App Router `metadata` export / `generateMetadata`.
- Every route sets `title` and `description`; templates live in the root layout.
- Open Graph + Twitter card images per route where it matters.
- `sitemap.ts` and `robots.ts` in `app/`.
- Canonical URLs from a single `siteUrl` config value, never hardcoded.
- JSON-LD via a shared component — see [[html-semantics]].

## Per-route metadata

| Route | Title | Description | OG image |
|-------|-------|-------------|----------|
| `/guide/kaip-isrinkti-antkakli-su-vardu` | Kaip išsirinkti šuns antkaklį su vardu | Dydis, medžiaga, vardo užrašymo būdas ir sagtis… | default |
| `/guide/ka-patikrinti-uzsakant-antkakli-su-vardu` | Ką patikrinti užsakant šuns antkaklį su vardu | Dešimties punktų sąrašas prieš užsakant… | default |

## Related

[[routing]] · [[html-semantics]]
