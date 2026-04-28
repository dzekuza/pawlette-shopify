'use client'

import { useState } from 'react'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import type { ShopifyCollar, ShopifyCharm } from '@/lib/shopify'
import { Accordion } from '@/components/shared/Accordion'
import { CharmsStep } from './config-panel/CharmsStep'
import { ColourStep } from './config-panel/ColourStep'
import { SizeStep } from './config-panel/SizeStep'
import { CollarStage } from '@/components/CollarStage'

const DEFAULT_ACCORDION = {
  description: 'Vandeniui atsparus silikoninis antkaklis su prisegamais pakabukais. Lengvas, reguliuojamas, su saugiu atsegamu užsegimu. Atsparus purvui ir kvapams, tad tereikia nuplauti.',
  features: 'Vandeniui atsparus silikonas, lengvas reguliuojamas prigludimas, saugus atsegamas užsegimas, atsparumas purvui ir kvapams.',
  set_includes: 'Pagrindinis pasirinktos spalvos ir dydžio antkaklis. Penki keičiami prisegami pakabukai. Reguliuojamas saugus užsegimas. Lininis laikymo maišelis.',
  care: 'Po kiekvieno maudymosi ar purvino pasivaikščiojimo nuplaukite. Džiovinkite paguldę, nedėkite į džiovyklę. Pakabukus valykite drėgna šluoste ir leiskite išdžiūti.',
  shipping: 'Nemokamas pristatymas užsakymams nuo €40. Pristatymas per 2–4 darbo dienas. Grąžinimai priimami per 30 dienų, jei prekė nenaudota ir originalios būklės.',
}

interface ConfigPanelProps {
  collar: ShopifyCollar | null
  collars: ShopifyCollar[]
  charms: ShopifyCharm[]
  setCollar: (collar: ShopifyCollar) => void
  selectedCharms: (string | null)[]
  toggleCharm: (id: string) => void
  moveCharm?: (from: number, to: number) => void
  onClearSlot?: (i: number) => void
  size: string
  setSize: (size: string) => void
  onAddToCart: () => void
  isDark: boolean
}

