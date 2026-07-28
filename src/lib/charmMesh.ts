import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import type { BufferGeometry, Mesh } from 'three';
import { mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

export const CHARMS_URL = '/models/charms.glb';
export const CHARMS_DRACO = '/draco/';

/** Every individual charm mesh baked into charms.glb — see src/lib/collar3d.ts for the source-of-truth list. */
export const CHARM_KEYS = [
  ...'0123456789'.split(''),
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  'Flower', 'Heart', 'Paw', 'Star',
].map((k) => `Charm_${k}`);

export function charmKeyFor(char: string): string {
  return `Charm_${char.toUpperCase()}`;
}

/**
 * charms.glb's source meshes are flat-shaded with no smoothing (same issue the
 * Blender-side Charms_ROCKY mesh had — see biothaneMaterial.ts's neighbour
 * commit). There's no Blender source file for this asset in this project to
 * fix at the root, so it's fixed here instead: weld the split flat-shading
 * vertices back together, then recompute normals with a crease-angle cutoff
 * (matching Blender's "Smooth by Angle" at ~35deg) so bevelled curves render
 * smooth while genuinely sharp corners stay sharp.
 */
const CREASE_ANGLE = Math.PI / 5.14; // ~35deg, matches the Blender-side fix

function smoothCharmGeometry(geometry: BufferGeometry): BufferGeometry {
  const merged = mergeVertices(geometry);
  return toCreasedNormals(merged, CREASE_ANGLE);
}

useGLTF.preload(CHARMS_URL, CHARMS_DRACO);

/** Loads charms.glb once and returns every charm's geometry, pre-smoothed. Cached per mount. */
export function useSmoothedCharmGeometries(): Map<string, BufferGeometry> {
  const { nodes } = useGLTF(CHARMS_URL, CHARMS_DRACO) as unknown as { nodes: Record<string, Mesh> };

  return useMemo(() => {
    const cache = new Map<string, BufferGeometry>();
    for (const key of CHARM_KEYS) {
      const geometry = nodes[key]?.geometry;
      if (geometry) cache.set(key, smoothCharmGeometry(geometry));
    }
    return cache;
  }, [nodes]);
}
