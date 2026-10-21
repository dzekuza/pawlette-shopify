---
tags: [frontend, catalog, wip]
updated: 2026-10-21
---

# Hooks Catalog

Every custom hook in `src/hooks/`. Add a row **and** a note (from
[[templates/hook-note]]) when you add a hook.

| Hook | File | Purpose | Client only? |
|------|------|---------|--------------|
| `useViewItemList(listName, products)` | `src/hooks/useViewItemList.ts` | Fires GA4 `view_item_list` once per distinct visible product set | Yes |

## Related

[[component-conventions]] · [[data-flow]]
