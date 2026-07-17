import type { ShopifyCharm } from '@/lib/shopify'
import type { CharmSpec } from '@/lib/collar3d'

/** "Letter A" / "Raidė A" -> "A" */
export const extractLetter = (baseTitle: string) => baseTitle.replace(/^(Letter|Raidė)\s+/i, '').toUpperCase()

/**
 * Derive the 3D collar's spelled name + per-letter colours from the customer's
 * charm selection, for the letters-only editing UI (colour swatches, inline
 * text entry) in Collar3DModal/SingleProductPage. Icon charms are split out
 * here but not resolved to a 3D shape — use collar3DCharms for the actual 3D
 * scene, which renders both letters and icons together.
 */
export function collar3DLetters(selectedCharms?: (ShopifyCharm | null)[]) {
  const letterCharms = (selectedCharms ?? []).filter((c): c is ShopifyCharm => !!c && c.category === 'letter')
  const iconCharms = (selectedCharms ?? []).filter((c): c is ShopifyCharm => !!c && c.category !== 'letter')
  const name = letterCharms.map((c) => extractLetter(c.baseTitle)).join('')
  const charmColours = letterCharms.map((c) => c.bg)
  return { letterCharms, iconCharms, name, charmColours }
}

/**
 * Build the full ordered sequence of 3D-renderable charms — letters AND icon
 * charms that have a matching Blender-authored shape mesh (heart/star/flower/
 * paw) — preserving the customer's actual pick order, so icons interleave
 * with letters in the 3D arc exactly as arranged in the cart. Icon charms
 * without a shape mesh yet (leaf, bow, sun, drop, butterfly, mushroom) are
 * dropped, same as they always have been.
 */
export function collar3DCharms(selectedCharms?: (ShopifyCharm | null)[]): CharmSpec[] {
  return (selectedCharms ?? [])
    .filter((c): c is ShopifyCharm => !!c)
    .map((c): CharmSpec | null => {
      if (c.category === 'letter') return { meshKey: extractLetter(c.baseTitle), colour: c.bg, kind: 'letter' }
      if (c.shape) return { meshKey: c.shape, colour: c.bg, kind: 'icon' }
      return null
    })
    .filter((c): c is CharmSpec => c !== null)
}

/** True if the selection has an icon charm with no 3D shape mesh yet — drives the "not shown in 3D" disclaimer. */
export function hasUnrenderableIconCharms(selectedCharms?: (ShopifyCharm | null)[]): boolean {
  return (selectedCharms ?? []).some((c) => !!c && c.category !== 'letter' && !c.shape)
}
