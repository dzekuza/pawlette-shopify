'use client'

import { createContext, use, type ReactNode } from 'react'
import type { DragEndEvent, SensorDescriptor, SensorOptions } from '@dnd-kit/core'
import type { ShopifyCharm } from '@/lib/shopify'

interface CharmDecoratorState {
  /** MAX_CHARMS-slot selection (null = empty slot). */
  selectedCharms: (ShopifyCharm | null)[]
  selectedCharmCount: number
  /** Letters currently engraved, derived from selectedCharms. */
  charmName: string
  /** Every charm the picker may offer. */
  allCharms: ShopifyCharm[]
  mounted: boolean
}

interface CharmDecoratorActions {
  setCharmName: (name: string) => void
  recolourAt: (index: number, colourKey: string) => void
  toggleCharm: (charm: ShopifyCharm) => void
  reorder: (event: DragEndEvent) => void
  requestMoreCharms: () => void
}

interface CharmDecoratorMeta {
  dndSensors: SensorDescriptor<SensorOptions>[]
}

export interface CharmDecoratorContextValue {
  state: CharmDecoratorState
  actions: CharmDecoratorActions
  meta: CharmDecoratorMeta
}

const CharmDecoratorContext = createContext<CharmDecoratorContextValue | null>(null)

/** Reads the charm selection the decorator panel operates on. Must be used inside `<CharmDecoratorProvider>`. */
export function useCharmDecorator(): CharmDecoratorContextValue {
  const ctx = use(CharmDecoratorContext)
  if (!ctx) throw new Error('useCharmDecorator must be used within <CharmDecoratorProvider>')
  return ctx
}

/**
 * Injects the charm selection state into <CharmDecoratorPanel />. The collar flow and the charm-product
 * flow each own different state (size-group filtering, different colour model) and adapt it to this
 * interface — the panel itself never knows which one it is rendering.
 */
export function CharmDecoratorProvider({ value, children }: { value: CharmDecoratorContextValue; children: ReactNode }) {
  return <CharmDecoratorContext value={value}>{children}</CharmDecoratorContext>
}
