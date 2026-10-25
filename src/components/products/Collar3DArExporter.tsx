'use client'

import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'

/**
 * Real-world size of one model unit, in metres. collar-customiser's Blender scene is authored at
 * 1 unit = 4 cm (scene unit scale 0.04), so the strap is 0.5 units = 2 cm wide and the ring has a
 * ~34 cm inner circumference, i.e. the S collar. Keep in sync with public/models/collar.glb.
 */
const AR_SCALE = 0.04

/** Wait for charm arrival / prong animations to settle before snapshotting the scene. */
const SETTLE_MS = 1500

/**
 * Renders nothing. Snapshots the live collar model to a USDZ blob (the format iOS AR Quick Look opens)
 * whenever `signature` changes, and reports its object URL via `onReady`. Must live inside the <Canvas>
 * so the model's matrices are current; the exporter itself is imported lazily so it only loads on iOS.
 */
export function Collar3DArExporter({
  modelRef,
  signature,
  onReady,
}: {
  modelRef: RefObject<THREE.Group | null>
  signature: string
  onReady: (url: string | null) => void
}) {
  useEffect(() => {
    let cancelled = false
    let url: string | null = null
    const timer = window.setTimeout(async () => {
      const model = modelRef.current
      if (!model) return
      try {
        const { USDZExporter } = await import('three/examples/jsm/exporters/USDZExporter.js')
        if (cancelled) return
        // Share geometry/materials with the live scene; only the wrapper transform differs.
        const snapshot = model.clone(true)
        snapshot.position.set(0, 0, 0)
        snapshot.rotation.set(0, 0, 0)
        snapshot.scale.setScalar(1)
        const root = new THREE.Group()
        root.add(snapshot)
        root.scale.setScalar(AR_SCALE)
        root.updateMatrixWorld(true)
        // Sit the collar on the detected surface instead of straddling it.
        root.position.y = -new THREE.Box3().setFromObject(root).min.y
        const scene = new THREE.Scene()
        scene.add(root)
        const data = await new USDZExporter().parseAsync(scene, { quickLookCompatible: true })
        if (cancelled) return
        url = URL.createObjectURL(new Blob([data as BlobPart], { type: 'model/vnd.usdz+zip' }))
        onReady(url)
      } catch {
        if (!cancelled) onReady(null)
      }
    }, SETTLE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (url) URL.revokeObjectURL(url)
    }
  }, [modelRef, signature, onReady])

  return null
}
