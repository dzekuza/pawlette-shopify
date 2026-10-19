'use client';

import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';
import { DisplayHeading } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { localizeHref } from '@/lib/locale-path';

const FAQ_IDS = ['personalize', 'editLetter', 'letterCount', 'color', 'size'] as const;

/** The "shop" call-to-action shown under the landing-page FAQ. Pass it to `<FAQ cta={…} />`. */
export function FAQShopCta() {
  const t = useTranslations('landing.faq');
  const locale = useLocale();

  return (
    <PrimaryButton href={localizeHref('/products', locale as 'lt' | 'en')} variant="sage" size="md">
      {t('shopCta')}
    </PrimaryButton>
  );
}

interface FAQProps {
  /** Optional slot rendered below the accordion (e.g. `<FAQShopCta />`). */
  cta?: ReactNode;
}

export function FAQ({ cta }: FAQProps = {}) {
  const t = useTranslations('landing.faq');

  const faqs: AccordionItem[] = FAQ_IDS.map((id) => ({
    id,
    title: t(`${id}.question`),
    content: t(`${id}.answer`),
  }));

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        {/* Heading + CTA stay in view while the answers scroll */}
        <div className="flex flex-col items-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <DisplayHeading as="h2" size="section" className="max-w-[14ch] text-bark">
            {t('heading')}
          </DisplayHeading>
          {cta}
        </div>

        <Accordion items={faqs} />
      </div>
    </section>
  );
}
