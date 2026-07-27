'use client';

import { useTranslations } from 'next-intl';
import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';
import { DisplayHeading } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

const FAQ_IDS = ['personalize', 'editLetter', 'letterCount', 'color', 'size'] as const;

export function FAQ({ showCta = true }: { showCta?: boolean } = {}) {
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

          {showCta && (
            <PrimaryButton href="/products" variant="sage" size="md">
              {t('shopCta')}
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
}
