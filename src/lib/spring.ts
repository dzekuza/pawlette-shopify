/**
 * Minimal damped-spring integrator for per-frame animation in useFrame.
 *
 * Springs are used instead of fixed-duration easings because the targets move
 * mid-flight: adding a letter re-kerns the whole name, so every other charm has
 * to change course without restarting. A spring just chases whatever the
 * current target is.
 */

export type Spring = { value: number; velocity: number };

export const spring = (value: number): Spring => ({ value, velocity: 0 });

/** Fixed integration step: the motion must not depend on the display's refresh rate. */
const STEP = 1 / 120;

/** A backgrounded tab hands back a huge dt on return; anything past this is discarded. */
const MAX_DT = 0.1;

/**
 * Advance `s` towards `target` and return its new value.
 *
 * `stiffness` sets how hard it pulls, `damping` how much it resists. Under
 * 2*sqrt(stiffness) the spring overshoots and settles back — that overshoot is
 * what gives a charm its click-into-place landing.
 */
export function stepSpring(
  s: Spring,
  target: number,
  dt: number,
  stiffness: number,
  damping: number,
): number {
  let remaining = Math.min(dt, MAX_DT);
  while (remaining > 0) {
    const h = Math.min(STEP, remaining);
    remaining -= h;
    const accel = (target - s.value) * stiffness - s.velocity * damping;
    s.velocity += accel * h;
    s.value += s.velocity * h;
  }
  return s.value;
}

/** Drop a spring onto a value with no motion (reduced-motion, or a hard reset). */
export function settle(s: Spring, value: number): number {
  s.value = value;
  s.velocity = 0;
  return value;
}
