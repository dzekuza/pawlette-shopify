# PawCharms — Brand & Product Bible

> **Source:** Synthesized from 7 physical product photos (`/Downloads/PAWCHARMS/PRODUCT/`), 4 reference images, existing `docs/`, `src/lib/data.ts`, UI copy, and `globals.css`.  
> **Last updated:** 2026-06-14

---

## 1. Brand Identity

### Name & Handles
- **Legal / domain:** PawCharms (`pawcharms.lt`)
- **Brand display name:** PawCharms
- **Lithuanian alternative:** Žavesys (means "enchantment/charm") — for LT-market storytelling, not primary
- **Instagram handle:** `@pawcharms` (or `@pawlette` if pivoting)

### Mission
Make every dog's collar as individual as they are — through a snap-on charm system that changes in five seconds, looks premium, and survives whatever the dog does next.

### Vision
The go-to pet accessories brand for aesthetics-driven dog owners in Lithuania and the EU — a brand people recognize by the pastel strap on a dog's neck before they read the name.

### Values
1. **Personality first** — every dog is a character; the collar should show it
2. **Effortless quality** — premium feel without fuss (waterproof, no-tool swap)
3. **Made with care** — handcrafted in Vilnius, not dropshipped from a warehouse
4. **Honest materials** — what we say is what it is (BioThane strap, silicone/3D-printed charms)

### Target Audience
- **Primary:** Women 22–35, urban Lithuania + EU, treat their dog as a personality not a pet
- **Secondary:** Gift-buyers (birthdays, dog adoption days, "new puppy" gifts)
- **Psychographic:** Follows aesthetics accounts on Instagram, buys from small local brands, cares about the visual of a flat-lay photo with their dog

### Unique Selling Proposition
> *The only waterproof collar with a charm system that swaps in 5 seconds — made by hand in Vilnius.*

Three things competitors don't combine simultaneously: BioThane durability + personalizable charm system + local Lithuanian origin.

---

## 2. Product Details

### 2.1 The Collar Strap

**Material:** BioThane-coated webbing (TPU-laminated polyester)  
**Surface:** Smooth, slightly matte finish — not glossy, not fabric  
**Colors (current lineup):**
| Name | Hex | CSS Token |
|------|-----|-----------|
| Sage | `#A8D5A2` | `--color-sage` |
| Blossom | `#F4B5C0` | `--color-blossom` |
| Sky | `#B8D8F4` | `--color-sky` |
| Honey | `#F9E4A0` | `--color-honey` |

**Properties:** Waterproof · Odor-resistant · Stain-resistant · Flexible · Machine-safe rinse  
**Widths:** ~20 mm (standard charm-compatible width)  
**Sizes:**
| Size | Neck circumference |
|------|--------------------|
| S | 28–36 cm |
| M | 36–44 cm |
| L | 44–52 cm |

### 2.2 The Buckle Hardware

**Type:** Frame/center-bar buckle (belt-style, not side-release plastic)  
**Finish:** Matte silver / gunmetal — a single rectangular metal frame with a center pin  
**Loop/keeper:** Small matching BioThane loop keeper sits below the buckle on the strap  
**D-ring:** Integrated into the strap near the buckle for leash attachment  

> ⚠️ **Note for copy/photos:** The buckle is a frame buckle, not a side-release. Do not show or describe a plastic side-release buckle — the actual hardware is the refined metal frame style.

### 2.3 The Charm System — How It Actually Works

This is the core product innovation. Understanding the mechanism is essential for accurate copy, photography direction, and AI prompt writing.

**Mechanism (from physical product photos):**
- Each charm has a **clip base with two side notches** (visible as an H-shape when viewed from the front of the base — see IMG_1201)
- The charm **clips onto the collar strap from above** — the two side notches grip the left and right edges of the strap
- A separate **rectangular mounting adapter** (IMG_1202 bottom) threads onto the strap first; the charm body then snaps onto this adapter via a rectangular hole in the charm base
- Charms sit **raised and upright above the strap surface** — they are not flat on the strap, they have visible height and a mounting base
- Charms are **not pendant-style** (they do not hang below the strap)
- Multiple charms clip in sequence along the strap, each one mounted on its own adapter, spelling names or mixing shapes
- To remove: squeeze/release the side notches to unclip — swaps in ~5 seconds

