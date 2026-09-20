'use client'

import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import type { CollarConfiguratorState } from '@/lib/useCollarConfigurator'
import { COLOR_SWATCHES } from '@/components/products/configurator/configuratorConstants'

interface ColorOption {
  color: string
  image: string
  fallback: string
}

interface CollarConfiguratorContextState {
  /** Return value of useCollarConfigurator() — the single source of truth for selection, charms and cart state. */
  configurator: CollarConfiguratorState
  /** True for the moment after add-to-cart is pressed (drives the button label). */
  added: boolean
  fitGuideOpen: boolean
}

interface CollarConfiguratorActions {
  addToCart: () => Promise<void>
  openFitGuide: () => void
  closeFitGuide: () => void
}

interface CollarConfiguratorMeta {
  /** Display name — the caller computes its own fallback (e.g. collar?.parentTitle ?? product.name). */
  name: string
  /** Display price — the caller computes its own fallback (e.g. collar?.price ?? product.price). */
  price: string
  colorOptions: ColorOption[]
  hasColors: boolean
  hasSizes: boolean
}

interface CollarConfiguratorContextValue {
  state: CollarConfiguratorContextState
  actions: CollarConfiguratorActions
  meta: CollarConfiguratorMeta
}

const CollarConfiguratorContext = createContext<CollarConfiguratorContextValue | null>(null)

/** Reads the collar configurator state, actions and meta. Must be used inside `<CollarConfigurator.Root>`. */
export function useCollarConfiguratorContext(): CollarConfiguratorContextValue {
  const ctx = use(CollarConfiguratorContext)
  if (!ctx) throw new Error('useCollarConfiguratorContext must be used within <CollarConfigurator.Root>')
  return ctx
}

interface ProviderProps {
  configurator: CollarConfiguratorState
  name: string
  price: string
  children: ReactNode
}

/** The only place that knows how the configurator's UI-level state (added flash, fit guide) is managed. */
export function CollarConfiguratorProvider({ configurator, name, price, children }: ProviderProps) {
  const { allCollars, collar, addCollarToCart } = configurator
  const [added, setAdded] = useState(false)
  const [fitGuideOpen, setFitGuideOpen] = useState(false)

  const sourceCollars = allCollars.length > 0 ? allCollars : (collar ? [collar] : [])
  const hasColors = sourceCollars.length > 0
  const hasSizes = (collar?.sizes?.length ?? 0) > 0
  const colorOptions = useMemo(() => {
    return sourceCollars.map((c) => {
      const colorName = c.colors[0] ?? ''
      const representativeVariant = c.variants.find((v) => v.image) ?? c.variants[0]
      return {
        color: colorName,
        image: representativeVariant?.image || c.image,
        fallback: COLOR_SWATCHES[colorName] ?? '#E8E3DC',
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCollars, collar])

  const addToCart = async () => {
    setAdded(true)
    await addCollarToCart()
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <CollarConfiguratorContext
      value={{
        state: { configurator, added, fitGuideOpen },
        actions: { addToCart, openFitGuide: () => setFitGuideOpen(true), closeFitGuide: () => setFitGuideOpen(false) },
        meta: { name, price, colorOptions, hasColors, hasSizes },
      }}
    >
      {children}
    </CollarConfiguratorContext>
  )
}
