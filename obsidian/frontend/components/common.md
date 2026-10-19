---
tags: [frontend, catalog, wip]
updated: 2026-09-20
---

# Common Components Catalog

Shared composed components in `components/common/` — built from [[components/ui]]
primitives, reused across features.

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `GuideLayout` | `components/guide/GuideLayout.tsx` | Server shell for guide pages: nav, footer, width, JSON-LD scripts | #stable |
| `GuideHeader`, `GuideSection`, `GuideCallout`, `GuideBullets`, `GuideLink`, `GuideNumberedList`, `GuideTable`, `GuideFaq`, `GuideCta` | `components/guide/GuideBlocks.tsx` | Content blocks for `/guide/*` pages (all server components) | #stable |

## Related

[[component-conventions]] · [[components/ui]]
