'use client'

import { useGLTF } from '@react-three/drei'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Mesh } from 'three'
import { Collar3DCharm } from '@/components/products/Collar3DCharm'
import { Collar3DProng } from '@/components/products/Collar3DProng'
import { CharmSlot, purgeSlot, reconcileSlots } from '@/lib/charmSlots'
import { DEFAULT_CHARM_COLOUR, layoutCharms, MATERIAL_DEFAULTS, type CharmSpec } from '@/lib/collar3d'
import { createLock } from '@/lib/lockState'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const COLLAR_URL = '/models/collar.glb'
const CHARMS_URL = '/models/charms.glb'
const DRACO = '/draco/'

/** Gap between consecutive arrivals, in seconds. One letter at a time reads as deliberate; a pasted name cascades. */
const STAGGER = 0.07

/**
 * Parts of collar.glb that use the metal `Hardware` material and never move.
 * Buckle_Prong is the exception — it swings, so it is rendered by <Collar3DProng/>.
 */
const HARDWARE_PARTS = [
  'Buckle_Frame',
  'Buckle_Bar',
  'D_Ring',
  'Rivet_1',
  'Rivet_2',
  'Rivet_3',
]

/** Parts that share the leather `Strap` material. */
const STRAP_PARTS = ['Collar_Strap', 'Keeper_Loop', 'D_Ring_Wrap']

export type Collar3DMeshProps = {
  /** Full ordered sequence of letters and icon charms, in the customer's actual pick order. */
  items: CharmSpec[]
  strapColour: string
  hardwareColour: string
  /** Index refers to the Nth LETTER only (icon charms aren't individually selectable/recolourable today). */
  onSelectCharm?: (index: number) => void
  selectedCharm?: number | null
}

export function Collar3DMesh({ items, strapColour, hardwareColour, onSelectCharm, selectedCharm }: Collar3DMeshProps) {
  const collar = useGLTF(COLLAR_URL, DRACO)
  const charms = useGLTF(CHARMS_URL, DRACO)
  const reducedMotion = useReducedMotion()

  const placed = useMemo(() => layoutCharms(items), [items])
  const chars = useMemo(() => placed.map((c) => c.char), [placed])

  // selectedCharm/onSelectCharm address "the Nth letter", not a position in the
  // combined arc -- this maps a placed-array position back to that letter ordinal
  // (null for icon charms, which have no colour-editing UI to select into).
  const letterOrdinalOf = useCallback(
    (idx: number) => {
      if (placed[idx]?.kind !== 'letter') return null
      let ordinal = 0
      for (let i = 0; i < idx; i++) if (placed[i].kind === 'letter') ordinal++
      return ordinal
    },
    [placed],
  )

  // Slots are derived from the name during render, not in an effect: an effect
  // would leave one frame where the slots still describe the previous name.
  const [slots, setSlots] = useState<CharmSlot[]>(() => reconcileSlots([], chars, STAGGER))
  const [rendered, setRendered] = useState(chars.join('|'))
  if (rendered !== chars.join('|')) {
    setRendered(chars.join('|'))
    setSlots((prev) => reconcileSlots(prev, chars, STAGGER))
  }

  const drop = useCallback((id: number) => {
    setSlots((prev) => purgeSlot(prev, id))
  }, [])

  // Shared between the buckle and the letters: the letters ask it whether the
  // collar is open yet, the buckle asks it whether anyone still needs it open.
  const lock = useRef(createLock())

  const geo = (gltf: typeof collar, node: string) => (gltf.nodes[node] as Mesh).geometry

  return (
    <group>
      {STRAP_PARTS.map((part) => (
        <mesh key={part} geometry={geo(collar, part)} castShadow receiveShadow>
          <meshStandardMaterial color={strapColour} {...MATERIAL_DEFAULTS.strap} />
        </mesh>
      ))}

      {HARDWARE_PARTS.map((part) => (
        <mesh key={part} geometry={geo(collar, part)} castShadow receiveShadow>
          <meshStandardMaterial color={hardwareColour} {...MATERIAL_DEFAULTS.hardware} />
        </mesh>
      ))}

      <Collar3DProng
        geometry={geo(collar, 'Buckle_Prong')}
        colour={hardwareColour}
        lock={lock}
        reducedMotion={reducedMotion}
      />

      {slots.map((slot) => {
        // A deleted charm still has a slot (it is animating away) but no layout
        // entry: `mounted` goes false and the charm holds its own last position
        // and colour, so the values passed here stop mattering.
        const index = slot.index
        const live = index !== null ? placed[index] : undefined
        const letterOrdinal = index !== null ? letterOrdinalOf(index) : null

        return (
          <Collar3DCharm
            key={slot.id}
            id={slot.id}
            lock={lock}
            geometry={geo(charms, `Charm_${slot.char}`)}
            angle={live?.angle ?? 0}
            colour={live?.colour ?? DEFAULT_CHARM_COLOUR}
            mounted={live !== undefined}
            selected={letterOrdinal !== null && selectedCharm === letterOrdinal}
            delay={slot.delay}
            reducedMotion={reducedMotion}
            onExited={() => drop(slot.id)}
            onClick={() => letterOrdinal !== null && onSelectCharm?.(letterOrdinal)}
          />
        )
      })}
    </group>
  )
}

useGLTF.preload(COLLAR_URL, DRACO)
useGLTF.preload(CHARMS_URL, DRACO)
