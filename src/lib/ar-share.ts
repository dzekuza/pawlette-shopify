import type { CharmSpec } from '@/lib/collar3d'
import { MAX_CHARMS } from '@/components/products/pdpConstants'

const HEX = /^#?[0-9a-fA-F]{6}$/
const MESH_KEY = /^[A-Za-z0-9]{1,16}$/

export type ArShare = { strapColour: string; items: CharmSpec[] }

const stripHash = (hex: string) => hex.replace(/^#/, '').toUpperCase()

/** Query string describing a collar build, e.g. `c=B8D8F4&i=D-F4B5C0,A-F4B5C0`. Read back by `parseArShare`. */
export function encodeArShare({ strapColour, items }: ArShare): string {
  const params = new URLSearchParams({ c: stripHash(strapColour) })
  if (items.length) params.set('i', items.map((it) => `${it.meshKey}-${stripHash(it.colour)}`).join(','))
  return params.toString()
}

/** Validates untrusted query params; returns null unless the strap colour is a hex and every charm parses. */
export function parseArShare(params: { c?: string | string[]; i?: string | string[] }): ArShare | null {
  const c = Array.isArray(params.c) ? params.c[0] : params.c
  const i = Array.isArray(params.i) ? params.i[0] : params.i
  if (!c || !HEX.test(c)) return null
  const items: CharmSpec[] = []
  for (const part of i ? i.split(',') : []) {
    const [meshKey, colour] = part.split('-')
    if (!meshKey || !colour || !MESH_KEY.test(meshKey) || !HEX.test(colour)) return null
    items.push({ meshKey, colour: `#${stripHash(colour)}`, kind: meshKey.length === 1 ? 'letter' : 'icon' })
  }
  if (items.length > MAX_CHARMS) return null
  return { strapColour: `#${stripHash(c)}`, items }
}
