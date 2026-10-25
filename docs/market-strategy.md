# Market Launch Strategy: PawsCharm

Status: draft v1, 2026-10-22. Written from what is already in the repo plus GA4 and Search Console country data. Items marked **(assumption)** or **(confirm)** are not verified. Decisions that need Rysard are listed at the end.

## 1. What already exists (checked 2026-10-22)

No dedicated multi-market plan existed. The pieces that did:

| Source | What it says | Gap |
|---|---|---|
| `docs/brand-bible.md` | Vision "Lithuania and the EU", target woman 22 to 35, urban LT + EU, market line "Lithuania / EU" | No named markets, no order, no targets |
| `docs/competitors.md` | "Market focus: Lithuania + Baltic region", LT competitors only | No LV, EE or EN-language competitors |
| `docs/superpowers/specs/2026-07-28-i18n-en-geo-locale-design.md` | Technical LT/EN setup: `/en`, next-intl, hreflang, sitemap, translated catalog layer | Language only. Nothing on shipping, VAT, pricing or demand |
| `obsidian/meta/decisions-log.md` ADR-0004 | `/` is always Lithuanian, no geo or cookie redirect, `/en` only by link or switcher | A language banner is listed as a possible next step, not built |
| `SEO-PLAN.md` | LT keywords, `/en` has 4 impressions | No per-market SEO |
| `docs/suppliers.md` | REACH certificate needed for EU sale of silicone | No market compliance checklist |

So the product is set up for two languages, and the strategy for where to sell, in what order and on what evidence is missing. This document fills that.

## 2. Evidence on demand today

GA4, all channels, 2026-07-24 to 2026-10-21 (property 545196251):

| Country | Users | Sessions | Note |
|---|---|---|---|
| Lithuania | 221 | 367 | 83% engagement, the only market with a plausible buyer profile |
| United States | 186 | 187 | 98% engagement, about one session per user: probably bots, scanners or an ad/crawler source, not buyers (confirm in GA4 source/medium) |
| Everyone else | 1 to 10 each | | China 10, Canada 9, Russia 7, UK 5, Netherlands 4, Germany 3, Sweden 3 |

Search Console, same quarter (2026-07-19 to 2026-10-19): Lithuania 64 clicks on 2,772 impressions. Every other country combined has 4 clicks and under 130 impressions (USA 78 impressions, UK 13, Germany 5, Latvia 3, Estonia 1, Poland 1).

GA4 has recorded zero purchases from any country. There is no sales evidence from any market yet, including Lithuania.

Reading: there is no organic pull outside Lithuania today. Latvia and Estonia show about 4 impressions in 3 months. Expanding by translation alone would not produce demand. Demand has to be created and tested with paid and social traffic first, and Lithuania has to convert before spending on other markets.

Market size is small even at home. OpenSEO (LT, 2026-10-22): `pavadėlis šuniui` and `pavadėlis šunims` 90 searches/month each, `šviečiantis antkaklis šuniui` 40, `antkaklis šuniui su vardu` no reported volume. Search will not carry the brand in any single small market, which is a reason to look at several, and to lean on Instagram, gifting and personalisation.

## 3. Principles

1. One market at a time, each behind a gate. Do not localise before the previous market converts.
2. Validate with traffic before building: a landing page and a small paid test before translation and catalog work.
3. Reuse the structure that already exists: one English site for all English markets, Shopify checkout handles currency, tax and shipping per country.
4. Native copy per language. No machine translation of marketing copy, no English slop translated into Lithuanian or Latvian.
5. Keep the differentiator in every market: BioThane, swap-in-5-seconds charms, handmade in Vilnius.

## 4. Market sequence (proposal)

| Phase | Markets | Why | Language / URL | Gate to start |
|---|---|---|---|---|
| 0, now | Lithuania | Only market with traffic. Zero purchases recorded, so fix conversion first | `/` (lt) | GA4 purchase tracking verified (SEO-01) |
| 1 | Latvia, Estonia | Closest: same currency (EUR), short shipping, similar buyer, Baltic focus already in `competitors.md` | English first on `/en`, native `/lv` and `/et` only after the test passes | At least 10 LT purchases from non-friends and a tested shipping rate **(proposed gate, confirm)** |
| 2 | Ireland, Netherlands, Nordics, Germany (English pages) | English-speaking dog owners, EUR or easy currencies, single EU VAT scheme | `/en` | Phase 1 test shows a repeatable cost per purchase below gross profit per order |
| 3 | UK, US (and Canada) | Large pet markets, personalisation sells, but customs, duties, longer shipping, different product rules | `/en`, later country-specific pricing | Phase 2 proven, shipping cost and returns modelled, profit per order positive after duties |

US note: the US traffic in GA4 looks automated, so it is not evidence of US demand. Treat the US as a later paid test, not a priority.

## 5. Market test (before any translation)

For each new market, a four-week test with a fixed cap:

1. Landing page: reuse `/en` with the market's shipping line, delivery time and price in EUR (or local currency through Shopify Markets), no new catalog.
2. Channel: Meta ads (the site already runs the Meta pixel via `MetaPixel`) to the target country, 2 to 3 audiences (dog owners, personalised gifts, aesthetic pet accounts), plus Instagram posts from `docs/instagram-posts-lt.md` adapted in English. Use the `ad-image-gen` skill with real product photography for creatives.
3. Budget cap and kill rule: set a total test budget and a cost-per-purchase ceiling in advance **(Rysard to set)**. Stop if there are no add-to-carts after two weeks.
4. Measure: sessions by country, add to cart, checkout started, purchases, shipping cost per order, delivery time, returns. All in GA4, which needs SEO-01 fixed first.
5. Decision: scale, hold, or drop. Record it in `obsidian/meta/decisions-log.md` as an ADR.

