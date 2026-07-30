'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Eyebrow } from '@/components/storefront/Typography'
import { DisplayHeading } from '@/components/storefront/Typography'

interface ShowcaseValue {
  label: string
  side: 'left' | 'right'
}

function ValueBadge({ value, isLast }: { value: ShowcaseValue; isLast: boolean }) {
  return (
    <div className="flex items-center justify-center">
      <span className="rounded-2xl border border-border bg-white px-4 py-3 text-center font-sans text-sm font-semibold leading-snug text-bark shadow-[0_6px_20px_rgba(61,53,48,0.08)]">
        {value.label}
        {isLast ? null : <span className="sr-only"> · </span>}
      </span>
    </div>
  )
}

const SHOWCASE_IMAGE = '/hero-figma/bento-collar-charm.png'

export function ProductValueShowcase({ name }: { name: string }) {
  const t = useTranslations('products.pdp.valueShowcase')
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 768

  const labels = t.raw('values') as string[]
  const half = Math.ceil(labels.length / 2)
  const values: ShowcaseValue[] = labels.map((label, i) => ({ label, side: i < half ? 'left' : 'right' }))
  const left = values.filter((v) => v.side === 'left')
  const right = values.filter((v) => v.side === 'right')

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <Eyebrow className="mb-3">{t('eyebrow')}</Eyebrow>
          <DisplayHeading size="section" className="max-w-[560px] text-bark">
            {t('title')}
          </DisplayHeading>
        </div>

        {isMobile ? (
          <div className="flex flex-col items-center gap-6">
            <div className="animate-levitate relative aspect-square w-full max-w-[400px] overflow-hidden rounded-[28px]">
              <Image src={SHOWCASE_IMAGE} alt={name} fill sizes="400px" className="object-contain p-6" />
            </div>
            <div className="grid w-full grid-cols-2 gap-3">
              {values.map((value, i) => (
                <span
                  key={value.label}
                  className="rounded-2xl border border-border bg-white px-3 py-3 text-center font-sans text-xs font-semibold leading-snug text-bark shadow-[0_6px_20px_rgba(61,53,48,0.08)]"
                >
                  {value.label}
                  {i < values.length - 1 ? <span className="sr-only"> · </span> : null}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10">
            <div className="flex flex-col gap-8">
              {left.map((value, i) => (
                <ValueBadge key={value.label} value={value} isLast={i === left.length - 1} />
              ))}
            </div>

            <div className="animate-levitate relative aspect-square w-[340px] overflow-hidden rounded-[32px]">
              <Image src={SHOWCASE_IMAGE} alt={name} fill sizes="340px" className="object-contain p-8" />
            </div>

            <div className="flex flex-col gap-8">
              {right.map((value, i) => (
                <ValueBadge key={value.label} value={value} isLast={i === right.length - 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
