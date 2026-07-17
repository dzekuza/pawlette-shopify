'use client'

import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { BufferGeometry, Color, Group, Mesh, MeshStandardMaterial } from 'three'
import { BACK_RADIUS, MATERIAL_DEFAULTS } from '@/lib/collar3d'
import { OPEN_ENOUGH, type Lock } from '@/lib/lockState'
import { settle, spring, stepSpring } from '@/lib/spring'

/**
 * One letter on the strap, animated.
 *
 * Everything is driven per-frame from springs rather than from React state: a
 * charm's target moves while it is still in flight (adding a letter re-kerns
 * the name under it), and a 60-times-a-second setState would re-render the
 * whole scene graph for it.
 *
 * The mount is a single 0..1 spring, `mount`, that every other property hangs
 * off. At 0 the charm floats off the strap along its own outward normal, tipped
 * back and scaled down; at 1 it is seated. The spring is underdamped, so it
 * sails past 1 and settles back — the charm presses very slightly into the
 * leather and rebounds, which is what makes it land rather than arrive.
 *
 * A letter never moves on its own schedule: it can only go on or come off an
 * unbuckled collar, so it waits on `lock` (see lib/lockState.ts).
 */

/** How far out along the outward normal a charm starts, in world units. */
const LIFT = 0.5
/** ...and how far above the strap. */
const RISE = 0.2
/**
 * The charm mesh's own origin sits a little below its visual centre (the
 * mounting-tunnel cut isn't perfectly centred), so a charm mounted at Y=0
 * reads as hanging low off the strap. Lifting the seated rest position
 * compensates without touching the Blender source.
 */
const SEATED_Y_OFFSET = 0.07
/** Charms read small next to the strap at their native mesh scale. */
const CHARM_SCALE = 1.2
/** How far it is tipped back on arrival, in radians. */
const TILT = 0.5
/** How far a selected charm eases off the strap, in world units. */
const SELECT_LIFT = 0.06
/** ...and how much it grows. */
const SELECT_GROWTH = 0.06

/** Underdamped (2*sqrt(150) = 24.5): overshoots ~7%, so the letter clicks into place. */
const MOUNT = [150, 17] as const
/** Overdamped: a deleted letter leaves cleanly, without bouncing on the way out. */
const UNMOUNT = [130, 26] as const
/** Critically damped: re-kerning slides letters along the strap, it never wobbles them. */
const SLIDE = [110, 21] as const
/** Snappy, slight overshoot: selection should feel like a button press. */
const SELECT = [220, 21] as const

/** Below this the exit animation is over and the slot can be dropped. */
const GONE = 0.01

/** How close to seated, and how nearly stopped, a letter must be before it stops holding the buckle open. */
const SEATED = 0.02
const STILL = 0.08

const HIGHLIGHT = 0.18
/** Per-second rate for the colour cross-fade when a swatch is clicked. */
const COLOUR_RATE = 12

