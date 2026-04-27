'use client'

import { useWindowWidth } from '@/hooks/useWindowWidth'
import { type Collar } from '@/lib/data'
import { Accordion } from '@/components/shared/Accordion'
import { CharmsStep } from './config-panel/CharmsStep'
import { ColourStep } from './config-panel/ColourStep'
import { SizeStep } from './config-panel/SizeStep'

const PRODUCT_ACCORDION = [
  { id: 'description', title: 'Description', content: 'Ready for any adventure, our Waterproof Dog Collar & Leash Set combines durability, comfort, and convenience. The lightweight, adjustable collar is dirt- and odor-resistant, easy to clean, and features a safe-release buckle. Personalize it with our silicone dog charms for a custom touch.' },
  { id: 'features',    title: 'Product Features',   content: 'Waterproof collar and leash materials, lightweight adjustable fit, safe-release buckle, dirt and odor resistance, easy-clip leash adjustment, padded handle, and built-in waste bag holder.' },
  { id: 'includes',   title: 'Set Includes',        content: '1 waterproof adjustable collar, 1 waterproof 5ft leash, and compatibility with silicone snap-on charms for personalization.' },
  { id: 'care',       title: 'Care',                content: 'Rinse with water after muddy or beach walks and wipe dry with a soft cloth. Air dry flat. Avoid direct high heat to preserve shape and finish.' },
  { id: 'shipping',   title: 'Shipping & Returns',  content: 'Fast shipping across Lithuania and EU. Free shipping on qualifying orders and easy returns within the return window if unused and in original condition.' },
]

interface ConfigPanelProps {
  collar: Collar
  setCollar: (collar: Collar) => void
  selectedCharms: (string | null)[]
  toggleCharm: (id: string) => void
  size: string
  setSize: (size: string) => void
  onAddToCart: () => void
  isDark: boolean
}

export function ConfigPanel({
  collar,
  setCollar,
  selectedCharms,
  toggleCharm,
  size,
  setSize,
  onAddToCart,
  isDark,
}: ConfigPanelProps) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768

  const textPrimary = isDark ? '#FAF7F2' : '#3D3530'
  const textSecondary = isDark ? 'rgba(250,247,242,0.55)' : '#6B6460'
  const textMuted = isDark ? 'rgba(250,247,242,0.35)' : '#9B948F'
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#E8E3DC'
  const divider = isDark ? 'rgba(255,255,255,0.08)' : '#EDEAE4'
  const panelBg = isDark ? 'rgba(30,22,18,0.85)' : 'transparent'

  const noop = () => {}

  return (
    <div className="flex flex-col font-sans">

      {/* ── Colour ── */}
      <ColourStep
        collar={collar}
        next={noop}
        panelBg={panelBg}
        setCollar={setCollar}
        textMuted={textMuted}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
      />

      <div className="h-px my-7" style={{ background: divider }} />

      {/* ── Charms ── */}
      <CharmsStep
        borderColor={borderColor}
        isDark={isDark}
        selectedCharms={selectedCharms}
        textMuted={textMuted}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        toggleCharm={toggleCharm}
      />

      <div className="h-px my-7" style={{ background: divider }} />

      {/* ── Size ── */}
      <SizeStep
        borderColor={borderColor}
        isDark={isDark}
        next={noop}
        setSize={setSize}
        size={size}
        textMuted={textMuted}
        textPrimary={textPrimary}
      />

      {/* ── CTA ── */}
      <div className="mt-9">
        <button
          onClick={onAddToCart}
          className="w-full rounded-full border-none cursor-pointer font-sans font-semibold"
          style={{
            padding: isMobile ? '14px' : '16px',
            background: '#A8D5A2',
            color: '#2a5a25',
            fontSize: 16,
            letterSpacing: '0.01em',
            transition: 'background-color 150ms ease-out, transform 80ms ease-out',
            boxShadow: '0 4px 20px rgba(168,213,162,0.45)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#8fc489'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#A8D5A2'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        >
          Add to cart — €28
        </button>
        <p
          className="text-center mt-2.5 mb-0 font-sans"
          style={{
            fontSize: 11,
            color: textMuted,
            letterSpacing: '0.02em',
          }}
        >
          Free shipping over €50 · Made in Lithuania
        </p>
      </div>

      {/* Product info accordion */}
      <div className="mt-8">
        <Accordion items={PRODUCT_ACCORDION} isMobile={isMobile} />
      </div>

    </div>
  )
}
