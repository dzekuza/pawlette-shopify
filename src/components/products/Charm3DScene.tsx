'use client'

import { Canvas } from '@react-three/fiber'
import { Bounds, Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Charm3DMesh } from '@/components/products/Charm3DMesh'
import type { CharmSpec } from '@/lib/collar3d'

/**
 * Darker than Collar3DScene's rig: on the collar page a charm sits next to the
 * navy strap, which anchors the eye and hides how bright the lighting actually
 * is. Floating alone against a pale background, the same rig reads as washed
 * out -- especially the light pastels (lilac, sky blue) -- so ambient/env are
 * pulled down and exposure trimmed.
 */
const ENV_INTENSITY = 0.32
const TONE_EXPOSURE = 0.62
const AUTO_ROTATE_SPEED = 2.2

export type Charm3DSceneProps = {
  items: CharmSpec[]
  /** Bounds.fit padding multiplier (drei: 1 = tight fit, higher = more breathing room). Defaults to 2.4, tuned for a roughly square container — pass a tighter value for narrow/short frames. */
  boundsMargin?: number
  /** Continuous auto-spin. Defaults to on; set false for a static decorative render. */
  autoRotate?: boolean
}

export default function Charm3DScene({ items, boundsMargin = 2.4, autoRotate = true }: Charm3DSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.6, 3.2], fov: 32 }}
      gl={{ toneMappingExposure: TONE_EXPOSURE }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 6, -3]} intensity={1.3} castShadow />
      <directionalLight position={[3, 4, 4]} intensity={0.65} />
      <directionalLight position={[0, -3, -5]} intensity={0.3} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={boundsMargin} key={items.map((c) => c.meshKey).join('|')}>
          <Charm3DMesh items={items} />
        </Bounds>
        <Environment preset="studio" environmentIntensity={ENV_INTENSITY} />
      </Suspense>
      <OrbitControls
        makeDefault
        autoRotate={autoRotate}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  )
}