export type Collar3DCharmProps = {
  /** Slot id, used to announce to the buckle that this letter is still moving. */
  id: number
  lock: React.RefObject<Lock>
  geometry: BufferGeometry
  /** Where the charm belongs on the strap, in radians. Both this and `colour` are ignored once it is unmounting: it holds its last position and colour while it leaves. */
  angle: number
  colour: string
  selected: boolean
  /** False once the letter has been deleted: it flies back off the strap and reports out. */
  mounted: boolean
  /** Seconds to hold before flying in, so several new letters land in sequence. */
  delay: number
  reducedMotion: boolean
  onExited: () => void
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

export function Collar3DCharm({
  id,
  lock,
  geometry,
  angle,
  colour,
  selected,
  mounted,
  delay,
  reducedMotion,
  onExited,
  onClick,
}: Collar3DCharmProps) {
  const group = useRef<Group>(null!)
  const mesh = useRef<Mesh>(null!)
  const material = useRef<MeshStandardMaterial>(null!)

  const mount = useRef(spring(0))
  const slide = useRef(spring(angle))
  const select = useRef(spring(0))

  const wait = useRef(delay)
  const first = useRef(true)
  const exited = useRef(false)
  /** Latches once the letter is fitted: from then on the buckle no longer holds it back. */
  const landed = useRef(false)

  const target = useMemo(() => new Color(colour), [colour])

  // Whatever happens to this letter — it leaves, or React drops it mid-flight —
  // it must not be left holding the collar open.
  const busy = lock.current.busy
  useEffect(() => () => void busy.delete(id), [busy, id])

  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 30)
    const mat = material.current

    // The material starts on the default white, so the first colour is a snap,
    // not a fade. Only later changes (a swatch click) cross-fade.
    if (first.current) {
      mat.color.copy(target)
      first.current = false
    }

    const clear = lock.current.open >= OPEN_ENOUGH

    // The stagger only starts counting once the collar is actually open, so the
    // letters queue up behind the buckle instead of against the clock.
    if (mounted && !landed.current && clear && wait.current > 0) wait.current -= dt
    const ready = mounted && clear && wait.current <= 0

    // Once a letter is on, it is ON: the lock stops governing it. Without this
    // latch, buckling up would send every seated letter flying back off (which
    // would mark them busy, which would unbuckle the collar again, forever).
    if (mounted && mount.current.value >= 1 - SEATED) landed.current = true

    // Still needs the collar open if it hasn't landed, is on its way off, or is
    // still sliding to a new position as the name re-kerns around it.
    const settled =
      landed.current &&
      Math.abs(mount.current.value - 1) < SEATED &&
      Math.abs(mount.current.velocity) < STILL &&
      Math.abs(slide.current.velocity) < STILL
    const done = exited.current || (mounted && settled)
    if (done) lock.current.busy.delete(id)
    else lock.current.busy.add(id)

    let m: number
    let a: number
    let s: number

    if (reducedMotion) {
      m = settle(mount.current, mounted ? 1 : 0)
      a = settle(slide.current, mounted ? angle : slide.current.value)
      s = settle(select.current, selected ? 1 : 0)
    } else {
      const [stiffness, damping] = mounted ? MOUNT : UNMOUNT
      const goal = mounted
        ? // Landed letters stay put even after the collar is buckled again.
          landed.current || ready
          ? 1
          : 0
        : // On its way off: hold still until the collar is opened for it.
          clear
          ? 0
          : mount.current.value
      m = stepSpring(mount.current, goal, dt, stiffness, damping)
      // An unmounting charm stops chasing the layout — the letters that are
      // staying re-kern around it while it shrinks away where it stood.
      a = stepSpring(slide.current, mounted ? angle : slide.current.value, dt, ...SLIDE)
      s = stepSpring(select.current, selected ? 1 : 0, dt, ...SELECT)
    }

    // Past 1 the charm is pressing *into* the strap, so no clamping here — but
    // scale must never go negative, or the geometry turns inside out.
    const seated = Math.max(0, m)
    const off = 1 - m

    const radius = BACK_RADIUS + LIFT * off + SELECT_LIFT * s
    group.current.position.set(radius * Math.cos(a), RISE * off + SEATED_Y_OFFSET * seated, -radius * Math.sin(a))
    group.current.rotation.y = a + Math.PI / 2

    // Local X is the reading direction, so this tips the letter face-up towards
    // the viewer and rolls it down flat onto the leather.
    mesh.current.rotation.x = TILT * off
    mesh.current.scale.setScalar(seated * CHARM_SCALE * (1 + SELECT_GROWTH * s))

    // A deleted letter has no layout entry left, so it has no colour to be told
    // about either — it keeps whatever it was wearing on its way out.
    if (mounted) mat.color.lerp(target, 1 - Math.exp(-COLOUR_RATE * dt))
    mat.emissiveIntensity = HIGHLIGHT * s

    if (!mounted && !exited.current && seated < GONE) {
      exited.current = true
      onExited()
    }
  })

  // The JSX describes the charm already seated, and the animation overrides it
  // from the first frame onwards (useFrame runs before the renderer, so these
  // values are never actually painted). It matters anyway: if the frame loop
  // ever fails to run, a letter that is merely un-animated still shows up in
  // its right place, rather than vanishing at scale 0.
  return (
    <group
      ref={group}
      position={[BACK_RADIUS * Math.cos(angle), SEATED_Y_OFFSET, -BACK_RADIUS * Math.sin(angle)]}
      rotation={[0, angle + Math.PI / 2, 0]}
    >
      <mesh
        ref={mesh}
        geometry={geometry}
        castShadow
        onClick={
          mounted
            ? (e) => {
                e.stopPropagation()
                onClick?.(e)
              }
            : undefined
        }
        onPointerOver={
          mounted
            ? (e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
              }
            : undefined
        }
        onPointerOut={
          mounted
            ? () => {
                document.body.style.cursor = 'auto'
              }
            : undefined
        }
      >
        <meshStandardMaterial
          ref={material}
          {...MATERIAL_DEFAULTS.charm}
          emissive="#ffffff"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  )
}
