'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import type { BufferGeometry, Group } from 'three';
import { BIOTHANE_MATERIAL_PROPS } from '@/lib/biothaneMaterial';
import { charmKeyFor, useSmoothedCharmGeometries } from '@/lib/charmMesh';
import { CHARM_WIDTHS, GAP } from '@/lib/collar3d';

const WORD = 'PAWSCHARM';

/** Brand palette — src/lib/shopify.ts COLOR_BG, same set the collar customiser cycles through. */
const PALETTE = ['#B8D8F4', '#6B9FD4', '#D4B8F4', '#F4B5C0', '#F9E4A0', '#A8D5A2'];

type Variant = 'idle' | 'loading';

type LetterLayout = {
  char: string;
  x: number;
  colour: string;
  bobPhase: number;
};

/** Kerns WORD left-to-right using the same per-charm widths + tracking gap the collar layout uses, centred on x=0. */
function layoutWord(): LetterLayout[] {
  const chars = WORD.split('');
  const widths = chars.map((c) => CHARM_WIDTHS[c] ?? 0.6);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + GAP * (chars.length - 1);

  let cursor = -totalWidth / 2;
  return chars.map((char, i) => {
    const width = widths[i];
    const x = cursor + width / 2;
    cursor += width + GAP;
    return {
      char,
      x,
      colour: PALETTE[i % PALETTE.length],
      bobPhase: (i / chars.length) * Math.PI * 2,
    };
  });
}

/**
 * 'idle': a gentle, slow, independent-phase breathing bob (the brand-section wordmark).
 * 'loading': a travelling wave that bounces letter-by-letter left-to-right, looping cleanly
 * every 3s (speed = 2*PI/3) — legible at a glance as "still working", the same read as a
 * row of loading dots. baseScale is larger so it reads clearly at the loader's small size.
 */
const LOADING_PERIOD_SECONDS = 3;
const MOTION = {
  idle: { speed: 0.5, amplitude: 0.1, stagger: 1, scalePulse: 0, baseScale: 1 },
  loading: {
    speed: (2 * Math.PI) / LOADING_PERIOD_SECONDS,
    amplitude: 0.4,
    stagger: 0.45,
    scalePulse: 0.12,
    baseScale: 1.5,
  },
} as const;

function Letter({
  layout,
  index,
  geometry,
  variant,
}: {
  layout: LetterLayout;
  index: number;
  geometry: BufferGeometry;
  variant: Variant;
}) {
  const group = useRef<Group>(null!);
  const motion = MOTION[variant];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const phase = variant === 'loading' ? index * motion.stagger : layout.bobPhase;
    // 'loading' wave is a one-sided hump (0..1) — recentre it to -0.5..0.5 so the bounce
    // is symmetric around the resting line instead of only ever lifting upward.
    const wave =
      variant === 'loading'
        ? Math.max(0, Math.sin(t * motion.speed - phase)) ** 2 - 0.5
        : Math.sin(t * motion.speed + phase);
    group.current.position.y = wave * motion.amplitude;
    const scale = motion.baseScale + wave * motion.scalePulse;
    group.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={group} position={[layout.x, 0, 0]}>
      <mesh geometry={geometry} castShadow={false}>
        <meshPhysicalMaterial color={layout.colour} {...BIOTHANE_MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}

function Word({ variant }: { variant: Variant }) {
  const smoothedGeometries = useSmoothedCharmGeometries();
  const layout = useMemo(() => layoutWord(), []);

  return (
    <>
      {layout.map((letterLayout, i) => {
        const geometry = smoothedGeometries.get(charmKeyFor(letterLayout.char));
        if (!geometry) return null;
        return <Letter key={i} index={i} layout={letterLayout} geometry={geometry} variant={variant} />;
      })}
    </>
  );
}

export type PawCharmsWordmarkSceneProps = {
  className?: string;
  /** 'idle' (default) for the brand-section wordmark, 'loading' for a bouncing loading indicator. */
  variant?: Variant;
};

/**
 * "PAWCHARMS" spelled out in the real charm letter shapes (public/models/charms.glb),
 * laid out with the same kerning maths the collar customiser uses.
 */
export function PawCharmsWordmarkScene({ className, variant = 'idle' }: PawCharmsWordmarkSceneProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Suspense fallback={null}>
        <Word variant={variant} />
        <Environment preset="city" environmentIntensity={0.5} />
      </Suspense>
    </Canvas>
  );
}
