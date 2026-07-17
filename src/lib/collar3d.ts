/**
 * Geometry constants and layout maths for the 3D collar preview.
 *
 * Ported from collar-customiser/app/src/lib/collar.ts. Values are derived from
 * the Blender source (collar-customiser/blender/collar_source.blend) and must
 * stay in sync with public/models/collar.glb + charms.glb.
 *
 * Charm convention in the exported GLB (Three.js axes):
 *   local +X = reading direction
 *   local +Y = up
 *   local +Z = outward (readable face); origin sits on the charm's BACK face,
 *              vertically centred on the cap box.
 *
 * The strap is a circle in the XZ plane, centred on the origin.
 */

/** Strap outer surface. Arc length for letter spacing is measured here. */
export const TEXT_RADIUS = 1.597;

/** Where a charm's back face sits: 0.17 embedded into the strap, matching the original design. */
export const BACK_RADIUS = 1.427;

/** Tracking between charms, in world units. */
export const GAP = 0.09;

/** Front of the collar, in degrees. The original "ROCKY" was centred here. */
export const CENTRE_DEG = 140;

/**
 * Buckle, rivets, keeper and D-ring occupy roughly 296deg..13deg.
 * Charms must stay inside this arc.
 */
export const FREE_ARC_DEG: [number, number] = [20, 290];

/**
 * The buckle prong's hinge, measured from Buckle_Bar in collar.glb: the bar is a
 * rod running along +Y through this point, and the prong hangs off it pointing
 * along the strap. So the prong swings about world +Y here, and because the
 * strap is a ring in the XZ plane, that swing carries the prong's tip radially
 * away from the leather — i.e. it unbuckles.
 */
export const PRONG_HINGE: [number, number, number] = [1.109, 0, 0.975];

/** How far the prong lifts when the collar is unbuckled, in radians (~40deg). Positive lifts away from the strap. */
export const PRONG_OPEN = 0.7;

/** Per-charm width in world units. Widths vary 4.7x (I=0.19, W=0.89), so spacing must be proportional. */
export const CHARM_WIDTHS: Record<string, number> = {
  A: 0.6694, B: 0.605, C: 0.6452, D: 0.6206, E: 0.5651, F: 0.5163, G: 0.6867,
  H: 0.6125, I: 0.188, J: 0.494, K: 0.6189, L: 0.5281, M: 0.6935, N: 0.6088,
  O: 0.7035, P: 0.5596, Q: 0.7398, R: 0.6059, S: 0.581, T: 0.6178, U: 0.6116,
  V: 0.6352, W: 0.8905, X: 0.5793, Y: 0.5933, Z: 0.6349,
  "0": 0.517, "1": 0.3801, "2": 0.5183, "3": 0.5172, "4": 0.5766,
  "5": 0.52, "6": 0.5275, "7": 0.5134, "8": 0.5245, "9": 0.527,
};

export const isCharmable = (ch: string) => ch in CHARM_WIDTHS;

/** Per-icon-shape width, in the same world units as CHARM_WIDTHS. Measured from the Blender source meshes. */
export const SHAPE_WIDTHS: Record<string, number> = {
  Heart: 0.8534,
  Star: 0.7768,
  Flower: 0.7406,
  Paw: 0.8098,
};

const ALL_WIDTHS: Record<string, number> = { ...CHARM_WIDTHS, ...SHAPE_WIDTHS };

export type PlacedCharm = {
  char: string;
  /** Radians, measured in the same frame as CENTRE_DEG. */
  angle: number;
  position: [number, number, number];
  rotationY: number;
};

/** A single item to place around the collar: a letter/digit, or an icon charm shape. */
export type CharmSpec = {
  /** Mesh lookup key: a single letter/digit for letters, or a shape name ("Heart", "Star", ...) for icons. */
  meshKey: string;
  colour: string;
  kind: 'letter' | 'icon';
};

export type LaidOutCharm = PlacedCharm & { colour: string; kind: 'letter' | 'icon' };

