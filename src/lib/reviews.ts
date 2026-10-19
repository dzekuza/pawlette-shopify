/**
 * Customer reviews shown on the landing page and product pages — the single source of truth.
 *
 * Only add genuine, verifiable customer reviews here (copy the text as written, in the customer's
 * language). Every review UI — the rating chip, the review carousel and the landing reviews
 * section — renders only when this list has entries, and the rating and count are computed from
 * it, so nothing is ever shown that isn't a real review.
 */
export interface Review {
  /** Reviewer name as they want it shown, e.g. "Laima K." */
  author: string
  /** The review text, verbatim. */
  quote: string
  /** Star rating, 1–5. */
  rating: number
  /** ISO date the review was written, e.g. "2026-10-02". */
  date: string
}

export const REVIEWS: readonly Review[] = []

export interface ReviewSummary {
  rating: number
  count: number
}

/** Average rating and count across REVIEWS, or null when there are none. */
export function getReviewSummary (): ReviewSummary | null {
  if (REVIEWS.length === 0) return null
  const total = REVIEWS.reduce((sum, review) => sum + review.rating, 0)
  return { rating: total / REVIEWS.length, count: REVIEWS.length }
}
