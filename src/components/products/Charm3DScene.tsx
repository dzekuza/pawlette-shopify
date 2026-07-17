'use client'

import { Canvas } from '@react-three/fiber'
import { Bounds, Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Charm3DMesh } from '@/components/products/Charm3DMesh'
import type { CharmSpec } from '@/lib/collar3d'

/** See Collar3DScene.tsx — swatch hexes already bake in studio light, so the environment is dialled back to match. */
const ENV_INTENSITY = 0.5
const TONE_EXPOSURE = 0.7
const AUTO_ROTATE_SPEED = 2.2

export type Charm3DSceneProps = {
  items: CharmSpec[]
}

export default function Charm3DScene({ items }: Charm3DSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.6, 3.2], fov: 32 }}
      gl={{ toneMappingExposure: TONE_EXPOSURE }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 6, -3]} intensity={1.8} castShadow />
      <directionalLight position={[3, 4, 4]} intensity={1} />
      <directionalLight position={[0, -3, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={2.4} key={items.map((c) => c.meshKey).join('|')}>
          <Charm3DMesh items={items} />
        </Bounds>
        <Environment preset="studio" environmentIntensity={ENV_INTENSITY} />
      </Suspense>
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  )
}
