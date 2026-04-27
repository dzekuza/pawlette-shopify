import { supabase } from './supabase'
import { PRODUCTS } from './data'

export interface LandingCollar {
  id: string | number
  name: string
  price: string
  collarColor: string
  bg: string
  image: string
  badge?: string
  badgeColor?: string
  badgeBg?: string
  desc: string
  charms: readonly { bg: string; e: string }[]
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// Static display metadata (desc, badge, charm dots, fallback image) keyed by product name
const META: Record<string, { desc: string; charms: readonly { bg: string; e: string }[]; image: string; badge?: string; badgeColor?: string; badgeBg?: string }> = {}
for (const p of PRODUCTS) {
  META[p.name] = {
    desc: p.desc,
    charms: p.charms,
    image: p.image,
    badge: p.badge,
    badgeColor: p.badgeColor,
    badgeBg: p.badgeBg,
  }
}

const DEFAULT_CHARMS = [
  { bg: '#A8D5A2', e: '🌿' },
  { bg: '#B8D8F4', e: '⭐' },
  { bg: '#F9E4A0', e: '☀️' },
  { bg: '#D4B8F4', e: '🌸' },
]

export async function getLandingCollars(): Promise<LandingCollar[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, color, stock, images')
    .eq('type', 'collar')
    .order('name')

  if (error || !data || data.length === 0) return []

  return data.map((p) => {
    const meta = META[p.name]
    const lowStock = p.stock === 'low_stock'
    return {
      id: p.id,
      name: p.name,
      price: `€${p.price}`,
      collarColor: p.color,
      bg: hexToRgba(p.color, 0.15),
      image: (p.images as string[])?.[0] ?? meta?.image ?? '',
      badge: lowStock ? 'Almost gone' : (meta?.badge ?? undefined),
      badgeColor: lowStock ? '#8a4010' : (meta?.badgeColor ?? undefined),
      badgeBg: lowStock ? '#fff0e0' : (meta?.badgeBg ?? undefined),
      desc: meta?.desc ?? 'Waterproof silicone collar with snap-on charms.',
      charms: meta?.charms ?? DEFAULT_CHARMS,
    }
  })
}

// Convert static PRODUCTS to LandingCollar for fallback
export function staticLandingCollars(): LandingCollar[] {
  return PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    collarColor: p.collarColor,
    bg: p.bg,
    image: p.image,
    badge: p.badge,
    badgeColor: p.badgeColor,
    badgeBg: p.badgeBg,
    desc: p.desc,
    charms: p.charms,
  }))
}
