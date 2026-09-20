'use client'

import { useTranslations } from 'next-intl'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'
import { useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import { TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY } from '@/components/products/pdpConstants'

/** "How to measure" bottom-of-page dialog opened from the size picker. */
export function FitGuideModal() {
  const t = useTranslations('products.configurator')
  const { state: { fitGuideOpen }, actions: { closeFitGuide } } = useCollarConfiguratorContext()

  if (!fitGuideOpen) return null

  return (
        <div
          onClick={() => closeFitGuide()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 700,
            background: 'var(--color-bark-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 24,
              background: 'var(--color-cream)',
              boxShadow: '0 24px 60px rgba(61,53,48,0.18)',
              padding: '24px 22px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <Eyebrow className="font-semibold tracking-[0.1em]">{t('sizeGuide.eyebrow')}</Eyebrow>
                <DisplayHeading as="h3" size="compact" className="mt-[6px] m-0" style={{ lineHeight: 1.15, color: TEXT_PRIMARY, fontWeight: 400 }}>
                  {t('sizeGuide.title')}
                </DisplayHeading>
              </div>
              <button
                type="button"
                onClick={() => closeFitGuide()}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, lineHeight: 1, color: TEXT_MUTED, padding: 0 }}
                aria-label={t('sizeGuide.close')}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(t.raw('sizeGuide.steps') as string[]).map((step, index) => (
                <div key={step} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, alignItems: 'start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(168,213,162,0.22)', color: 'var(--color-interactive-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: TEXT_SECONDARY }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 16, background: 'var(--color-surface-2)', padding: '14px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: TEXT_PRIMARY }}>
                {t.rich('sizeGuide.tip', { strong: (chunks) => <strong>{chunks}</strong> })}
              </p>
            </div>
          </div>
        </div>
  )
}
