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
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div style={{
          maxWidth: 760,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}>
          <DisplayHeading as="h2" size="section" className="text-bark text-center">
            {t('heading')}
          </DisplayHeading>

          <div style={{ width: '100%' }}>
            <Accordion items={faqs} />
          </div>

          {cta}
        </div>
      </div>
    </section>
  );
}