**Charm types (observed in physical samples):**
- **Letter charms** — bubble/rounded bold font, individual uppercase letters, ~15–20 mm tall
- **Paw print charm** — outline paw with toe pads visible, same threading mechanism
- **Heart charm** — rounded heart silhouette with threading slot

**Charm material (from photos):**
The surface texture in the physical samples shows a matte, slightly granular finish consistent with **3D-printed resin or SLA/FDM printing** rather than injection-molded silicone. The color is uniform throughout (not a coating). This is important for photography direction — the texture is subtly visible at macro distances.

> ⚠️ **Copy note:** Current site copy says "food-grade silicone" for charms. Verify with production whether this refers to the charm material or the collar. Update copy once confirmed.

**Charm colors (current):**
Sky blue (`#B8D8F4` range) is the sample color. Production will offer charms in all four collar colors plus mixed options.

### 2.4 The Leash

**Material:** BioThane — same material as collar, matching color  
**Clip hardware:** Two silver snap-hook carabiners (dual-clip convertible leash design)  
- One clip at the end of the leash (standard dog attachment)  
- Second clip mid-strap or at handle end (allows short-leash / hands-free / double-attach configurations)  
**Width:** ~20 mm, matching collar  
**Color shown in samples:** Sky blue with silver hardware

### 2.5 Pricing

| Product | Price |
|---------|-------|
| Collar set (collar + 5 charms) | €28 |
| Individual charm | €6 |
| Shipping | From €X (free over €40–50) |

**Gross margin:** ~85–87% at current pricing

---

## 3. Visual Identity

### 3.1 Color Palette

```
Background:    Cream       #FAF7F2   --color-cream         (NEVER pure white)
Primary CTA:   Sage        #A8D5A2   --color-sage
Text/Dark:     Bark        #3D3530   --color-bark
Accent Pink:   Blossom     #F4B5C0   --color-blossom
Accent Blue:   Sky         #B8D8F4   --color-sky
Accent Yellow: Honey       #F9E4A0   --color-honey
Light text:    Bark Light  #6B6460   --color-bark-light
Muted text:    Bark Muted  #706B68   --color-bark-muted
Surface 2:     —           #F3EDE6   --color-surface-2
Border:        —           #E8E3DC   --color-border
```

**Usage rules:**
- Never use pure white `#FFFFFF` as a background — always Cream
- The four collar colors (Sage / Blossom / Sky / Honey) are also the accent palette — they're the same colors
- Bark is the only dark — no pure black
- CTAs and interactive elements: Sage green

### 3.2 Typography

| Role | Font | Source |
|------|------|--------|
| Display / headings | Luckiest Guy | `/public/LuckiestGuy-Regular.ttf` (local) |
| Body / UI | DM Sans | Google Fonts |
| Handwritten accent | Caveat | Google Fonts |

**Heading character:** Chunky, all-caps, bubble-rounded. Visually echoes the rounded letterforms of the physical charms. This is intentional — the brand's physical product and its display type share the same rounded personality.

**Future-forward recommendation:** Fredoka One (Google Fonts) — slightly more refined than Luckiest Guy while keeping the rounded playful energy.

### 3.3 Logo & Mark

- **Primary:** PawCharms wordmark with paw-dot treatment on the "i" or charm detail
- **Favicon/icon:** `pawcharmsfav.jpg` 
- **SVG mark:** `pawcharms.svg`

### 3.4 Photography Style

