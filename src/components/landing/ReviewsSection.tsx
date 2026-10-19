'use client';

import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionCta } from '@/components/landing/SectionCta';
import { ReviewStars } from '@/components/storefront/TestimonialCard';
import { DisplayHeading } from '@/components/storefront/Typography';
import { REVIEWS, getReviewSummary } from '@/lib/reviews';

/** Social proof ahead of the buy card: rating summary, one featured review and two supporting ones. */
export function ReviewsSection() {
  const t = useTranslations('landing.reviews');
  const tPdp = useTranslations('products.pdp');
  const summary = getReviewSummary();
  const [featured, ...others] = REVIEWS;

  if (!featured || !summary) return null;

  return (
    <section className="bg-cream px-4 pb-0 pt-16 md:px-6 md:pt-24">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-10 md:gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-bark/5 py-1.5 pl-2.5 pr-3 text-bark">
            <ReviewStars rating={summary.rating} className="gap-[2px]" />
            <span className="text-[13px] font-semibold leading-none">
              {tPdp('reviewCountLabel', { rating: summary.rating.toFixed(1), count: summary.count })}
            </span>
          </div>
          <DisplayHeading as="h2" size="section" className="max-w-[560px] text-bark">
            {t('heading')}
          </DisplayHeading>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <figure data-animate="card" className="m-0 flex flex-col justify-between gap-10 rounded-[28px] bg-sage/25 p-7 md:p-10">
            <Quote aria-hidden="true" className="h-9 w-9 text-interactive-text/60" strokeWidth={1.5} />
            <blockquote className="m-0 font-display text-[26px] leading-[1.25] tracking-[-0.01em] text-bark md:text-[34px]">
              {featured.quote}
            </blockquote>
            <figcaption className="text-sm font-semibold text-bark-light">{featured.author}</figcaption>
          </figure>

          <div className="flex flex-col gap-4">
            {others.map((review) => (
              <figure key={review.author} data-animate="card" className="m-0 flex flex-1 flex-col justify-between gap-6 rounded-[28px] bg-white p-7 ring-1 ring-bark/[0.06]">
                <blockquote className="m-0 text-[16px] leading-relaxed text-bark">{review.quote}</blockquote>
                <figcaption className="text-sm font-semibold text-bark-muted">{review.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <SectionCta location="reviews" />
        </div>
      </div>
    </section>
  );
}
