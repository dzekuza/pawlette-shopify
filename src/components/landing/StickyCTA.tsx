'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { FREE_SHIPPING_THRESHOLD_EURO } from '@/lib/site-config';
import { localizeHref } from '@/lib/locale-path';

export function StickyCTA({ visible }: { visible: boolean }) {
  const t = useTranslations('landing.stickyCta');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;
  const shippingCopy = tCommon('freeShipping', { threshold: FREE_SHIPPING_THRESHOLD_EURO }).toLowerCase();

  return (
    <div style={{
      position: 'fixed', bottom: 'var(--cookie-banner-height, 0px)', left: 0, right: 0, zIndex: 150,
      background: 'var(--color-cream-glass)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--color-border)',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 280ms cubic-bezier(0.23, 1, 0.32, 1), bottom 200ms ease-out',
      boxShadow: '0 -4px 24px var(--color-bark-divider)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '12px 16px' : '14px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex' }}>
            {['/charm-flower.png', '/charm-star.png', '/charm-heart.png', '/charm-paw.png'].map((src, i) => (
              <div key={src} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-cream)', marginLeft: i > 0 ? -10 : 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image src={src} alt="" width={24} height={24} style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-bark)' }}>{t('productLine')}</div>
            <div style={{ fontSize: 12, color: 'var(--color-bark-muted)' }}>{t('charmsIncludedLine', { shipping: shippingCopy })}</div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'center', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto', marginLeft: isMobile ? 0 : 'auto' }}>
        {!isMobile && (
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-interactive-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {t('returnsBadge')}
          </div>
        )}
        <PrimaryButton href={localizeHref('/products', locale as 'lt' | 'en')} variant="sage" size="md">
          {t('cta')}
        </PrimaryButton>
      </div>
      </div>
    </div>
  );
}
