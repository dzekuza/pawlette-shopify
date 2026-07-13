# Collar 3D Preview — Design

## Goal

Add a "Preview in 3D" button + modal to the collar product page (`SingleProductPage.tsx` → `CollarPDP`), letting customers rotate a 3D model of the collar in their selected strap color, with any selected letter charms placed around the strap.

## Background

A standalone prototype app already exists at `collar-customiser/app/` (its own Next.js project, own git repo) built with `@react-three/fiber` + `@react-three/drei` + `three`. It renders a collar GLB with a name spelled out in letter-charm meshes (A–Z, 0–9) positioned around the strap, plus strap/hardware color pickers. Source of truth for geometry/layout math: `collar-customiser/app/src/lib/collar.ts` and `collar-customiser/app/src/components/Collar.tsx`.

This does not map 1:1 onto the real Shopify PDP: the live store has no "engraved name" feature. Instead, charms are individual purchasable products (up to 5 selected, shown as flat images in slots — see `selectedCollarCharms` state and the Personalise dialog in `SingleProductPage.tsx`). Charms fall into two categories (`ShopifyCharm.category`, resolved in `src/lib/shopify.ts`'s `resolveCharmMeta`):
- `'letter'` — e.g. title `"Letter A - Blue"`, `baseTitle: "Letter A"`, has a real 3D mesh (`Charm_A` etc. in `charms.glb`).
- `'icon'` — shape charms (paw, star, heart, etc.) with no corresponding 3D mesh.

Only letter category charms exist as real product data (no numeric digit charms in the catalog, despite the 3D demo's math supporting 0–9).

## Scope decision

The 3D preview reflects the customer's **actual** selections, not a fixed demo:
- Strap color = the real selected collar's color.
- Any selected **letter** charms are placed on the 3D arc, in slot order, using their real charm color.
- Selected **icon** charms are not shown in 3D (no mesh exists) — a caption notes this so it isn't confusing.
- Hardware color is fixed to Silver — the real store has no hardware color option.

## Architecture

### 1. Dependencies & assets

- Add to root `package.json`: `three`, `@react-three/fiber`, `@react-three/drei` — pinned to the same versions used in `collar-customiser/app/package.json` (`three@^0.185.1`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`).
- Copy into this app's `public/`:
  - `collar-customiser/public/models/collar.glb`
  - `collar-customiser/public/models/charms.glb`
  - `collar-customiser/app/public/draco/` (decoder files, referenced via drei's `useGLTF(url, dracoPath)`)
- New file `src/lib/collar3d.ts` — ported from `collar-customiser/app/src/lib/collar.ts`: `layoutName()`, `fitsOnCollar()`, `CHARM_WIDTHS`, `TEXT_RADIUS`, `BACK_RADIUS`, `GAP`, `CENTRE_DEG`, `FREE_ARC_DEG`, `MATERIAL_DEFAULTS`. Kept separate from `src/lib/data.ts`'s unrelated `COLLARS` constant to avoid name confusion.

### 2. Components

- **`src/components/products/Collar3DScene.tsx`** (new, `'use client'`)
  Ports `collar-customiser/app/src/components/Collar.tsx` (the `<Collar>` mesh: strap/hardware/charm meshes via `useGLTF`) plus the `<Canvas>` / `<OrbitControls>` / `<Environment preset="studio">` wrapper from `collar-customiser/app/src/app/page.tsx`. Props: `strapColour`, `hardwareColour`, `name` (derived letter string), `charmColours`.

- **`src/components/products/Collar3DModal.tsx`** (new, `'use client'`)
  Bottom-sheet modal matching the existing Personalise dialog's visual style (`bg-cream`, rounded top corners, fixed overlay, `×` close button, same z-index tier). Loads `Collar3DScene` via `next/dynamic(() => import('./Collar3DScene'), { ssr: false, loading: () => <Spinner /> })` so `three`/`fiber`/`drei` are only fetched when a customer actually opens the modal — never touches the initial page bundle. Shows a "Drag to rotate" hint (same copy style as the prototype) and, when the customer has icon charms selected, a small caption: only letter charms appear in the 3D preview.

- **Wiring in `SingleProductPage.tsx` / `CollarPDP`**
  - New state: `const [preview3DOpen, setPreview3DOpen] = useState(false)`.
  - New button "Peržiūrėti 3D" (cube icon, lucide-react `Box`) placed next to the existing "Papuoškite savo antkaklį" personalise button inside `CollarPDP`, gated on `showCharms` (i.e. `isCollar && !isCharmProduct`) since the 3D model is a collar mesh only — not shown for leash products.
  - `Collar3DModal` rendered at the same level as the existing Personalise dialog (bottom of the component), controlled by `preview3DOpen`.

### 3. Data mapping

Inside `Collar3DModal` (computed from props passed down from `SingleProductPage`):

```
strapColour   = collar?.color ?? DEFAULT_STRAP_COLOUR   // collar.color is already a resolved hex
hardwareColour = '#EFF0F2'                                // fixed Silver — no real hardware option
letterCharms  = selectedCharms.filter(c => c?.category === 'letter')
name          = letterCharms.map(c => c.baseTitle.replace(/^(Letter|Raidė)\s+/i, '')).join('')
charmColours  = letterCharms.map(c => c.bg)               // charm.bg is already a resolved hex
```

`name` and `charmColours` are passed straight into the ported `layoutName()` / `<Collar>` mesh exactly as the prototype does. Since the real store caps selection at 5 charms, `fitsOnCollar` will always pass — no "name too long" UI is needed.

## Error handling / edge cases

- No letter charms selected → strap + hardware render with an empty charm arc (valid state, same as prototype with an empty name).
- GLB fetch failure / slow network → `next/dynamic`'s `loading` fallback covers the dynamic import; `Suspense` inside the scene (already used by `useGLTF` in the prototype) covers the asset fetch itself.
- Non-collar products (leashes, standalone charms) → button not rendered at all.

## Out of scope

- Icon/shape charms are not represented in 3D (no mesh data exists for them).
- No new hardware-color selector is added to the real PDP.
- No changes to the standalone `collar-customiser/app` prototype itself — it remains an untouched reference/demo app.