**Product photography (flat lay):**
- **Background:** Cream linen or textured paper (`#FAF7F2`) — NEVER pure white
- **Lighting:** Soft natural window light from upper-left, warm and slightly creamy
- **Shadows:** Gentle, soft — no harsh flash shadows
- **Layout:** Diagonal staircase / fan arrangement of multiple collars
- **Aspect ratios:** 4:5 (feed), 1:1 (grid), 9:16 (Stories)

**Lifestyle photography:**
- Real dogs in natural settings — gardens, beaches, parks, living rooms
- Owner in frame: partial (hands, legs, shoulder) — dog is the subject
- Warm, golden-hour or soft-overcast natural light
- Emotional, candid, not staged-catalogue

**Critical charm photography rule:**
> Charms **clip onto the collar strap from above** via a snap-mount base with two side notches gripping the strap edges. Each charm sits **raised and upright** above the strap — they have visible height/dimension above the strap surface. They do NOT hang as pendants below the strap, and they do NOT lie flat through the strap. The letter face points forward/upward, the clip base wraps around the strap underneath. Always verify this in reference shots before generating or briefing photography.

**AI prompt anchor (for Gemini / ad generation):**
```
A [COLOR] BioThane dog collar with a matte silver frame buckle 
and a small D-ring loop. On the collar strap sit [N] chunky 
3D-molded silicone letter charms in [CHARM COLOR] — each charm 
has a horizontal channel the strap threads through, so the 
letters sit flat and flush on top of the strap spelling [NAME]. 
A [SHAPE] charm in matching [CHARM COLOR] finishes the sequence. 
The overall feel is minimal, premium, and playful.
```

---

## 4. Messaging & Voice

### 4.1 Brand Voice

| Dimension | Do | Don't |
|-----------|-----|-------|
| Tone | Warm, direct, a little playful | Formal, clinical, corporate |
| Vocabulary | Short words, active verbs | "Revolutionary", "state-of-the-art", jargon |
| Personality | A cool friend who happens to make dog things | A pet supply company |
| Length | Short bursts. One idea per sentence. | Long paragraphs of features |
| Emotion | Pride in the dog's personality | Guilt / fear (don't use "what if they get lost") |

### 4.2 Key Messaging Pillars

**1. Swap in seconds**
> "Changes in 5 seconds. No tools. No fumbling."  
Everything about the charm system is frictionless — the copy should feel that way too.

**2. Actually waterproof**
> "Lake swims. Muddy walks. Storm-day beach runs. No smell, no stains."  
Real conditions, real proof. Never "splash-proof" or "water-resistant" — it's fully waterproof.

**3. Yours**
> "Your dog. Your name. Your combo."  
Personalization is the hook. The collar becomes unique the moment the charms go on.

**4. Made here**
> "Handmade in Vilnius, Lithuania."  
Not a factory claim — a people claim. Someone made this.

### 4.3 Taglines & Headlines (in use)

**English:**
- "Waterproof. Playful. Yours."
- "Attach and Show"
- "Your dog. Your style."
- "Attaches in 5 seconds. No tools. No hassle."
- "Waterproof. No scent. No stains."
- "Handmade in Vilnius, Lithuania."

**Lithuanian:**
- "Antkakliai, skirti jiems." — Collars made for them.
- "Atsparu vandeniui. Personalizuoti." — Waterproof. Personalized.
- "Pagaminta Lietuvoje" — Made in Lithuania
- "Prisitvirtina per 5 sekundes" — Attaches in 5 seconds
- "Rankų darbo" — Handmade

### 4.4 Customer Reviews (social proof to reuse)
- *"Atsparus vandeniui — po 2 mėnesių plaukiojimo ir purvino pasivaikščiojimo vis dar kaip naujas"* — Laima K.
- *"Nusipirkau vieną, iš karto užsakiau dar 3 dovanoms. Džiaugiuosi, kad pagaminta Lietuvoje"* — Rūta P.
- *"Prabangiai atrodo, bet nejautrūs vandeniui — puikus derinys"* — Eglė M.

---

## 5. Content Strategy

### 5.1 Instagram Pillars (3)