/**
 * Lay arbitrary charms (letters and/or icons, in the given order) out around
 * the collar with proportional (kerned) spacing, centred on `centreDeg`.
 */
export function layoutCharms(items: CharmSpec[], centreDeg = CENTRE_DEG): LaidOutCharm[] {
  if (items.length === 0) return [];

  const widths = items.map((it) => ALL_WIDTHS[it.meshKey] ?? 0.6);
  const arc = widths.reduce((a, b) => a + b, 0) + GAP * (items.length - 1);

  // Walk from the low-angle end; reading direction is increasing angle.
  let cursor = (centreDeg * Math.PI) / 180 - arc / TEXT_RADIUS / 2;

  return items.map((item, i) => {
    cursor += widths[i] / 2 / TEXT_RADIUS;
    const angle = cursor;
    cursor += (widths[i] / 2 + GAP) / TEXT_RADIUS;

    return {
      char: item.meshKey,
      colour: item.colour,
      kind: item.kind,
      angle,
      position: [BACK_RADIUS * Math.cos(angle), 0, -BACK_RADIUS * Math.sin(angle)],
      rotationY: angle + Math.PI / 2,
    };
  });
}

/**
 * Lay a name out around the collar. Unsupported characters are dropped.
 * Thin wrapper around layoutCharms for letters-only callers.
 */
export function layoutName(name: string, centreDeg = CENTRE_DEG): PlacedCharm[] {
  const chars = [...name.toUpperCase()].filter(isCharmable);
  return layoutCharms(
    chars.map((c) => ({ meshKey: c, colour: '', kind: 'letter' as const })),
    centreDeg,
  );
}

/**
 * True if the laid-out name stays clear of the buckle and D-ring.
 *
 * Checks the name's actual angular SPAN, not just its arc length: the name is
 * centred on 140deg while the free arc (20..290deg) is centred on 155deg, so a
 * name can be short enough to "fit" numerically yet still overrun the low end
 * and collide with the hardware.
 */
export function fitsOnCollar(name: string, centreDeg = CENTRE_DEG): boolean {
  const placed = layoutName(name, centreDeg);
  if (placed.length === 0) return true;

  const halfArc = (c: PlacedCharm) => CHARM_WIDTHS[c.char] / 2 / TEXT_RADIUS;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const first = placed[0];
  const last = placed[placed.length - 1];
  const startDeg = toDeg(first.angle - halfArc(first));
  const endDeg = toDeg(last.angle + halfArc(last));

  return startDeg >= FREE_ARC_DEG[0] && endDeg <= FREE_ARC_DEG[1];
}

export const DEFAULT_STRAP_COLOUR = "#27394D"; // Navy
/** Deliberately not the default strap colour, or the charms vanish into the strap. */
export const DEFAULT_CHARM_COLOUR = "#F2C149"; // Yellow

/** Every real collar photographs with silver hardware; the real store has no hardware-colour option. */
export const HARDWARE_COLOUR = "#EFF0F2";

/**
 * Roughness/metalness come straight from the Blender Principled BSDFs.
 *
 * envMapIntensity is the important one. The swatch hexes are sampled from product
 * PHOTOS, so they already contain studio lighting; lighting them again with a
 * bright HDRI washes the pastels out to near-white. But the hardware is
 * metalness 1.0 -- a metal shows nothing except what it reflects, so dimming the
 * environment globally turns the buckle black. So the two are decoupled: the
 * strap and charms barely see the environment (they're lit by the lights in the
 * scene), while the hardware sees it fully and stays bright metal.
 */
export const MATERIAL_DEFAULTS = {
  strap: { roughness: 0.45, metalness: 0.0, envMapIntensity: 0.35 },
  hardware: { roughness: 0.3, metalness: 0.75, envMapIntensity: 1.4 },
  charm: { roughness: 0.92, metalness: 0.0, envMapIntensity: 0.35 },
} as const;
