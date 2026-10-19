import Link from 'next/link'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { DisplayHeading } from '@/components/storefront/Typography'
import { cn } from '@/lib/utils'
import type { GuideFaqItem } from '@/lib/guide-schema'

export function GuideHeader ({ eyebrow, title, intro, updated }: {
  eyebrow: string
  title: string
  intro: string
  updated: string
}) {
  return (
    <header className='pt-4'>
      <p className='text-[13px] font-medium text-sage tracking-[0.08em] uppercase mb-4 mt-0'>{eyebrow}</p>
      <DisplayHeading as='h1' size='page' className='mb-5'>{title}</DisplayHeading>
      <p className='text-[17px] text-bark-light leading-[1.7] mb-4 max-w-[760px]'>{intro}</p>
      <p className='text-sm text-bark-muted mb-10'>Atnaujinta: {updated}</p>
    </header>
  )
}

export function GuideCallout ({ title, tone = 'sage', children }: {
  title: string
  tone?: 'sage' | 'blossom'
  children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-2xl px-7 py-6 mt-4', tone === 'sage' ? 'bg-sage/15' : 'bg-blossom/20')}>
      <p className='text-[15px] font-medium text-bark mb-2 mt-0'>{title}</p>
      <div className='text-sm text-bark-light leading-[1.6]'>{children}</div>
    </div>
  )
}

export function GuideSection ({ heading, children }: { heading: string, children: React.ReactNode }) {
  return (
    <section className='mt-12 max-w-[760px]'>
      <DisplayHeading as='h2' size='compact' className='mb-4'>{heading}</DisplayHeading>
      <div className='text-[16px] text-bark-light leading-[1.7] [&_p]:mt-0 [&_p]:mb-4'>{children}</div>
    </section>
  )
}

export function GuideBullets ({ items }: { items: readonly string[] }) {
  return (
    <ul className='list-disc pl-5 mb-4 flex flex-col gap-2'>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

export function GuideLink ({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className='text-interactive-text font-medium underline underline-offset-2'>
      {children}
    </Link>
  )
}

export function GuideNumberedList ({ items }: { items: readonly { title: string, text: React.ReactNode }[] }) {
  return (
    <ol className='list-none p-0 m-0 flex flex-col gap-6'>
      {items.map((item, index) => (
        <li key={item.title} className='flex gap-5'>
          <span className='shrink-0 w-9 h-9 rounded-full bg-sage flex items-center justify-center text-[15px] font-semibold text-interactive-text'>
            {index + 1}
          </span>
          <div>
            <p className='text-base font-medium text-bark my-1.5'>{item.title}</p>
            <p className='text-[15px] text-bark-light leading-[1.6] m-0'>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function GuideTable ({ headers, rows }: { headers: readonly string[], rows: readonly (readonly string[])[] }) {
  return (
    <div className='rounded-2xl overflow-x-auto border border-bark/10'>
      <table className='w-full min-w-[640px] border-collapse font-sans'>
        <thead>
          <tr className='bg-bark'>
            {headers.map((header) => (
              <th key={header} className='px-5 py-[14px] text-left text-xs font-medium text-cream tracking-[0.06em] uppercase'>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0]} className={index % 2 === 0 ? 'bg-white border-t border-bark/[0.06]' : 'bg-cream border-t border-bark/[0.06]'}>
              {row.map((cell, cellIndex) => (
                <td key={cell} className={cn('px-5 py-4 text-sm', cellIndex === 0 ? 'font-semibold text-bark' : 'text-bark-light')}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GuideFaq ({ items }: { items: readonly GuideFaqItem[] }) {
  return (
    <GuideSection heading='Dažniausi klausimai'>
      <dl className='m-0 flex flex-col gap-6'>
        {items.map((item) => (
          <div key={item.question}>
            <dt className='text-base font-medium text-bark mb-1'>{item.question}</dt>
            <dd className='m-0 text-[15px] leading-[1.6]'>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </GuideSection>
  )
}

export function GuideCta ({ title, text, href, label }: { title: string, text: string, href: string, label: string }) {
  return (
    <div className='mt-16 mb-6 p-10 bg-bark rounded-[20px] text-center'>
      <p className='text-[22px] font-medium text-cream mb-2 mt-0 tracking-[-0.01em]'>{title}</p>
      <p className='text-[15px] text-cream/60 mb-7 mt-0'>{text}</p>
      <PrimaryButton href={href} variant='sage' size='lg'>{label}</PrimaryButton>
    </div>
  )
}
