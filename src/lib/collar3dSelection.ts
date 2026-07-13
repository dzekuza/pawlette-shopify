import type { ShopifyCharm } from '@/lib/shopify'

/** "Letter A" / "Raidė A" -> "A" */
export const extractLetter = (baseTitle: string) => baseTitle.replace(/^(Letter|Raidė)\s+/i, '').toUpperCase()

/**
 * Derive the 3D collar's name + per-letter colours from the customer's actual
 * charm selection. Only letter-category charms have a 3D mesh — icon charms
 * are filtered out here and simply don't appear on the model.
 */
export function collar3DLetters(selectedCharms?: (ShopifyCharm | null)[]) {
  const letterCharms = (selectedCharms ?? []).filter((c): c is ShopifyCharm => !!c && c.category === 'letter')
  const iconCharms = (selectedCharms ?? []).filter((c): c is ShopifyCharm => !!c && c.category !== 'letter')
  const name = letterCharms.map((c) => extractLetter(c.baseTitle)).join('')
  const charmColours = letterCharms.map((c) => c.bg)
  return { letterCharms, iconCharms, name, charmColours }
}
