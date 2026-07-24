'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import { BIOTHANE_MATERIAL_PROPS } from '@/lib/biothaneMaterial';
import { CHARM_KEYS, useSmoothedCharmGeometries } from '@/lib/charmMesh';

/** Brand palette — src/lib/shopify.ts COLOR_BG, same set the collar customiser cycles through. */
const PALETTE = ['#B8D8F4', '#6B9FD4', '#D4B8F4', '#F4B5C0', '#F9E4A0', '#A8D5A2'];

type Instance = {
  meshKey: string;
  colour: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  /** Bob animation: amplitude/speed/phase are randomised per-instance so the field doesn't move in lockstep. */
  bobAmplitude: number;
  bobSpeed: number;
  bobPhase: number;
  spinSpeed: number;
};

/** Deterministic-enough scatter: a jittered grid so charms cover the frame without overlapping, then shuffled draw order. */
function buildInstances(count: number): Instance[] {
  const cols = Math.ceil(Math.sqrt((count * 16) / 9));
  const rows = Math.ceil(count / cols);
  const cellW = 17 / cols;
  const cellH = 9.5 / rows;

  const cells: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push([-8.5 + cellW * (c + 0.5), 4.75 - cellH * (r + 0.5)]);
    }
  }
  // shuffle so charm-key assignment doesn't correlate with grid position
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return Array.from({ length: count }, (_, i) => {
    const [gx, gy] = cells[i % cells.length];
    const jitterX = (Math.random() - 0.5) * cellW * 0.5;
    const jitterY = (Math.random() - 0.5) * cellH * 0.5;
    return {
      meshKey: CHARM_KEYS[i % CHARM_KEYS.length],
      colour: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      position: [gx + jitterX, gy + jitterY, (Math.random() - 0.5) * 3],
      rotation: [
        (Math.random() - 0.5) * 0.6,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.6,
      ],
      scale: 0.75 + Math.random() * 0.9,
      bobAmplitude: 0.12 + Math.random() * 0.22,
      bobSpeed: 0.35 + Math.random() * 0.5,
      bobPhase: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.4,
    };
  });
}

function FloatingCharm({ instance, geometry }: { instance: Instance; geometry: Mesh['geometry'] }) {
  const group = useRef<Group>(null!);
  const baseY = instance.position[1];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current.position.y = baseY + Math.sin(t * instance.bobSpeed + instance.bobPhase) * instance.bobAmplitude;
    group.current.rotation.y += instance.spinSpeed * 0.01;
  });

  return (
    <group
      ref={group}
      position={instance.position}
      rotation={instance.rotation}
      scale={instance.scale}
    >
      <mesh geometry={geometry} castShadow={false}>
        <meshPhysicalMaterial
          color={instance.colour}
          {...BIOTHANE_MATERIAL_PROPS}
        />
      </mesh>
    </group>
  );
}

function CharmField({ count }: { count: number }) {
  const smoothedGeometries = useSmoothedCharmGeometries();
  const instances = useMemo(() => buildInstances(count), [count]);

  return (
    <>
      {instances.map((instance, i) => {
        const geometry = smoothedGeometries.get(instance.meshKey);
        if (!geometry) return null;
        return <FloatingCharm key={i} instance={instance} geometry={geometry} />;
      })}
    </>
  );
}

export type CharmPatternSceneProps = {
  /** How many charms to scatter across the field. */
  count?: number;
  className?: string;
};

/**
 * Decorative background: a random field of every PawCharms charm shape,
 * gently levitating (independent sine bob + slow spin per instance), on a
 * fully transparent canvas so it can sit over any section background.
 * Reuses the existing public/models/charms.glb — no new 3D asset needed.
 */
export function CharmPatternScene({ count = 26, className }: CharmPatternSceneProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 12], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Suspense fallback={null}>
        <CharmField count={count} />
        <Environment preset="city" environmentIntensity={0.5} />
      </Suspense>
    </Canvas>
  );
}
