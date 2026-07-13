/**
 * Stable identities for the charms on the strap.
 *
 * Rendering the laid-out name directly is enough to draw it, but not to animate
 * it: keying charms by position restarts the mount animation on every letter
 * whenever an edit shifts the indices (typing "A" in front of "ROCKY" moves all
 * five), and a deleted letter disappears the instant it leaves the name, so it
 * can never animate out.
 *
 * A slot is a charm that survives across edits. Slots are matched to the new
 * name by longest-common-subsequence, so an unchanged letter keeps its slot —
 * and its animation state — no matter how the indices moved around it.
 */

export type CharmSlot = {
  id: number;
  char: string;
  /** Position in the current layout, or null once the letter has been deleted and is animating away. */
  index: number | null;
  /** Seconds this charm waits before flying in, so a pasted name lands letter by letter. */
  delay: number;
};

let nextId = 0;

/** Longest common subsequence: which old letters (by index) map to which new ones. */
function align(a: string[], b: string[]): Map<number, number> {
  const table: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] =
        a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  // Walk the table: on a match, keep the pair; otherwise advance whichever side
  // still has the longer subsequence ahead of it.
  const pairs = new Map<number, number>(); // new index -> old index
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.set(j, i);
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return pairs;
}

/**
 * Fold the new letters into the existing slots.
 *
 * Surviving letters keep their slot and get their new index; letters that are
 * gone are kept around with `index: null` until their exit animation finishes
 * (the caller drops them with `purgeSlot`); brand-new letters get a fresh slot,
 * staggered in reading order.
 */
export function reconcileSlots(
  prev: CharmSlot[],
  chars: string[],
  stagger: number,
): CharmSlot[] {
  const live = prev.filter((s) => s.index !== null);
  const pairs = align(
    live.map((s) => s.char),
    chars,
  );

  const keptIds = new Set<number>();
  let arrivals = 0;

  const next = chars.map((char, index): CharmSlot => {
    const old = pairs.has(index) ? live[pairs.get(index)!] : undefined;
    if (old) {
      keptIds.add(old.id);
      return { ...old, index, delay: 0 };
    }
    return { id: nextId++, char, index, delay: stagger * arrivals++ };
  });

  const leaving = prev
    .filter((s) => !keptIds.has(s.id))
    .map((s): CharmSlot => ({ ...s, index: null, delay: 0 }));

  return [...next, ...leaving];
}

export const purgeSlot = (slots: CharmSlot[], id: number) =>
  slots.filter((s) => s.id !== id);
