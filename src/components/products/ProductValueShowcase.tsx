'use client'

import Image from 'next/image'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Eyebrow } from '@/components/storefront/Typography'
import { DisplayHeading } from '@/components/storefront/Typography'

interface ShowcaseValue {
  label: string
  side: 'left' | 'right'
}

const VALUES: ShowcaseValue[] = [
  { label: 'Atsparus vandeniui ir purvui', side: 'left' },
  { label: 'Pakabukus keiskite per 5 sek.', side: 'left' },
  { label: 'BioThane medžiaga, nedylanti spalva', side: 'left' },
  { label: 'Rankų darbo Lietuvoje', side: 'right' },
  { label: 'Reguliuojamas dydis šuniui augant', side: 'right' },
  { label: '30 dienų grąžinimo garantija', side: 'right' },
]

function ValueBadge({ value }: { value: ShowcaseValue }) {
  return (
    <div className="flex items-center justify-center">
      <span className="rounded-2xl border border-border bg-white px-4 py-3 text-center font-sans text-sm font-semibold leading-snug text-bark shadow-[0_6px_20px_rgba(61,53,48,0.08)]">
        {value.label}
      </span>
    </div>
  )
}

const SHOWCASE_IMAGE = '/hero-figma/bento-collar-charm.png'

export function ProductValueShowcase({ name }: { name: string }) {
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 768

  const left = VALUES.filter((v) => v.side === 'left')
  const right = VALUES.filter((v) => v.side === 'right')

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <Eyebrow className="mb-3">Kodėl verta rinktis</Eyebrow>
          <DisplayHeading size="section" className="max-w-[560px] text-bark">
            Kiekviena detalė sukurta jūsų šuniui
          </DisplayHeading>
        </div>

        {isMobile ? (
          <div className="flex flex-col items-center gap-6">
            <div className="animate-levitate relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[28px]">
              <Image src={SHOWCASE_IMAGE} alt={name} fill sizes="280px" className="object-contain p-6" />
            </div>
            <div className="grid w-full grid-cols-2 gap-3">
              {VALUES.map((value) => (
                <span
                  key={value.label}
                  className="rounded-2xl border border-border bg-white px-3 py-3 text-center font-sans text-xs font-semibold leading-snug text-bark shadow-[0_6px_20px_rgba(61,53,48,0.08)]"
                >
                  {value.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10">
            <div className="flex flex-col gap-8">
              {left.map((value) => (
                <ValueBadge key={value.label} value={value} />
              ))}
            </div>

            <div className="animate-levitate relative aspect-square w-[340px] overflow-hidden rounded-[32px]">
              <Image src={SHOWCASE_IMAGE} alt={name} fill sizes="340px" className="object-contain p-8" />
            </div>

            <div className="flex flex-col gap-8">
              {right.map((value) => (
                <ValueBadge key={value.label} value={value} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
