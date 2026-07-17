'use client'

import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Collar3DMesh } from '@/components/products/Collar3DMesh'
import type { CharmSpec } from '@/lib/collar3d'

/**
 * Swatch hexes are sampled from product PHOTOS, which already bake in studio
 * light. Re-lighting them with a full-strength HDRI double-counts it and washes
 * the pastels to near-white, so the environment is dialled back to match the
 * photography. The hardware compensates with a high per-material
 * envMapIntensity (see MATERIAL_DEFAULTS) so it still reads as metal.
 */
const ENV_INTENSITY = 0.5
const TONE_EXPOSURE = 0.7

export type Collar3DSceneProps = {
  items: CharmSpec[]
  strapColour: string
  hardwareColour: string
  onSelectCharm?: (index: number) => void
  selectedCharm?: number | null
}

export default function Collar3DScene({ items, strapColour, hardwareColour, onSelectCharm, selectedCharm }: Collar3DSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [-5.0, 2.0, -4.2], fov: 40 }}
      gl={{ toneMappingExposure: TONE_EXPOSURE }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 6, -3]} intensity={1.8} castShadow />
      <directionalLight position={[3, 4, 4]} intensity={1} />
      <directionalLight position={[0, -3, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Center>
          <Collar3DMesh
            items={items}
            strapColour={strapColour}
            hardwareColour={hardwareColour}
            onSelectCharm={onSelectCharm}
            selectedCharm={selectedCharm}
          />
        </Center>
        <Environment preset="studio" environmentIntensity={ENV_INTENSITY} />
      </Suspense>
      <OrbitControls
        makeDefault
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={2.5}
        maxDistance={9}
        enablePan={false}
        enableZoom={false}
      />
    </Canvas>
  )
}
