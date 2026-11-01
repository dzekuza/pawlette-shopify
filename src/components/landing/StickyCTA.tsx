'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { FREE_SHIPPING_THRESHOLD_EURO } from '@/lib/site-config';
import { localizeHref } from '@/lib/locale-path';
import { cn } from '@/lib/utils';

export function StickyCTA({ visible }: { visible: boolean }) {
  const t = useTranslations('landing.stickyCta');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const shippingCopy = tCommon('freeShipping', { threshold: FREE_SHIPPING_THRESHOLD_EURO }).toLowerCase();

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-[var(--cookie-banner-height,0px)] z-[150] transition-[transform,bottom] duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full',
        isMobile ? 'pointer-events-none' : 'border-t border-border bg-cream',
      )}
    >
      <div
        // Leave the bottom-right corner free for the voice-agent launcher (84px + 12px inset).
        className={cn(
          'pointer-events-auto mx-auto flex max-w-[1200px] items-center gap-4',
          isMobile ? 'justify-center py-3 pl-4 pr-[88px]' : 'justify-between py-3.5 pl-12 pr-[100px]',
        )}
      >
        {!isMobile && (
          <div className="flex items-center gap-4">
            <div className="flex">
              {['/charm-flower.png', '/charm-star.png', '/charm-heart.png', '/charm-paw.png'].map((src, i) => (
                <div
                  key={src}
                  className={cn('flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-cream bg-surface-2', i > 0 && '-ml-2.5')}
                >
                  <Image src={src} alt="" width={24} height={24} className="size-3/4 object-contain" />
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium text-bark">{t('productLine')}</div>
              <div className="text-xs text-bark-muted">{t('charmsIncludedLine', { shipping: shippingCopy })}</div>
            </div>
          </div>
        )}
        <div className={cn('flex items-center gap-2.5', isMobile ? 'w-full justify-center gap-2' : 'ml-auto justify-between')}>
          {!isMobile && <div className="flex items-center gap-1.5 text-xs font-medium text-interactive-text">{t('returnsBadge')}</div>}
          <PrimaryButton href={localizeHref('/products', locale as 'lt' | 'en')} variant="sage" size="md" fullWidth={isMobile}>
            {t('cta')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