## 6. Operations and legal checklist per market

Confirm each with the accountant and the carrier before launch. None of it is verified here.

- **VAT:** EU distance sales to consumers move to destination-country VAT above the EU-wide distance-sales threshold (EUR 10,000 per year **(confirm current rule)**). Plan for registering in the EU One-Stop Shop (OSS) before crossing it, and check Shopify's tax settings per country.
- **Shipping:** carrier and price per country (LT post, DPD, Omniva or similar **(confirm)**), delivery time promised on the product page, and free-shipping threshold per market. The brand bible still says "From €X, free over €40 to 50": fill in real rates.
- **Returns and consumer law:** 14-day withdrawal right in the EU; personalised items (engraved or letter charms) may be exempt from it, which must be stated clearly in the policy **(confirm with a lawyer)**. Make the policy pages exist in each language you sell in.
- **Product compliance:** REACH certificate for the silicone charms (already flagged in `docs/suppliers.md`), GPSR labelling and contact information for EU sale, and a check of whether the charms need a small-parts warning. UK and US have their own rules **(confirm before Phase 3)**.
- **Currency and payments:** Shopify Markets for multi-currency and local payment methods. Check which local methods matter (for example bank-link payments in the Baltics).
- **Duties (UK, US, Canada):** decide who pays: delivered-duty-paid through Shopify Markets, or the customer on delivery. Model the margin both ways.
- **Language switcher and banner:** per ADR-0004 there is no automatic redirect. Add the dismissible banner suggested there so visitors from outside Lithuania find `/en` without breaking crawling.
- **Support:** one inbox, replies in English plus the local language for Phase 1, expected response time stated on the site.

## 7. SEO per market

- Keep the current setup: `lt` at `/`, `en` at `/en`, `x-default` set. One English site serves all English-language markets. Create separate country URLs (`/en-ie`, `/en-gb`) only if price, shipping or legal text differ enough to justify separate pages, because near-identical pages add little.
- Add `/lv` and `/et` only after the Phase 1 test passes. When added: native copy, `hreflang` `lv`, `et`, reciprocal tags on every page, sitemap entries per locale, and translated JSON-LD. Do not build language folders for markets with no demand.
- Keyword work per market before writing: run OpenSEO `research_keywords` with that market's location code, about 54 credits per seed **(estimate; the tool quotes the exact cost)**. Suggested: 3 seeds per market (personalised dog collar, dog collar charms, BioThane dog collar) for Latvia, Estonia, Ireland, Netherlands, Germany, UK. About 6 markets × 3 seeds ≈ 1,000 credits, needs approval. Local-language seeds need native checking.
- Competitors per market: profile the top 3 local results per market (OpenSEO `find_serp_competitors` or the `competitive-landscape` skill). Do not assume the LT competitors apply.
- Authority: local pet blogs, dog events, makers' directories and Instagram collaborators in each market. Real links only. The current spam links should not be mistaken for market links (SEO-05).
- Blog content: write per language from local search data, never a translation of the LT posts. Use `copywriting`, `marketing:content-creation`, the de-slop pass and `marketing:brand-review`, and the Writing standard in the SEO agent.

## 8. KPIs and gates

Track per market, weekly in the first month:

- Sessions, add-to-cart rate, checkout started, purchases, revenue (GA4)
- Cost per purchase and blended gross margin after shipping, duties and ad spend
- Delivery time and return rate
- Search: impressions and clicks by country in GSC, AI-answer mentions for that market's prompts

Gate to open the next market: positive profit per order in the current one after shipping and ad cost, at a purchase count set in advance **(Rysard to set; proposal: 10 purchases in the test market)**. Review monthly.

## 9. Risks

- No conversion data yet. Every market plan depends on SEO-01 and on LT proving the funnel.
- Distinguish Me and other local brands can copy a charm system in their home market; speed in LT matters before entering others.
- Shipping cost and small-parts or consumer-law rules can make a market unprofitable even with demand.
- Spreading a small team across several languages dilutes brand and support quality. Keep Phase 1 to English plus one or two languages.
- GA4 country data is polluted by non-human traffic (US, China, Russia). Filter before reading it as demand.

## 10. Decisions needed from Rysard

1. Confirm the order: Lithuania, then Latvia and Estonia, then English-language EU markets, then UK/US. Or name different priority markets.
2. Test budget and cost-per-purchase ceiling per market, and the purchase count that opens the next gate.
3. Real shipping rates, carriers and delivery times for LV, EE, and one far market (for example DE or IE).
4. Whether engraved or personalised items are exempt from the 14-day return right under your policy (lawyer or accountant).
5. Approve the market keyword research (about 1,000 credits, exact quote first) after the test pages exist.
6. Whether Latvian and Estonian pages are wanted at all, or English-only for Baltics.

## 11. Next actions (in order)

1. Fix GA4 purchase tracking and filter non-human traffic (SEO-01). No market decision is trustworthy without it.
2. Fill the shipping and returns facts above and update the brand bible pricing line.
3. Add the language suggestion banner from ADR-0004 once Phase 1 is approved.
4. Build the Phase 1 test page on `/en` with Baltic shipping details and launch the capped Meta test.
5. Review results after four weeks; record the decision as an ADR.
