# SEO Plan: pawscharm.com

Created: 2026-10-22 (mode `audit+plan`, nothing implemented). Repo `dog-shopify`, origin `github.com/dzekuza/pawlette-shopify`, HEAD `49e8c35`.
Platform (detected): Next.js App Router on Vercel, LT at `/`, EN at `/en`, Shopify Storefront API + checkout on `checkout.pawscharm.com`.
Rule for ticking: tick an item only after its acceptance check passes on the live site (rendered, not raw).

## Baseline (print dates next to every figure)

| Metric | Value | Source and window |
|---|---|---|
| Clicks / impressions | 33 / ~822 | GSC via OpenSEO, 2026-09-22 to 2026-10-19 |
| Top pages | `/` 25 clicks, 224 imps, pos 9.3; `/products` 3 clicks, 367 imps, pos 59.8; `/products/pawcharms-antkaklis` 1 click, 332 imps, pos 69.3 | same |
| Brand clicks | `pawcharms` 2, `trendy paws` 0 | same |
| Organic sessions / transactions / revenue | 24 / 0 / 0 EUR (previous 28d: 16 / 0 / 0) | GA4, 2026-09-24 to 2026-10-21 |
| Ecommerce, all channels | 0 transactions, 0 revenue | GA4, same window |
| Sitemap | 17 submitted, 0 indexed per GSC counter (stale: URL Inspection shows 5 of 6 sampled URLs indexed) | GSC sitemaps, last read 2026-10-21 |
| Rank tracker (mobile LT, top 40) | 8 of 17 keywords ranking; top 10: 4 (pakabukai #4, personalizuotas #5, antkaklis su vardu #7, biothane pavadelis #7) | OpenSEO, 2026-10-20 |
| AI visibility | mentioned 6/29, cited 7/29 | OpenSEO run 2026-10-21 |
| Audit issues | 55 orphan colour variants (all canonicalised, not in sitemap), 2 canonicalised | OpenSEO audit 2026-10-21, 79 pages |
| CWV field data | unverified (PSI quota 429; likely too little traffic for CrUX) | |

## Access map
GSC `sc-domain:pawscharm.com` (owner, verified through OpenSEO and gsc-mcp, same domain). GA4 `properties/545196251` (no measurement issues, purchase key event exists, 0 purchases ever in window). OpenSEO project `1690a28f-...` (credits 4,919). Missing or unverified: seo-audits MCP (not registered), Merchant Center, Bing Webmaster, Vercel/server logs, GSC Indexing report and Crawl stats (browser sign-in not used), Ahrefs not queried.

## Checklist

Legend: P = priority (1 highest), Effort S/M/L. "Added by audit" = new this run.

- [ ] **SEO-01** P1 S. Measure the real conversion path: GA4 shows 0 purchases and 0 revenue for all channels, and the top landing page list contains `localhost`, `checkout.pawscharm.com` and junk `.json` URLs. Verify purchase event fires from checkout.pawscharm.com on a test order, exclude localhost/dev traffic (internal-traffic filter), confirm cross-domain linking. Acceptance: one test purchase appears in GA4 DebugView/Realtime with value and currency; `localhost` hostname absent from the next 7 days of landing pages. (added by audit) STATUS 2026-10-22: code fixed, commit 547f889, in production since the 2026-10-25 deploy: GA4 gated to pawscharm.com production only, cross-domain linker to checkout.pawscharm.com, add_to_cart and begin_checkout with EUR value and items. Root cause of 0 purchases not confirmed: purchase is sent server-side by `src/app/api/shopify/orders-paid/route.ts` (GA4 Measurement Protocol) and is skipped when `GA_API_SECRET` or `SHOPIFY_WEBHOOK_SECRET` is unset, the `orders/paid` webhook is not registered, the order is a test order, or the buyer has not accepted cookies. Shopify has 2 paid orders (#1001, #1002, GBP) but GA4 has none. STILL OPEN: acceptance not met until a real non-test order shows in GA4. Rysard steps listed under Needs Rysard.
- [ ] **SEO-02** P1 M. Lift `/products` from position ~60 for `rankų darbo antkakliai šunims`, `antkakliai šunims su vardu`, `šunų antkakliai`. It is the designated owner (project context) with 367 imps and 0.8% CTR. Currently one mixed listing (collars, leashes, charms, sets) with FAQ. Add a collar-only intro and category copy above the grid, move leashes and charms to their own sections or pages, add internal links from home and guides with the exact-match anchors. Acceptance: H1 and first 100 words contain the primary term; GSC average position for the page under 40 within 6 weeks; no loss of home rankings for `antkakliai sunims su vardu`. STATUS 2026-10-22: implemented, commits 5a5bd53 and 796d07a, live in production since the 2026-10-25 deploy of 7fc01e6 (Vercel; title and H1 confirmed on the live page 2026-10-30). New title, meta, H1 and collar-led intro, CollectionPage and BreadcrumbList schema, links from home, guides and footer. Build passes; verified at 390px in dev. Position target (under 40 within 6 weeks) measured from the 2026-10-25 deploy; GSC showed position 58.9 for 2026-09-30 to 2026-10-27, so re-measure about 2026-12-06. Not ticked: acceptance not met yet.
- [ ] **SEO-03** P1 S. Resolve the two-pages-one-intent risk: `/products/pawcharms-antkaklis` (H1 "Šuns antkaklis su vardu") ranks 69 for generic terms while home owns the head terms. Follow the project's ownership rule (PDP = product detail + `biothane antkaklis`). Change PDP H1/H2 wording away from head terms, link it from home with product anchors. Acceptance: GSC query-by-page report shows `suns antkaklis su vardu` served by `/` only. (page-owner rule already in OpenSEO context) STATUS 2026-10-30: PDP title changed to "Personalizuotas BioThane antkaklis, 5 pakabukai", home links with product anchors exist (796d07a), but the PDP H1 is still "Šuns antkaklis su vardu" (live page, 2026-10-30), the head term home owns. Open: change the H1 (and H2s) away from the head term, then check the query-by-page report.
- [ ] **SEO-04** P1 S. Get the two new Lithuanian guides discovered: `/guide/kaip-isrinkti-antkakli-su-vardu` is "URL is unknown to Google" (inspected 2026-10-22) although in the sitemap and linked from every page. Needs request indexing in GSC (state change, needs approval) and a check in 7 days. Acceptance: URL Inspection returns "Submitted and indexed" for both `kaip-isrinkti...` and `ka-patikrinti...` guides. STATUS 2026-10-22: Request indexing accepted for both guides in GSC (Rysard approved). Before: `kaip-isrinkti` was Discovered, currently not indexed; `ka-patikrinti-uzsakant-antkakli-su-vardu` was unknown to Google with no referring page or sitemap. Re-check URL Inspection on 2026-10-29; if the second guide is still unknown, add internal links to it.
- [ ] **SEO-05** P2 M. Authority: the real profile is about 30 referring domains (Oct 2025 to Aug 2026: 23 to 38). Since Sept 2026 a link-spam flood adds new domains daily (OpenSEO backlinks, 2026-10-22: 2,198 referring domains, 2,308 backlinks, spam score 54). All share one pattern: throwaway SEO-tool domains (`*checker.store`, `*backlinks*.shop` and similar), same path `/dir/backlinks-for-domain-authority-159347`, same anchor "Expert Backlink Building Services to Grow pawscharm.com Website Rankings". It looks like link-selling spam, not a targeted attack. Do not disavow now (Google normally ignores such links); check GSC > Manual actions once, and disavow only if a manual action or a clear ranking drop appears. Ignore total backlink counts from here on and track only domains with spam score under 40. Start 5 to 10 legitimate LT links (local pet blogs, Vilnius makers, directories, Instagram collab pages). Acceptance: manual-actions check recorded; ranked prospect list with pitch angles; 3 earned links within 8 weeks.
- [ ] **SEO-06** P2 S. Fix `checkout.pawscharm.com` leaking into Google (GSC shows impressions for its home, policies and a product, 2026-09-22 to 2026-10-19). Home now serves `noindex, follow` (curl 2026-10-22); policies and product pages not verified. STATUS 2026-10-30: `/`, `/policies/privacy-policy`, `/products/pawcharms-antkaklis` and `/collections/all` on checkout.pawscharm.com all return 200 with `noindex, follow` (curl). Still open: GSC showed impressions for checkout URLs on 2026-09-30 to 2026-10-27 (12 home, 5 privacy, 3 terms), so wait for the 6-week check; the host still serves sitemap.xml and robots.txt with Allow: / (low). Acceptance: all `checkout.pawscharm.com` URLs return noindex or redirect to pawscharm.com; GSC shows 0 impressions for that host in 6 weeks. Shopify admin setting, not repo. (added by audit)
- [ ] **SEO-07** P2 M. Add a dedicated, indexable LT pavadėlių keyword page plan: `/pavadeliai` has hreflang-less single-language status (correct, no `/en/pavadeliai`, which returns 404), but pos 8.5 on 16 imps and no top-40 for `pavadėlis šuniui`, `šunų pavadėliai`. Add intro copy, internal links from home, and an EN equivalent only if EN demand exists. Acceptance: `pavadėlis šuniui` enters top 40 in the 2026-11-30 rank-tracker run.
- [ ] **SEO-08** P2 M. Product schema review fields: Rich Results show warnings "Missing aggregateRating / review" on collar PDP and sets. `REVIEWS` in `src/lib/reviews.ts` is empty, and rules forbid invented reviews. Collect real reviews (post-purchase Klaviyo/Omnisend request), then render. Acceptance: when at least 3 real reviews exist, Product JSON-LD includes `aggregateRating` equal to the visible rating. Do not add before then.
- [ ] **SEO-09** P3 M. CTR and snippet quality for position 4 to 10 queries: `antkakliai sunims su vardu` (pos 4.7, 75 imps, 8 clicks) is fine; `antkaklis su vardu` 5.6 with 7 imps, 0 clicks; `sunu antkakliai su vardais` pos 3. Test title variants on home only after 2 more weeks of data. Acceptance: home CTR on `antkaklis su vardu` above 5% in the next 28-day window.
- [ ] **SEO-10** P3 M. Capture synonym demand with a small guide or FAQ block: `suns apykakle` (26 imps), `suns dirzelis ant kaklo` (28), `odiniai antkakliai` (9 to 17), `antkakliai maziems suniukams` (14). Write natively in Lithuanian via `copywriting` + brand review. Acceptance: each synonym appears in an H2/FAQ on an owned page; impressions/position tracked from 2026-11-30.
- [ ] **SEO-11** P3 S. Homepage mobile weight: home loads two GLB models, Draco WASM and an HDRI from raw.githubusercontent.com (a third-party dependency, 301 via githack first). Self-host the HDRI and defer 3D below the fold. Acceptance: no third-party HDRI request; lab LCP stays under 2.5 s on mobile Lighthouse. (added by audit)
- [ ] **SEO-12** P3 S. Console noise: Shopify app-proxy chat widget request `pawcharms-2.myshopify.com/apps/chat-widget/settings` fails on every page (CORS) and loads the widget script from vercel.app. Remove or fix; reduces failed requests. Acceptance: zero console errors on home, `/products`, one PDP. (added by audit)
- [ ] **SEO-13** P3 S. 404 pages for non-existent paths return `index, follow` in meta when under certain routes (`/en/pavadeliai`, `/collections/all`); `/nonexistent-xyz` is correctly `noindex`. Make the not-found template consistently noindex. Acceptance: all three return 404 with `noindex`. (added by audit) STATUS 2026-10-30: fixed in commit fd30013 (`metadata.robots` noindex, follow in `src/app/not-found.tsx`); build passes and a local production server returns `noindex, follow`. Not deployed or pushed yet; re-check the three URLs after deploy.
- [ ] **SEO-14** P3 S. Legacy `.json` and `-json` product URLs get landing sessions in GA4 (`/en/products/anti-tangle-dual-retractable-walking-leash.json`, `/products/chirp-chase-interactive-birdjson`, both 404). Source is likely a leftover Shopify demo catalogue or scanner; confirm origin, no action if bots. Acceptance: source identified; no internal links to these. (added by audit)
- [ ] **SEO-15** P3 S. Docs drift: `obsidian/frontend/seo-metadata.md` says `robots.ts` exists but the site uses static `public/robots.txt`; CLAUDE.md mentions `llms.txt`. Update docs when next touching SEO files. Acceptance: docs match the repo.
- [ ] **SEO-16** P4 L. GEO: 6/29 mentions, none on advice prompts. Publish comparison/advice content answering the tracked LT prompts (BioThane vs nailon exists as EN `silicone-vs-nylon`; add LT), get cited sources (pupas.lt, squffy.com, bakli.lt appear). Acceptance: next weekly run (2026-10-27) vs baseline; target 10/29 mentions after content ships.
- [ ] **SEO-17** P3 M. Collar closure and types guide (LT, native): distinguishme.eu ranks #4 for `martingale antkaklis` (70 searches/month) with a single page on closure types (OpenSEO, 2026-10-22). Write a guide covering martingale, buckle and quick-release collars and where BioThane fits, with links to `/products` and `/guide/kaip-isrinkti-antkakli-su-vardu`. Use `copywriting`, `marketing:content-creation`, the de-slop pass and `marketing:brand-review`; draft only. Needs real product facts from Rysard. Acceptance: draft saved and approved; after publish the page is indexed and tracked for `martingale antkaklis`. (added by audit)
- [ ] **SEO-18** P3 S. Charms landing wording: bakli.lt ranks #4 to 6 for `pakabukai šunims` and #12 for `pakabukas šuniui` (70 searches/month each) with a thin accessories page. Make `/products/pawcharms-pakabuciai` (or a charms section on `/products`) target `pakabukai šunims` and `pakabukai šunims su vardu` in H1, intro and internal anchors. Acceptance: tracked `pakabukai šunims` position under 10 by the 2026-11-30 tracker run. (added by audit)

## Baseline checklist (items 1 to 20)

Legend: pass (raw) means verified on server HTML via fetch in a real Chrome tab and compared with rendered DOM on the home page only.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | noindex | pass | `/cart`, `/checkout`, `/account`, `/landing-v2`, `/coming-soon` noindex,nofollow; indexable pages `index, follow`. Internal search not found, unverified |
| 2 | Titles | pass | 7 sampled pages 38 to 59 chars, unique |
| 3 | Meta descriptions | pass | 150 to 159 chars on all sampled pages. Home is 159 chars: the earlier ~170 finding is already fixed by 49e8c35 (live matches repo). EN `/en/products` 153 |
| 4 | Alt text | pass | 0 images missing alt on 9 sampled pages; quality of alt text not reviewed |
| 5 | CWV field data | unverified | PSI 429; CrUX not checked. Lab LCP home mobile 1.0 s (Playwright, 390px, not Lighthouse) |
| 6 | Sitemap | pass with note | 17 canonical URLs, submitted, in robots.txt; `lastmod` real for static (hand-set) pages; GSC "0 indexed" counter lags |
| 7 | OG/Twitter | pass (raw) | og:title, description, image `/og-image.jpg`, twitter summary_large_image. One shared OG image for all pages |
| 8 | Broken links / chains | unverified | audit 2026-10-21 found no broken links or chains; I did not re-crawl |
| 9 | Heading hierarchy | pass (raw) | no skips on sampled pages |
| 10 | Backlinks | fail | spam-dominated profile; no quality links known (SEO-05) |
| 11 | Slugs | pass | short, lowercase, hyphenated |
| 12 | Internal links | pass with note | every page links to guides, /products, /pavadeliai; 55 colour-variant orphans are intentional (canonicalised, not in sitemap) |
| 13 | Canonicals | pass | self on indexable; variants canonicalise to parent; EN self-canonical |
| 14 | HTTPS / host | pass | http and www both 308 to `https://pawscharm.com/` (one hop) |
| 15 | Images | unverified | home first images eager, below lazy; dimensions present; formats not audited |
| 16 | Schema (rendered) | pass | home Organization, WebSite, FAQPage; PDP Product, Offer (price, validity, availability, shipping, return policy), BreadcrumbList, FAQPage; no ratings (none real). Rich Results check shows only review warnings |
| 17 | Search Console | pass | `list_sitemaps` returns `sc-domain:pawscharm.com`; OpenSEO property identical |
| 18 | One H1 | pass | 1 H1 on all sampled pages |
| 19 | robots.txt | pass | Allow all, names GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot; sitemap referenced. OAI-SearchBot not named, covered by `*` |
| 20 | Mobile 390 px | pass | home, `/products`, PDP: viewport ok, no horizontal scroll; 7 of 75 tap targets under 44px on home, 18 under 40px on PDP (measured, needs review) |

hreflang: home, `/en`, `/products`, `/en/products`, PDPs all carry lt/en/x-default pairs (also sent in Link header). `/pavadeliai`, guides and FAQ have none because they exist in one language only. The earlier "no hreflang on /pavadeliai" is true and not an error.

## Indexation
URL Inspection (2026-10-22): `/`, `/en`, `/products`, `/pavadeliai`, PDP indexed, canonical agrees. `/guide/kaip-isrinkti-antkakli-su-vardu`: unknown to Google. Sitemap read: 0 errors, 0 warnings, downloaded 2026-10-21.

## Keyword to page map (from GSC queries and tracker; no paid data)

| Query group | Owner page | Status |
|---|---|---|
| antkakliai šunims su vardu, šuns antkaklis su vardu, antkaklis su vardu | `/` | pos 4.7 to 10.4, keep |
| rankų darbo antkakliai šunims, antkakliai šunims, šunų antkakliai | `/products` | pos 33 to 83, main gap |
| biothane antkaklis | `/products/pawcharms-antkaklis` | pos 15 |
| keičiami pakabukai antkakliui, šuns pakabukai | `/products/pawcharms-pakabuciai` | #4 tracked |
| pavadėlis šuniui, biothane pavadėlis | `/pavadeliai` | #7 / not in top 40 |
| apykaklė, dirželis ant kaklo, odiniai antkakliai, mažiems šuniukams | none yet | gap (SEO-10) |
| personalized dog collar (EN) | `/en` | 4 imps only |

## Competitors (docs/competitors.md, OpenSEO context, paid reads 2026-10-22)
- distinguishme.eu: about 70 organic visits/month, 10 ranked keywords (DataForSEO). Ranks #4 `martingale antkaklis` (guide page), #14 `biotano pavadelis` (collection), brand terms. Does not appear for `šuns antkaklis su vardu` in this data, so treat the earlier "#1 on mobile" note as a live-SERP spot check only. 275 referring domains.
- bakli.lt: about 294 organic visits/month, 85 keywords, mostly wallets and phone cases. Dog pages: `antkakliai sunims` pos 39 (390/month), `pakabukai šunims` pos 4 to 6 (70/month). Cited in 5 of 29 AI answers. Modest threat.
- pupas.lt, squffy.com, waggingtail.eu, laumeshandmade.lt, tavoteka.lt are cited in AI answers but not profiled. Springland Pets and Wear Felicity are non-Lithuanian. PawsCharm differentiator: BioThane plus swappable charms plus handmade in Vilnius.
- Market size: Lithuanian demand is small. `pavadėlis šuniui` and `pavadėlis šunims` 90/month each (KD 0), `šviečiantis antkaklis šuniui` 40, `apykaklė šunims` 30, `antkaklis šuniui su vardu` no reported volume. Even full ownership of these terms is a few hundred visits/month, so SEO needs conversion work (SEO-01) and the EN market alongside it.

## Needs Rysard
- Approve: GSC "Request indexing" for the 2 new guides (SEO-04).
- Paid OpenSEO calls run 2026-10-22 (approved by Rysard): backlinks overview and profile, domain overview and ranked keywords for distinguishme.eu and bakli.lt, keyword research for 3 LT seeds. Spent 301 credits, 4,602 left. Not run: full `competitor-analysis` skill, rank tracker run (`estimate_rank_tracker_cost` first).
- Check GSC > Manual actions once (SEO-05).
- Deploy fd30013 (404 noindex). Earlier commits 547f889 (GA4), 5a5bd53 and 796d07a (/products) are already on origin/main and live. Plan hashes corrected 2026-10-30 (old 0edbfc2, bde878c, 3b13ec7 were pre-rewrite).
- Vercel env (Production): confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GA_API_SECRET`, `SHOPIFY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN`.
- GA4 Admin: add `checkout.pawscharm.com` to cross-domain list and unwanted referrals; add the internal-traffic filter and set it Active.
- Shopify admin: confirm the `orders/paid` webhook points to `https://pawscharm.com/api/shopify/orders-paid`; check which tag fires on checkout.pawscharm.com (Customer events or Google & YouTube) and which GA4 ID it uses; check why orders are GBP while the site tracks EUR.
- Place one real non-test order with cookies accepted and confirm `purchase` in GA4 Realtime and the Vercel log line `orders-paid: ga4`.
- Content: confirm the collar price (live site 33 €, brand bible 28 €) and the charm material (silicone or resin).
- Not allowed this run: `run_site_audit`, `save_report`, `update_project_context`, IndexNow.
- Access gaps: seo-audits MCP not registered (`claude mcp add --scope user --transport http seo-audits https://seo.gvozdovic.com/api/mcp --header "Authorization: Bearer <token>"`), Merchant Center, Bing Webmaster, Vercel logs, GSC Indexing/Crawl stats.
- Content needing real input: customer reviews for schema; photos of the product in use; any local PR contacts.
