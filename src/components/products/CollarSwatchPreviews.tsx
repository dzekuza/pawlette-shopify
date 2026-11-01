'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Environment } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { Collar3DMesh } from '@/components/products/Collar3DMesh'
import { HARDWARE_COLOUR, type CharmSpec } from '@/lib/collar3d'

/** Same photography-matched lighting as Collar3DScene, so a swatch collar reads like the main preview. */
const ENV_INTENSITY = 0.5
const TONE_EXPOSURE = 0.7

/** Camera direction of the main 3D tile, scaled far out: the ortho camera works in pixels, so the model is ~25x scaled up. */
const VIEW_DIRECTION = new THREE.Vector3(-5, 2, -4.2).normalize()
const CAMERA_POSITION = VIEW_DIRECTION.clone().multiplyScalar(500)
/** Screen-right in world space for a camera looking at the origin from VIEW_DIRECTION: swatches are laid out along this, not world X. */
const SCREEN_RIGHT = new THREE.Vector3(0, 1, 0).cross(VIEW_DIRECTION).normalize()
/** Share of a swatch cell the collar's bounding sphere fills. */
const FILL = 0.95

const NO_CHARMS: CharmSpec[] = []

type SwatchCollarProps = {
  x: number
  cellSize: number
  strapColour: string
  onReady: () => void
}

/** One collar, centred at `x` (pixels) and scaled so its bounding sphere fills the swatch cell. */
function SwatchCollar({ x, cellSize, strapColour, onReady }: SwatchCollarProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Imperative three.js mutation (scale), not React state — the standard r3f escape hatch.
  useLayoutEffect(() => {
    const group = groupRef.current
    if (!group || cellSize <= 0) return
    group.scale.setScalar(1)
    const box = new THREE.Box3().setFromObject(group)
    if (box.isEmpty()) return
    const radius = box.getBoundingSphere(new THREE.Sphere()).radius
    group.scale.setScalar((cellSize * FILL) / (2 * radius))
  }, [cellSize])

  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <group ref={groupRef} position={SCREEN_RIGHT.clone().multiplyScalar(x)}>
      <Center>
        <Collar3DMesh items={NO_CHARMS} strapColour={strapColour} hardwareColour={HARDWARE_COLOUR} />
      </Center>
    </group>
  )
}

function Collars({ strapColours, gap, onReady }: { strapColours: string[]; gap: number; onReady: () => void }) {
  const width = useThree((state) => state.size.width)
  const count = strapColours.length
  const cellSize = (width - gap * (count - 1)) / count

  return (
    <>
      {strapColours.map((strapColour, i) => (
        <SwatchCollar
          key={i}
          x={-width / 2 + cellSize / 2 + i * (cellSize + gap)}
          cellSize={cellSize}
          strapColour={strapColour}
          onReady={onReady}
        />
      ))}
    </>
  )
}

export type CollarSwatchPreviewsProps = {
  /** One strap colour (hex) per swatch, in swatch order. */
  strapColours: string[]
  /** Pixel gap between swatches; must match the flex gap of the button row this canvas sits over. */
  gap: number
  /** Fires once the model has loaded and the collars are on screen; pass a stable callback. */
  onReady: () => void
}

/**
 * Live 3D collars for a row of equal-width square colour swatches, drawn in ONE canvas
 * (one WebGL context) instead of one per swatch. The canvas fills its parent and is meant
 * to sit over the swatch buttons with pointer events off, so the buttons stay clickable.
 */
export default function CollarSwatchPreviews({ strapColours, gap, onReady }: CollarSwatchPreviewsProps) {
  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: CAMERA_POSITION.toArray(), zoom: 1, near: 1, far: 1000 }}
      gl={{ toneMappingExposure: TONE_EXPOSURE }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[-4, 6, -3]} intensity={2.4} />
      <directionalLight position={[3, 4, 4]} intensity={1.4} />
      <directionalLight position={[0, -3, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Collars strapColours={strapColours} gap={gap} onReady={onReady} />
        <Environment preset="studio" environmentIntensity={ENV_INTENSITY} />
      </Suspense>
    </Canvas>
  )
}