1. **Product Hero** — clean flat-lay, product as art object, charm combinations, color pairings
2. **Dog Personality** — real dogs wearing the collar, user-generated content, names spelled out
3. **Education** — how to measure, material comparisons, care tips, styling guides

**Frequency:** 4–5× per week (mix of feed + Stories)

### 5.2 Core Lithuanian Hashtags
`#šunys #šuniukas #šunýslietuva #lietuva #šunųmama #augintinis #pawcharms`

---

## 6. Competitive Position

| Brand | Threat | What they have | What they lack |
|-------|--------|----------------|----------------|
| Distinguish Me (Kaunas) | HIGH | BioThane, local, handmade | No charm system |
| Springland Pets | MEDIUM | Charms, established | Not local, not BioThane |
| Wear Felicity | MEDIUM | Waterproof charms | Not local |
| Bakli.lt | LOW-MEDIUM | Price | No brand, no differentiation |

**Moat:** BioThane + charm system + local = no direct competitor currently.

---

## 7. Discrepancies & Recommendations

These are gaps between what the physical product shows and what's currently in the codebase/docs.

### 7.1 Buckle type — **fix copy**
- **Current copy:** "side-release buckle" (and some UI imagery implies plastic clip)
- **Reality (from photos):** Metal frame buckle (center-bar / belt-style, matte silver)
- **Action:** Update `data.ts` product descriptions and any photography briefs that mention "side-release"

### 7.2 Charm material — **verify and fix**
- **Current copy:** "food-grade silicone" 
- **Reality (from photos):** Surface texture suggests 3D-printed resin (matte, slightly granular) — not smooth injection-molded silicone
- **Action:** Confirm with production. If 3D-printed: update to "durable, food-safe resin" or similar accurate descriptor

### 7.3 Leash — **not yet represented on site**
- **Reality:** The product set includes a full BioThane leash with dual snap-hooks (convertible leash design)
- **Current site:** Leash not shown or sold separately as far as the codebase reflects
- **Action:** Add leash to product data and configurator if it's being sold

### 7.4 Photography — **charms shown incorrectly in AI-gen refs**
- **Reference images in `/REFEREMCE/`:** Show charms threaded on the collar correctly for the brass letter style, but the actual sky-blue charm threading mechanism differs slightly in appearance
- **Action:** Use physical product photos as primary reference for any new AI-generated photography, not the existing reference images

### 7.5 Font consistency — **minor**
- `docs/brand.md` recommends Fredoka One as the brand-forward display font
- Code uses Luckiest Guy (loaded locally)
- **Action:** Pick one and document it here as canonical. Current recommendation: keep Luckiest Guy until a visual refresh is planned (it's already loaded, no perf cost to change).

### 7.6 Collar description mentions "silicone" for the strap
- **Current `data.ts`:** Some references call the collar material "silicone"
- **Reality:** The strap is BioThane (TPU-coated webbing), not silicone
- **Action:** Audit `data.ts` and all copy for the word "silicone collar" — the collar is BioThane; only potentially the charms are silicone/resin

---

## 8. Quick Reference Card

```
Brand:       PawCharms
Market:      Lithuania / EU
Language:    Lithuanian (primary), English (secondary)
Audience:    Women 22-35, urban, dog as personality
Strap:       BioThane (TPU-coated polyester) — waterproof
Hardware:    Matte silver frame buckle + snap-hook
Charms:      3D-molded, horizontal threading, flat on strap
Colors:      Sage / Blossom / Sky / Honey (+ Cream bg + Bark text)
Fonts:       Luckiest Guy (display) · DM Sans (body) · Caveat (accent)
Price:       €28 set · €6 charm
Origin:      Handmade in Vilnius, Lithuania
USP:         BioThane + charm system + local origin = unique
```

---

*For ad image generation, use `/Downloads/PAWCHARMS/PRODUCT/` as the product images folder (7 angles). Reference images are in `/Downloads/PAWCHARMS/REFEREMCE/`.*
