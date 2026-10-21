---
tags: [frontend, catalog, wip]
updated: 2026-10-21
---

# Utils Catalog

Pure helpers in `src/utils/`. A util is pure, typed, and unit-testable; anything
with I/O or client state belongs in `lib/` or a hook instead.

| Util | File | Signature | Purpose |
|------|------|-----------|---------|
| `parsePrice` / `trackViewItemList` / `trackSelectItem` / `trackViewCart` / `trackRemoveFromCart` | `src/lib/ga-ecommerce.ts` | `parsePrice("€33.00") -> 33`; GA4 ecommerce event helpers | Parse display prices safely; send list/cart events (consent-gated via `trackGaEvent`) |

## Related

[[folder-structure]]
