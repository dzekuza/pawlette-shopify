'use client'

import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Box3, BufferGeometry, Mesh, Vector3 } from 'three'
import { CHARM_WIDTHS, GAP, MATERIAL_DEFAULTS, SHAPE_WIDTHS } from '@/lib/collar3d'
import type { CharmSpec } from '@/lib/collar3d'

const CHARMS_URL = '/models/charms.glb'
const DRACO = '/draco/'

const ALL_WIDTHS: Record<string, number> = { ...CHARM_WIDTHS, ...SHAPE_WIDTHS }

type LaidOutCharm = CharmSpec & { x: number }

/** Lays charms out left-to-right, centred as a group, spaced the same way they sit on the strap. */
function layoutRow(items: CharmSpec[]): LaidOutCharm[] {
  const widths = items.map((c) => ALL_WIDTHS[c.meshKey] ?? 0.6)
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + GAP * Math.max(0, items.length - 1)
  let cursor = -totalWidth / 2
  return items.map((item, i) => {
    const w = widths[i]
    const x = cursor + w / 2
    cursor += w + GAP
    return { ...item, x }
  })
}

/** One floating charm, centred on its own bounding-box middle. */
function SingleCharm({ nodes, meshKey, colour, x }: { nodes: Record<string, unknown>; meshKey: string; colour: string; x: number }) {
  const geometry = useMemo(() => {
    const node = nodes[`Charm_${meshKey}`] as Mesh | undefined
    if (!node) return null
    const geo = node.geometry.clone() as BufferGeometry
    geo.computeBoundingBox()
    const box = geo.boundingBox ?? new Box3()
    const centre = box.getCenter(new Vector3())
    geo.translate(-centre.x, -centre.y, -centre.z)
    return geo
  }, [nodes, meshKey])

  if (!geometry) return null

  return (
    <mesh geometry={geometry} position={[x, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={colour} {...MATERIAL_DEFAULTS.charm} />
    </mesh>
  )
}

export type Charm3DMeshProps = {
  /** Rendered left-to-right, in the customer's pick order. Items with no matching mesh in charms.glb are silently skipped. */
  items: CharmSpec[]
}

/** A row of floating charms — no strap, no mount animation, just the current selection laid side by side. */
export function Charm3DMesh({ items }: Charm3DMeshProps) {
  const { nodes } = useGLTF(CHARMS_URL, DRACO)
  const laidOut = useMemo(() => layoutRow(items), [items])

  return (
    <group>
      {laidOut.map((c, i) => (
        <SingleCharm key={`${c.meshKey}-${i}`} nodes={nodes} meshKey={c.meshKey} colour={c.colour} x={c.x} />
      ))}
    </group>
  )
}

useGLTF.preload(CHARMS_URL, DRACO)
