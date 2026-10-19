'use client'

import Image from 'next/image'
import { Check, X, PawPrint } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DisplayHeading, BodyCopy, Eyebrow } from '@/components/storefront/Typography'

interface ComparisonRow {
  pawcharms: string
  competitor: string
}

export function ComparisonTable () {
  const t = useTranslations('products.pdp.comparison')
  const rows = t.raw('rows') as ComparisonRow[]

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
          <Eyebrow className="w-fit rounded-full bg-bark/5 px-3 py-1.5 leading-none text-bark-light">{t('eyebrow')}</Eyebrow>
          <DisplayHeading size="section" className="max-w-[560px] text-bark">
            {t('title')}
          </DisplayHeading>
          <BodyCopy className="max-w-[480px]">
            {t('description')}
          </BodyCopy>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* PawsCharm column — the hero side, tinted and slightly larger */}
          <div className="relative flex flex-col gap-6 rounded-[28px] bg-sage/20 p-7 md:p-9">
            <div className="flex items-center gap-2 self-start rounded-full bg-sage px-4 py-2">
              <PawPrint size={16} strokeWidth={2.5} className="text-bark" />
              <span className="font-display text-lg tracking-wide text-bark">{t('brandLabel')}</span>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-[170px] w-[230px] rotate-6 md:right-6 md:top-2 md:h-[250px] md:w-[330px]">
              <Image
                src="/hero-figma/bento-collar-charm.png"
                alt=""
                fill
                sizes="330px"
                className="object-contain"
              />
            </div>

            <div className="h-28 md:h-44" />

            <ul className="m-0 mt-auto flex list-none flex-col p-0">
              {rows.map((row) => (
                <li key={row.pawcharms} className="flex items-start gap-3 border-t border-bark/10 py-3.5 first:border-t-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bark text-cream">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="font-sans text-[15px] font-medium text-bark">{row.pawcharms}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor column */}
          <div className="relative flex flex-col gap-6 rounded-[28px] bg-surface-2 p-7 md:p-9">
            <span className="absolute -left-[26px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-bark font-display text-xs tracking-wide text-cream md:flex">
              VS
            </span>
            <div className="self-start rounded-full bg-white px-4 py-2">
              <span className="font-display text-lg tracking-wide text-bark-muted">{t('competitorLabel')}</span>
            </div>

            <ul className="m-0 mt-auto flex list-none flex-col p-0">
              {rows.map((row) => (
                <li key={row.competitor} className="flex items-start gap-3 border-t border-bark/10 py-3.5 first:border-t-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bark/10 text-bark-muted">
                    <X size={12} strokeWidth={3} />
                  </span>
                  <span className="font-sans text-[15px] font-medium text-bark-muted">{row.competitor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
