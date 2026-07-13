'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { BufferGeometry, Group } from 'three'
import { MATERIAL_DEFAULTS, PRONG_HINGE, PRONG_OPEN } from '@/lib/collar3d'
import { reportOpen, type Lock } from '@/lib/lockState'
import { settle, spring, stepSpring } from '@/lib/spring'

/**
 * The buckle prong, and with it the collar's lock.
 *
 * It lifts whenever any charm has work to do and drops once they have all
 * settled, which is what turns a name change into unbuckle -> fit -> buckle up.
 *
 * The prong's geometry is baked in world coordinates (like every part of
 * collar.glb), so to swing it about the bar rather than about the scene origin
 * it is pushed back by the hinge offset inside a group placed at the hinge:
 * at rest the two cancel out and the prong sits exactly where it was exported.
 */

/** Quick and eager: the collar should already be opening as the first letter arrives. */
const UNBUCKLE = [140, 19] as const
/** Stiffer and heavier — the prong drops under its own weight and stops dead against the strap. */
const BUCKLE = [260, 20] as const

/** How long the collar stays open after the last letter lands, in seconds. */
const HOLD = 0.28

export type Collar3DProngProps = {
  geometry: BufferGeometry
  colour: string
  lock: React.RefObject<Lock>
  reducedMotion: boolean
}

export function Collar3DProng({ geometry, colour, lock, reducedMotion }: Collar3DProngProps) {
  const hinge = useRef<Group>(null!)
  const open = useRef(spring(0))
  const idle = useRef(0)

  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 30)
    const busy = lock.current.busy.size > 0

    // Don't buckle up the instant the last letter stops moving — let it sit for
    // a beat, or a fast typist gets a stutter of the prong opening and closing.
    idle.current = busy ? 0 : idle.current + dt
    const wanted = busy || idle.current < HOLD ? 1 : 0

    const [stiffness, damping] = wanted === 1 ? UNBUCKLE : BUCKLE
    const o = reducedMotion
      ? settle(open.current, wanted)
      : stepSpring(open.current, wanted, dt, stiffness, damping)

    reportOpen(lock.current, o)

    // The closing spring is underdamped so it arrives with some pace, but the
    // prong cannot swing *past* shut — it would pass through the leather. The
    // clamp is the stop it hits, and hitting it is what reads as the click.
    hinge.current.rotation.y = PRONG_OPEN * Math.max(0, o)
  })

  return (
    <group ref={hinge} position={PRONG_HINGE}>
      <mesh
        geometry={geometry}
        position={[-PRONG_HINGE[0], -PRONG_HINGE[1], -PRONG_HINGE[2]]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={colour} {...MATERIAL_DEFAULTS.hardware} />
      </mesh>
    </group>
  )
}
