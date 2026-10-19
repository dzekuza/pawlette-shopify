'use client';

import { useTranslations } from 'next-intl';
import { trackGaEvent } from '@/components/shared/GoogleAnalytics';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

/** "Build your collar" button that jumps to the on-page configurator (`#customize`); `location` tags the GA click. */
export function SectionCta({ location, className }: { location: string; className?: string }) {
  const t = useTranslations('landing.sectionCta');

  return (
    <PrimaryButton
      href='#customize'
      variant='dark'
      size='lg'
      className={className}
      onClick={() => trackGaEvent('cta_click', { cta_id: `${location}_build_collar`, cta_location: location })}
    >
      {t('button')}
    </PrimaryButton>
  );
}