export function ConfigPanel({
  collar,
  collars,
  charms,
  setCollar,
  selectedCharms,
  toggleCharm,
  moveCharm,
  onClearSlot,
  size,
  setSize,
  onAddToCart,
  isDark,
}: ConfigPanelProps) {
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const [showCharmsModal, setShowCharmsModal] = useState(false)

  const textPrimary = isDark ? '#FAF7F2' : '#3D3530'
  const textSecondary = isDark ? 'rgba(250,247,242,0.55)' : '#6B6460'
  const textMuted = isDark ? 'rgba(250,247,242,0.35)' : '#9B948F'
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#E8E3DC'
  const divider = isDark ? 'rgba(255,255,255,0.08)' : '#EDEAE4'
  const panelBg = isDark ? 'rgba(30,22,18,0.85)' : 'transparent'

  const noop = () => {}

  const accordionItems = [
    { id: 'description', title: 'Aprašymas', content: collar?.description ?? DEFAULT_ACCORDION.description },
    { id: 'features',    title: 'Produkto savybės', content: collar?.features ?? DEFAULT_ACCORDION.features },
    { id: 'includes',    title: 'Į rinkinį įeina', content: collar?.set_includes ?? DEFAULT_ACCORDION.set_includes },
    { id: 'care',        title: 'Priežiūra', content: collar?.care ?? DEFAULT_ACCORDION.care },
    { id: 'shipping',    title: 'Pristatymas ir grąžinimas', content: collar?.shipping ?? DEFAULT_ACCORDION.shipping },
  ]

  const collarPrice = collar ? parseFloat(collar.price.replace(/[^0-9.]/g, '')) : 28
  const charmsTotalPrice = selectedCharms
    .filter(Boolean)
    .reduce((sum, id) => {
      const charm = charms.find(c => c.id === id)
      return sum + (charm ? parseFloat(charm.price.replace(/[^0-9.]/g, '')) : 0)
    }, 0)
  const totalPrice = collarPrice + charmsTotalPrice
  const selectedCount = selectedCharms.filter(Boolean).length

  return (
    <div className="flex flex-col font-sans">

      {/* ── Colour ── */}
      <ColourStep
        collar={collar}
        collars={collars}
        next={noop}
        panelBg={panelBg}
        setCollar={setCollar}
        textMuted={textMuted}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
      />

      <div className="h-px my-7" style={{ background: divider }} />

      {/* ── Charms button ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: textMuted }}>Pakabukai</span>
          {selectedCount > 0 && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: textSecondary }}>{selectedCount} pasirinkta</span>
          )}
        </div>
        <button
          onClick={() => setShowCharmsModal(true)}
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 12,
            border: `1.5px solid ${borderColor}`, background: 'transparent',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
            fontSize: 14, color: textPrimary, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', transition: 'border-color 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#A8D5A2' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor }}
        >
          <span>{selectedCount > 0 ? `${selectedCount} pakab. pridėta` : 'Pridėti pakabukų'}</span>
          <span style={{ fontSize: 20, lineHeight: 1, color: textMuted }}>+</span>
        </button>
      </div>

      <div className="h-px my-7" style={{ background: divider }} />

      {/* ── Size ── */}
      <SizeStep
        borderColor={borderColor}
        isDark={isDark}
        next={noop}
        setSize={setSize}
        size={size}
        sizes={collar?.sizes}
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
          Į krepšelį — €{totalPrice}
        </button>
        <p
          className="text-center mt-2.5 mb-0 font-sans"
          style={{
            fontSize: 11,
            color: textMuted,
            letterSpacing: '0.02em',
          }}
        >
          Nemokamas pristatymas nuo €50 · Pagaminta Lietuvoje
        </p>
      </div>

      {/* Product info accordion */}
      <div className="mt-8">
        <Accordion items={accordionItems} isMobile={isMobile} />
      </div>

      {/* ── Charms modal ── */}
      {showCharmsModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setShowCharmsModal(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
          />
          {/* Panel */}
          <div style={{
            position: 'relative', background: '#FAF7F2',
            borderRadius: isMobile ? '24px 24px 0 0' : 24,
            maxHeight: isMobile ? '90vh' : '80vh',
            width: isMobile ? '100%' : 560,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: isMobile ? 'none' : '0 24px 60px rgba(0,0,0,0.18)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 0', flexShrink: 0 }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 17, color: '#3D3530' }}>Pridėti pakabukų</span>
              <button
                onClick={() => setShowCharmsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#9B948F', lineHeight: 1, padding: '0 4px' }}
                aria-label="Uždaryti"
              >
                ×
              </button>
            </div>
            {/* CollarStage preview — height sized to charm strip natural height to avoid centering whitespace */}
            <div style={{ height: isMobile ? 116 : 136, flexShrink: 0, padding: '12px 20px 0' }}>
              <CollarStage
                collar={collar}
                charms={charms}
                selectedCharms={selectedCharms}
                isDark={false}
                moveCharm={moveCharm ?? noop}
                onClearSlot={onClearSlot ?? noop}
                showGallery={false}
              />
            </div>
            {/* Charm picker scrollable area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 16px' }}>
              <CharmsStep
                borderColor='#E8E3DC'
                charms={charms}
                isDark={false}
                selectedCharms={selectedCharms}
                textMuted='#9B948F'
                textPrimary='#3D3530'
                textSecondary='#6B6460'
                toggleCharm={toggleCharm}
              />
            </div>
            {/* Done */}
            <div style={{ padding: '12px 20px 28px', flexShrink: 0, borderTop: '1px solid #EDEAE4' }}>
              <button
                onClick={() => setShowCharmsModal(false)}
                style={{ width: '100%', padding: '14px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 15, background: '#A8D5A2', color: '#2a5a25', letterSpacing: '0.01em' }}
              >
                Baigta{selectedCount > 0 ? ` — ${selectedCount} pakab.` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
