/**
 * BioThane-style coated-webbing look (per paracord.eu/blog/what-is-biothane-coated-webbing):
 * a strong polyester webbing coated in a thin TPU/PVC layer. The webbing itself never
 * shows on a moulded charm or strap, but that coating is exactly what the "Gold" (glossy)
 * BioThane finish looks like — a smooth plastic-y base with a distinct thin clearcoat sheen
 * on top, as opposed to a flat single-layer paint. clearcoat + clearcoatRoughness model that
 * second layer; base roughness stays low-ish so the coating still looks glossy, not matte
 * ("Beta" finish).
 *
 * Shared by CharmPatternScene (background charm field) and Hero3DFloat (hero collar + charms).
 */
export const BIOTHANE_MATERIAL_PROPS = {
  roughness: 0.32,
  metalness: 0,
  clearcoat: 0.85,
  clearcoatRoughness: 0.18,
} as const;
