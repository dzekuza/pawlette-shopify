'use client'

import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Accordion } from '@/components/shared/Accordion'

interface ProductInfoTabsProps {
  isDark: boolean
}

const ACCORDION_ITEMS = [
  {
    id: 'description',
    title: 'Description',
    content: 'Ready for any adventure, our Waterproof Dog Collar & Leash Set combines durability, comfort, and convenience. The lightweight, adjustable collar is dirt- and odor-resistant, easy to clean, and features a safe-release buckle. Personalize it with our silicone dog charms for a custom touch.',
  },
  {
    id: 'features',
    title: 'Product Features',
    content: 'Waterproof collar and leash materials, lightweight adjustable fit, safe-release buckle, dirt and odor resistance, easy-clip leash adjustment, padded handle, and built-in waste bag holder.',
  },
  {
    id: 'includes',
    title: 'Set Includes',
    content: '1 waterproof adjustable collar, 1 waterproof 5ft leash, and compatibility with silicone snap-on charms for personalization.',
  },
  {
    id: 'care',
    title: 'Care',
    content: 'Rinse with water after muddy or beach walks and wipe dry with a soft cloth. Air dry flat. Avoid direct high heat to preserve shape and finish.',
  },
  {
    id: 'shipping',
    title: 'Shipping & Returns',
    content: 'Fast shipping across Lithuania and EU. Free shipping on qualifying orders and easy returns within the return window if unused and in original condition.',
  },
]

export function ProductInfoTabs({ isDark }: ProductInfoTabsProps) {
  const windowWidth = useWindowWidth() ?? 1200
  const isMobile = windowWidth < 768
  const sectionBg = isDark ? '#241A16' : '#FFFFFF'

  return (
    <section style={{ background: sectionBg, padding: isMobile ? '28px 16px' : '28px 40px 36px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Accordion items={ACCORDION_ITEMS} isMobile={isMobile} />
      </div>
    </section>
  )
}
