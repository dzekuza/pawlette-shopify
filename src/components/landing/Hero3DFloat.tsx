'use client';

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, type Group } from 'three';
import Link from 'next/link';
import { DisplayHeading } from '@/components/storefront/Typography';
import { useCartCount } from '@/hooks/useCartCount';
import { CART_DRAWER_OPEN_EVENT } from '@/components/shared/CartDrawer';
import { BIOTHANE_MATERIAL_PROPS } from '@/lib/biothaneMaterial';
import { cn } from '@/lib/utils';

const MODEL_URL = '/models/rocky-collar-float.glb';

const NAV_LINKS = [
  { label: 'Antkakliai', href: '/products/pawcharms-antkaklis' },
  { label: 'Pavadeliai', href: '/products/pawcharms-pavadelis' },
  { label: 'Pakabukai', href: '/products/pawcharms-pakabuciai' },
];

/** Coated-webbing/moulded-plastic parts — see BIOTHANE_MATERIAL_PROPS. The buckle/rivet "Hardware" material is metal and is left alone. */
const BIOTHANE_MATERIAL_NAMES = new Set([
  'Strap',
  'CharmYellow',
  'CharmCream',
  'CharmPinkPastel',
  'CharmBlue',
  'CharmPurple',
]);

/** Overrides the baked-in Blender colour for specific materials — brand palette pink for the strap, matching the charm palette (src/lib/shopify.ts COLOR_BG). */
const COLOR_OVERRIDES: Record<string, string> = {
  Strap: '#F4B5C0',
};

/** Baked in Blender: FloatRig bobs on Z with an "AUTO_CLAMPED" ease, looping seamlessly at 96 frames / 24fps. */
function FloatingCollarModel() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = Object.values(actions)[0];
    action?.reset().play();
  }, [actions]);

  // Upgrade the imported MeshStandardMaterials to MeshPhysicalMaterial so the
  // BioThane clearcoat sheen renders (clearcoat has no effect on a plain
  // MeshStandardMaterial). Keyed by uuid so a material shared by several
  // meshes (e.g. all five charm colours reuse one material each) is only
  // converted once.
  useMemo(() => {
    const converted = new Map<string, MeshPhysicalMaterial>();
    scene.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      // Every part both casts onto its neighbours (e.g. charms onto the strap) and
      // receives — without this every surface renders flat-lit, which is what reads as "fake".
      child.castShadow = true;
      child.receiveShadow = true;

      const mat = child.material;
      if (Array.isArray(mat) || !mat || !BIOTHANE_MATERIAL_NAMES.has(mat.name)) return;

      let physical = converted.get(mat.uuid);
      if (!physical) {
        const override = COLOR_OVERRIDES[mat.name];
        const sourceColor = override
          ? new Color(override)
          : mat instanceof MeshStandardMaterial
            ? mat.color
            : new Color('#ffffff');
        physical = new MeshPhysicalMaterial({
          color: sourceColor,
          ...BIOTHANE_MATERIAL_PROPS,
        });
        physical.name = mat.name;
        converted.set(mat.uuid, physical);
      }
      child.material = physical;
    });
  }, [scene]);

  return <primitive ref={group} object={scene} />;
}

useGLTF.preload(MODEL_URL);

interface Hero3DFloatProps {
  className?: string;
}

/**
 * "v2" hero: one large sky-background card carries the nav, the floating
 * Blender-rendered ROCKY collar, the headline (overlaid in white), and the
 * small PAWCHARMS wordmark underneath — matching the reference mock exactly,
 * rather than stacking the nav/copy above a separate canvas panel.
 */
export function Hero3DFloat({ className }: Hero3DFloatProps) {
  const cartCount = useCartCount();

  return (
    <section className={cn('bg-cream px-4 pb-4 pt-2 md:px-6 md:pb-6', className)}>
      <div
        className="relative mx-auto flex w-full max-w-[1400px] flex-col overflow-hidden rounded-[32px]"
        style={{
          backgroundImage: 'url(/hero-figma/hero-sky-bg-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
        }}
      >
        {/* Nav, overlaid on the sky */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white no-underline drop-shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:ml-auto">
            <button
              onClick={() => window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT))}
              aria-label="Krepšelis"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-bark text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-interactive-text">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              href="/products"
              className="whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-sm font-medium text-bark no-underline"
            >
              Pirkti dabar
            </Link>
          </div>
        </div>

        {/* Headline, overlaid on the sky */}
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 pt-6 text-center md:px-10 md:pt-8">
          <DisplayHeading
            as="h1"
            size="floatingHero"
            className="mx-auto max-w-[900px] font-normal leading-[1.2] tracking-[0.02em] text-white drop-shadow-md"
          >
            Antkakliai, kurie pritampa prie kiekvieno nuotykio
          </DisplayHeading>
        </div>

        {/* Floating collar */}
        <div className="relative h-[300px] pb-6 md:h-[420px] md:pb-10 lg:h-[500px]">
          <Canvas
            shadows="soft"
            camera={{ position: [0, 2.25, -5.5], fov: 32 }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.25} />
            {/* Key: casts the real shadow, tight frustum around the collar so the shadow map stays sharp. */}
            <directionalLight
              position={[3, 6, -3]}
              intensity={2.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0004}
              shadow-camera-left={-3}
              shadow-camera-right={3}
              shadow-camera-top={3}
              shadow-camera-bottom={-3}
              shadow-camera-near={1}
              shadow-camera-far={12}
            />
            {/* Fill: softens the key's shadow side, no shadow of its own so it doesn't wash the first out. */}
            <directionalLight position={[-4, 2, 3]} intensity={0.6} />
            {/* Rim: thin edge highlight so the collar separates from the sky instead of reading flat. */}
            <directionalLight position={[0, 3, 6]} intensity={0.9} />
            <Suspense fallback={null}>
              <FloatingCollarModel />
              <Environment preset="city" environmentIntensity={0.5} />
              <ContactShadows
                position={[0, -0.65, 0]}
                opacity={0.45}
                scale={6}
                blur={2.4}
                far={2}
                color="#2b2420"
              />
            </Suspense>
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
              minAzimuthAngle={Math.PI - Math.PI / 10}
              maxAzimuthAngle={Math.PI + Math.PI / 10}
              autoRotate
              autoRotateSpeed={0.6}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
