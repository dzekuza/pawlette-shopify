/**
 * The handshake between the buckle and the letters.
 *
 * A charm may only be fitted to an unbuckled collar, so the two have to agree
 * on the order of events: unbuckle -> fit the letters -> buckle up. Rather than
 * script that with timers (which drift out of step the moment a spring is
 * retuned, or the user types again mid-flight), both sides share this one
 * mutable object and derive the sequence from it every frame:
 *
 *   - a charm that still has work to do puts its id in `busy`
 *   - the buckle stays open for exactly as long as `busy` is non-empty
 *   - a charm only moves while `open` says there is room for it to
 *
 * So the collar opens *because* a letter needs to move, and closes once the
 * last one has settled. Typing another letter mid-sequence just keeps `busy`
 * non-empty, and the collar stays open rather than clicking shut and back open.
 *
 * It lives in a ref and is written during useFrame: it must never be React
 * state, or every frame of the sequence would re-render the scene.
 */
export type Lock = {
  /** 0 = buckled shut, 1 = prong fully lifted. Written by the buckle. */
  open: number;
  /** Slot ids of charms still flying in or out. Written by each charm. */
  busy: Set<number>;
};

export const createLock = (): Lock => ({ open: 0, busy: new Set() });

/** The buckle reports how far it has swung, once per frame. */
export const reportOpen = (lock: Lock, open: number) => {
  lock.open = open;
};

/** How far the prong must be lifted before a letter will commit to the strap. */
export const OPEN_ENOUGH = 0.75;
