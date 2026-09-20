'use client'

import type { ReactNode } from 'react'
import type { CollarConfiguratorState } from '@/lib/useCollarConfigurator'
import { Collar3DModal } from '@/components/products/Collar3DModal'
import { CollarConfiguratorProvider, useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import { AddToCart, Charms, Colors, Header, Sizes, Videos } from '@/components/products/configurator/ConfiguratorSections'
import { GuidedSteps, Step, Stepper } from '@/components/products/configurator/ConfiguratorStepper'
import { InfoAccordion, ReviewCarousel, Trust, TrustStrip } from '@/components/products/configurator/ConfiguratorTrust'
import { ExtraCharmsModal } from '@/components/products/configurator/ExtraCharmsModal'
import { FitGuideModal } from '@/components/products/configurator/FitGuideModal'
import { PersonaliseModal } from '@/components/products/configurator/PersonaliseModal'

interface RootProps {
  /** Return value of useCollarConfigurator() — the single source of truth for all state/handlers. */
  configurator: CollarConfiguratorState
  /** Display name — caller computes its own fallback (e.g. collar?.parentTitle ?? product.name). */
  name: string
  /** Display price — caller computes its own fallback (e.g. collar?.price ?? product.price). */
  price: string
  children: ReactNode
}

function Preview3DModal() {
  const { state: { configurator: c } } = useCollarConfiguratorContext()
  return (
    <Collar3DModal
      open={c.preview3DOpen}
      onClose={() => c.setPreview3DOpen(false)}
      collar={c.collar}
      allCollars={c.allCollars}
      selectedColor={c.selectedColor}
      onColorChange={c.onColorChange}
      charms={c.sizeMatchedCharms}
      selectedCharms={c.selectedCollarCharms}
      onCharmsChange={c.setSelectedCollarCharms}
      charmColorKey={c.collarCharmColor}
      onCharmColorChange={c.setCollarCharmColor}
    />
  )
}

/**
 * Provides the shared configurator state, lays its children out in a column, and mounts the
 * Personalise, Extra-charms and 3D-preview modals. Callers compose only the parts they need:
 *
 *   <CollarConfigurator.Root configurator={c} name={name} price={price}>
 *     <CollarConfigurator.Header />
 *     <CollarConfigurator.Colors />
 *     <CollarConfigurator.Sizes />
 *     <CollarConfigurator.Charms />
 *     <CollarConfigurator.AddToCart />
 *   </CollarConfigurator.Root>
 *
 * Use `GuidedSteps` instead of Colors/Sizes/Charms for the one-at-a-time flow, and `Trust` for the
 * trust pills, reviews and info accordion below the CTA. Rendered by CollarBuyPanel (product detail
 * page) and LandingBuySection (homepage buy card).
 */
function Root({ configurator, name, price, children }: RootProps) {
  return (
    <CollarConfiguratorProvider configurator={configurator} name={name} price={price}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
        <FitGuideModal />
      </div>
      <PersonaliseModal />
      <ExtraCharmsModal configurator={configurator} />
      <Preview3DModal />
    </CollarConfiguratorProvider>
  )
}

export const CollarConfigurator = {
  Root,
  Header,
  Videos,
  Colors,
  Sizes,
  Charms,
  AddToCart,
  Trust,
  TrustStrip,
  ReviewCarousel,
  InfoAccordion,
  GuidedSteps,
  Stepper,
  Step,
}
