---
tags: [meta, decision]
updated: 2026-10-19
---

# Decisions Log (ADRs)

Architecture Decision Records. Each entry captures a choice, its context, and its
consequences. Use [[templates/adr-note]] for new entries. Newest first.

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
