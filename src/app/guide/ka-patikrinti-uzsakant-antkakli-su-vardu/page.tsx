import type { Metadata } from 'next'
import {
  GuideCallout, GuideCta, GuideFaq, GuideHeader, GuideLink, GuideNumberedList, GuideSection, GuideTable,
} from '@/components/guide/GuideBlocks'
import { GuideLayout } from '@/components/guide/GuideLayout'
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/guide-schema'
import {
  CHECKLIST, COMPARISON_HEADERS, COMPARISON_ROWS, FAQ_ITEMS, GUIDE_DESCRIPTION, GUIDE_INTRO, GUIDE_MODIFIED,
  GUIDE_PATH, GUIDE_PUBLISHED, GUIDE_TITLE,
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

const CHECKLIST_ITEMS = CHECKLIST.map((item) => ({
  title: item.title,
  text:
    item.title === 'Dydis'
      ? <>{item.text} <GuideLink href='/guide/how-to-measure-dog-collar'>Kaip išmatuoti šunį</GuideLink>.</>
      : item.title === 'Grąžinimas ir keitimas'
        ? <>{item.text} PawsCharm sąlygas rasite <GuideLink href='/faq#orders'>DUK puslapyje</GuideLink>.</>
        : item.text,
}))

export default function OrderingChecklistGuidePage () {
  return (
    <GuideLayout schemas={SCHEMAS}>
      <GuideHeader eyebrow='Kontrolinis sąrašas' title={GUIDE_TITLE} intro={GUIDE_INTRO} updated='2026 m. spalį' />

      <GuideSection heading='10 punktų sąrašas'>
        <GuideNumberedList items={CHECKLIST_ITEMS} />
      </GuideSection>

      <GuideSection heading='Antkaklių su vardu palyginimas'>
        <p>Kaip skiriasi populiariausi variantai pagal tai, kaip pateikiamas vardas ir kaip antkaklis laikosi lauke:</p>
        <GuideTable headers={COMPARISON_HEADERS} rows={COMPARISON_ROWS} />
        <p className='text-[13px] text-bark-muted mt-3'>
          Tai bendros gairės; konkretaus gamintojo savybės gali skirtis.
        </p>
      </GuideSection>

      <div className='max-w-[760px]'>
        <GuideCallout title='Dar nesate tikri dėl pasirinkimo?'>
          <p className='m-0'>
            Perskaitykite <GuideLink href='/guide/kaip-isrinkti-antkakli-su-vardu'>kaip išsirinkti šuns antkaklį su vardu</GuideLink>
            {' '}arba palyginkite medžiagas: <GuideLink href='/guide/silicone-vs-nylon-dog-collars'>BioThane ar nailonas</GuideLink>.
          </p>
        </GuideCallout>
      </div>

      <GuideFaq items={FAQ_ITEMS} />

      <GuideCta
        title='Pasiruošę užsakyti?'
        text='Pasirinkite spalvą ir dydį, pridėkite graviravimą arba pakabukus.'
        href='/products'
        label='Kurti antkaklį →'
      />
    </GuideLayout>
  )
}
