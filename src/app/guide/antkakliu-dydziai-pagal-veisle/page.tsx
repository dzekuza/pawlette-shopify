import type { Metadata } from 'next'
import { BreedSizeTable } from '@/components/guide/BreedSizeTable'
import { GuideCallout, GuideCta, GuideFaq, GuideHeader, GuideLink } from '@/components/guide/GuideBlocks'
import { GuideLayout } from '@/components/guide/GuideLayout'
import { DisplayHeading } from '@/components/storefront/Typography'
import { BREED_NECK_SIZES, COLLAR_SIZE_RANGES } from '@/lib/data'
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/guide-schema'
import {
  BREED_GROUPS, EMBED_SNIPPET, FAQ_ITEMS, GUIDE_DESCRIPTION, GUIDE_INTRO, GUIDE_MODIFIED, GUIDE_PATH,
  GUIDE_PUBLISHED, GUIDE_TITLE,
} from './content'

const URL = `https://pawscharm.com${GUIDE_PATH}`

export const metadata: Metadata = {
  title: GUIDE_TITLE,
  description: GUIDE_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
    type: 'article',
    url: URL,
    siteName: 'PawsCharm',
    images: [{ url: '/og-image.jpg', width: 1920, height: 1080 }],
  },
}

const SCHEMAS = [
  buildArticleSchema({
    title: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
    path: GUIDE_PATH,
    published: GUIDE_PUBLISHED,
    modified: GUIDE_MODIFIED,
  }),
  buildFaqSchema(FAQ_ITEMS),
  buildBreadcrumbSchema(GUIDE_TITLE, GUIDE_PATH),
]

export default function BreedSizeGuidePage () {
  return (
    <GuideLayout schemas={SCHEMAS}>
      <GuideHeader eyebrow='Dydžių gidas' title={GUIDE_TITLE} intro={GUIDE_INTRO} updated='2026 m. spalį' />

      {/* Collar sizes at a glance */}
      <div className='grid grid-cols-3 gap-3 mb-14 max-w-[560px]'>
        {COLLAR_SIZE_RANGES.map((s) => (
          <div key={s.size} className='rounded-2xl bg-surface-2 px-4 py-4 text-center'>
            <p className='font-display text-2xl text-bark m-0'>{s.size}</p>
            <p className='text-sm text-bark-light mt-1 mb-0'>{s.min}–{s.max} cm</p>
          </div>
        ))}
      </div>

      {BREED_GROUPS.map((group) => (
        <section key={group.key} id={group.key} className='mb-14 scroll-mt-28'>
          <DisplayHeading as='h2' size='compact' className='mb-3'>{group.title}</DisplayHeading>
          <p className='text-[15px] text-bark-light leading-[1.6] mb-6 mt-0 max-w-[760px]'>{group.intro}</p>
          <BreedSizeTable breeds={BREED_NECK_SIZES.filter((b) => b.group === group.key)} />
        </section>
      ))}

      <p className='text-[13px] text-bark-muted -mt-10 mb-12 max-w-[760px]'>
        Intervalai apytiksliai ir skirti suaugusiems šunims. Patinai paprastai būna viršutinėje intervalo dalyje, patelės — apatinėje.
      </p>

      <div className='max-w-[760px]'>
        <GuideCallout title='Pirmiausia išmatuokite'>
          <p className='m-0'>
            Minkšta matavimo juosta apjuoskite plačiausią kaklo vietą taip, kad tilptų du pirštai. Visą procesą
            žingsnis po žingsnio aprašėme <GuideLink href='/guide/how-to-measure-dog-collar'>matavimo gide</GuideLink>.
          </p>
        </GuideCallout>
        <GuideCallout title='Tarp dydžių? Rinkitės didesnį' tone='blossom'>
          <p className='m-0'>
            Šiek tiek didesnis antkaklis yra saugesnis nei per ankštas. Visi PawsCharm antkakliai turi kelias reguliavimo pozicijas.
          </p>
        </GuideCallout>
      </div>

      <GuideFaq items={FAQ_ITEMS} />

      {/* Cite / embed — makes it easy for blogs, shelters and groomers to link */}
      <div className='mt-16 max-w-[760px] rounded-2xl border border-bark/10 bg-white px-7 py-6'>
        <p className='text-[15px] font-medium text-bark mb-2 mt-0'>Norite pasidalinti lentele?</p>
        <p className='text-sm text-bark-light leading-[1.6] mb-4 mt-0'>
          Prieglaudos, kirpyklos ir tinklaraščiai gali laisvai naudoti šią lentelę — tiesiog nurodykite šaltinį su nuoroda:
        </p>
        <pre className='m-0 overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 text-xs text-bark whitespace-pre-wrap break-all'>
          <code>{EMBED_SNIPPET}</code>
        </pre>
      </div>

      <GuideCta
        title='Žinote dydį?'
        text='Išsirinkite spalvą, pridėkite vardo pakabukus ir sukurkite antkaklį savo šuniui.'
        href='/products'
        label='Kurti antkaklį →'
      />
    </GuideLayout>
  )
}
