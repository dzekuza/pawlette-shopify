'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Eyebrow, DisplayHeading } from '@/components/storefront/Typography'

const SHOWCASE_IMAGE = '/hero-figma/bento-collar-charm.png'

/** Inward nudge per row so the badges bow around the product instead of forming straight columns (md+). */
const LEFT_NUDGE = ['md:mr-0', 'md:mr-10', 'md:mr-0']
const RIGHT_NUDGE = ['md:ml-0', 'md:ml-10', 'md:ml-0']

function ValueBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-bark/[0.08] bg-white py-3 pl-3 pr-5 font-sans text-sm font-semibold leading-snug text-bark',
        className,
      )}
    >
      <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/60 text-interactive-text'>
        <Check className='h-3.5 w-3.5' strokeWidth={3} aria-hidden='true' />
      </span>
      {label}
    </span>
  )
}

export function ProductValueShowcase({ name }: { name: string }) {
  const t = useTranslations('products.pdp.valueShowcase')

  const labels = t.raw('values') as string[]
  const half = Math.ceil(labels.length / 2)
  const left = labels.slice(0, half)
  const right = labels.slice(half)

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
          <Eyebrow className="w-fit rounded-full bg-bark/5 px-3 py-1.5 leading-none text-bark-light">{t('eyebrow')}</Eyebrow>
          <DisplayHeading size="section" className="max-w-[560px] text-bark">
            {t('title')}
          </DisplayHeading>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">
          {/* Product with soft drifting colour behind it */}
          <div className="relative order-first mx-auto aspect-square w-full max-w-[340px] md:order-none md:w-[340px] md:col-start-2 md:row-start-1">
            <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
              <div className='animate-drift-a absolute -left-[10%] top-[5%] h-[70%] w-[70%] rounded-full bg-sky/70 blur-[60px] motion-reduce:animate-none' />
              <div className='animate-drift-b absolute -right-[5%] bottom-[0%] h-[65%] w-[65%] rounded-full bg-blossom/55 blur-[60px] motion-reduce:animate-none' />
              <div className='animate-drift-c absolute left-[25%] top-[30%] h-[50%] w-[50%] rounded-full bg-honey/60 blur-[50px] motion-reduce:animate-none' />
            </div>
            <div className='animate-levitate relative h-full w-full'>
              <Image src={SHOWCASE_IMAGE} alt={name} fill sizes='340px' className='object-contain p-6' />
            </div>
          </div>

          <ul className='m-0 flex list-none flex-col gap-4 p-0 md:col-start-1 md:row-start-1 md:items-end md:gap-6'>
            {left.map((label, i) => (
              <li key={label}><ValueBadge label={label} className={LEFT_NUDGE[i % LEFT_NUDGE.length]} /></li>
            ))}
          </ul>
          <ul className='m-0 flex list-none flex-col gap-4 p-0 md:col-start-3 md:row-start-1 md:items-start md:gap-6'>
            {right.map((label, i) => (
              <li key={label}><ValueBadge label={label} className={RIGHT_NUDGE[i % RIGHT_NUDGE.length]} /></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
