---
tags: [meta, decision]
updated: 2026-10-19
---

# Decisions Log (ADRs)

Architecture Decision Records. Each entry captures a choice, its context, and its
consequences. Use [[templates/adr-note]] for new entries. Newest first.

---

## ADR-0005 — Purchases reach Meta through a consent-gated order webhook

- **Status:** Accepted
- **Date:** 2026-10-19

**Context.** Checkout is on Shopify's domain, so the pixel can't fire `Purchase`, and an order webhook
has no cookie-consent signal of its own. Sending every order would bypass the consent banner.

**Decision.** Carry consent and Meta browser ids on the Shopify cart (set only after cookie consent),
and have the `orders/paid` webhook send a Conversions API `Purchase` only when those attributes are
present. Customer fields are SHA-256 hashed server-side. Event ids derive from the order id.

**Consequences.** Orders from visitors who declined or never saw the banner aren't reported to Meta, so
Meta undercounts purchases by design. Shopify's own Facebook & Instagram channel remains the alternative,
but it must not run in parallel with this or purchases double-count. The privacy policy should mention it.

---

## ADR-0004 — Catalog reads use Next's tagged data cache, invalidated by Shopify webhooks

- **Status:** Accepted
- **Date:** 2026-10-19

**Context.** Catalog data lived in per-instance in-memory maps (5 min TTL) plus page-level
`revalidate = 300`, so edits took minutes to appear and each serverless instance refetched.
Vercel's Hydrogen guidance for Next.js is tagged caching with on-demand revalidation.

**Decision.** Server-side catalog queries go through `shopifyCatalogClient`
(`fetch` with `cache: 'force-cache'`, tag `shopify`); the webhook route calls
`revalidateTag('shopify', 'max')`. We did not enable `cacheComponents` / `"use cache"`: the app
mixes `[locale]` routes with non-localized pages, so that migration is larger than needed.
Mutations, carts and customer data must never use the catalog client.

**Consequences.** Needs `SHOPIFY_WEBHOOK_SECRET` and webhooks registered in Shopify Admin;
without them the 5 min backstop still applies. A future move to `"use cache"` can reuse the same tag.

---

## ADR-0003 — Additional Meta pixels are added inside `MetaPixel`, never as raw snippets

- **Status:** Accepted
- **Date:** 2026-10-19

**Context.** A second pixel ID was requested. Meta's stock snippet loads immediately, which
bypasses the EEA cookie-consent gate that `MetaPixel` enforces.

**Decision.** Extra pixel IDs are added to `META_PIXEL_IDS` in `src/components/shared/MetaPixel.tsx`
(env-overridable). They initialise only after consent, and no `<noscript>` pixel image is used.

**Consequences.** `fbq('track')` reaches all pixels. Conversions API mirroring stays on the primary
pixel; sending server events to the second pixel needs a separate change in `meta-capi.ts`.

---

## ADR-0002 — Landing page has exactly one H1; embedded product titles are H2

- **Status:** Accepted
- **Date:** 2026-10-19

**Context.** The homepage embeds the collar configurator, whose header rendered the
product name as an H1, giving two H1s (hero + product title).

**Decision.** `CollarConfigurator.Header` accepts `as` (`h1` default, `h2` when embedded).
Pages that embed the configurator below another H1 must pass `as="h2"`. Noindex on
letter-charm variants and the `pawcharms-pakabuciai` canonical stay as deliberate SEO choices.

**Consequences.** One H1 per page on the landing; PDPs keep their product-name H1.

---

## ADR-0001 — Documentation lives in an in-repo Obsidian vault

- **Status:** Accepted
- **Date:** 2026-09-20

**Context.** Project knowledge (why a pattern exists, what not to touch, how to add
a feature) was scattered across chat history, READMEs, and people's heads. AI agents
re-derived it every session and got it wrong.

**Decision.** All project documentation lives in `obsidian/`, a linked Obsidian vault
committed to the repo. Root `AGENTS.md` / `CLAUDE.md` / `.cursorrules` are thin shims
pointing into it. Claude Code hooks inject the pointer at session start, remind on
every prompt, and block once at Stop when code changed without a doc update.

**Consequences.** Documentation is versioned with the code and reviewed in the same
PR. Every code change carries a doc obligation. Agents get consistent context without
re-reading the whole codebase.

---
