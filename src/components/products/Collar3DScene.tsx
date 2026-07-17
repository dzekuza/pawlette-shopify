'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Suspense, useLayoutEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
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

/** Extra breathing room around the model's bounding sphere so it never touches the frame edge. */
const FIT_MARGIN = 1.3

/**
 * Repositions the camera along its current viewing direction so the wrapped
 * model's bounding sphere always fits inside the frustum, for the canvas's
 * *current* aspect ratio. Recomputed synchronously (no tween) on mount and on
 * every canvas resize, which is what keeps the collar from being cropped on
 * narrow/mobile aspect ratios where the horizontal FOV is much tighter than
 * on desktop.
 */
function FitCameraToView({ children, margin = FIT_MARGIN }: { children: ReactNode; margin?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, size } = useThree()

  // Imperative three.js mutation on the render-loop camera, not React state — the
  // standard r3f escape hatch (see drei's own Bounds implementation, which does the same).
  /* eslint-disable react-hooks/immutability */
  useLayoutEffect(() => {
    const group = groupRef.current
    if (!group || !(camera instanceof THREE.PerspectiveCamera)) return

    const box = new THREE.Box3().setFromObject(group)
    if (box.isEmpty()) return

    const sphere = box.getBoundingSphere(new THREE.Sphere())
    const vFov = (camera.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
    const distance = Math.max(sphere.radius / Math.sin(vFov / 2), sphere.radius / Math.sin(hFov / 2)) * margin

    const direction = camera.position.clone().sub(sphere.center).normalize()
    camera.position.copy(sphere.center.clone().addScaledVector(direction, distance))
    camera.near = distance / 100
    camera.far = distance * 100
    camera.lookAt(sphere.center)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, margin])
  /* eslint-enable react-hooks/immutability */

  return <group ref={groupRef}>{children}</group>
}

export type Collar3DSceneProps = {
  items: CharmSpec[]
  strapColour: string
  hardwareColour: string
  onSelectCharm?: (index: number) => void
  selectedCharm?: number | null
  /** Ambient auto-spin, for decorative (non-configurator) placements. Defaults to off. */
  autoRotate?: boolean
  autoRotateSpeed?: number
  /** Set to false for purely decorative renders so drag/touch doesn't hijack page scroll. Defaults to on. */
  interactive?: boolean
  /** Breathing room around the model's bounding sphere, as a multiplier (1 = no margin). Defaults to FIT_MARGIN. */
  fitMargin?: number
  modelRotation?: [number, number, number]
  modelScale?: number
  modelPosition?: [number, number, number]
}

export default function Collar3DScene({
  items,
  strapColour,
  hardwareColour,
  onSelectCharm,
  selectedCharm,
  autoRotate = false,
  autoRotateSpeed = 1.2,
  interactive = true,
  fitMargin = FIT_MARGIN,
  modelRotation = [0, 0, 0],
  modelScale = 1,
  modelPosition = [0, 0, 0],
}: Collar3DSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [-5.0, 2.0, -4.2], fov: 40 }}
      gl={{ toneMappingExposure: TONE_EXPOSURE }}
      style={{
        touchAction: interactive ? 'none' : 'pan-y',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 6, -3]} intensity={1.8} castShadow />
      <directionalLight position={[3, 4, 4]} intensity={1} />
      <directionalLight position={[0, -3, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <FitCameraToView margin={fitMargin}>
          <group rotation={modelRotation} scale={modelScale} position={modelPosition}>
            <Center>
              <Collar3DMesh
                items={items}
                strapColour={strapColour}
                hardwareColour={hardwareColour}
                onSelectCharm={onSelectCharm}
                selectedCharm={selectedCharm}
              />
            </Center>
          </group>
        </FitCameraToView>
        <Environment preset="studio" environmentIntensity={ENV_INTENSITY} />
      </Suspense>
      <OrbitControls
        makeDefault
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={1}
        maxDistance={30}
        enablePan={false}
        enableZoom={false}
        enableRotate={interactive}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />
    </Canvas>
  )
}
