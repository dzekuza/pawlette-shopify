import type { Metadata } from 'next'
import {
  GuideBullets, GuideCallout, GuideCta, GuideFaq, GuideHeader, GuideLink, GuideSection,
} from '@/components/guide/GuideBlocks'
import { GuideLayout } from '@/components/guide/GuideLayout'
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/guide-schema'
import {
  FAQ_ITEMS, GUIDE_DESCRIPTION, GUIDE_INTRO, GUIDE_MODIFIED, GUIDE_PATH, GUIDE_PUBLISHED, GUIDE_TITLE,
  MATERIAL_OPTIONS, NAME_METHODS, QUICK_SUMMARY,
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

export default function ChooseCollarWithNameGuidePage () {
  return (
    <GuideLayout schemas={SCHEMAS}>
      <GuideHeader eyebrow='Pirkėjo gidas' title={GUIDE_TITLE} intro={GUIDE_INTRO} updated='2026 m. spalį' />

      <div className='max-w-[760px]'>
        <GuideCallout title='Greita santrauka'>
          <GuideBullets items={QUICK_SUMMARY} />
        </GuideCallout>
      </div>

      <GuideSection heading='1. Pirmiausia — dydis'>
        <p>
          Antkaklio dydį lemia kaklo apimtis, o ne veislė. Išmatuokite plačiausią kaklo vietą ir pridėkite 2–3 cm.
          PawsCharm antkakliai gaminami trijų dydžių, pagal antkaklio ilgį: S — 36 cm, M — 44 cm, L — 52 cm.
        </p>
        <p>
          Jei šuo tarp dydžių, rinkitės didesnį. Užsegę antkaklį, pakiškite po juo du pirštus: jei telpa patogiai,
          dydis tinkamas. Išsamiai — <GuideLink href='/guide/how-to-measure-dog-collar'>kaip išmatuoti šunį antkakliui</GuideLink>.
        </p>
      </GuideSection>

      <GuideSection heading='2. Medžiaga: atspari vandeniui ar sugerianti?'>
        <p>Antkaklis nuolat liečiasi su vandeniu, purvu ir šuns kailiu, todėl medžiaga svarbi.</p>
        <GuideBullets items={MATERIAL_OPTIONS} />
        <p>
          Daugiau apie medžiagų skirtumus — <GuideLink href='/guide/silicone-vs-nylon-dog-collars'>BioThane ar nailonas</GuideLink>.
        </p>
      </GuideSection>

      <GuideSection heading='3. Kaip bus užrašytas vardas'>
        <p>Vardą ant antkaklio galima pateikti keliais būdais:</p>
        <GuideBullets items={NAME_METHODS} />
        <p>
          PawsCharm antkakliams personalizuotas graviravimas užsakomas atsiskaitymo metu, o keičiami pakabukai
          prisegami ir nusegami maždaug per 5 sekundes be įrankių. Visus modelius rasite puslapyje{' '}
          <GuideLink href='/products'>rankų darbo antkakliai šunims</GuideLink>.
        </p>
      </GuideSection>

      <GuideSection heading='4. Ką užrašyti ant antkaklio'>
        <p>
          Svarbiausia — telefono numeris. Jei šuo pasiklystų, radėjas iškart galėtų paskambinti. Vardas patogus, bet
          nėra būtinas. PawsCharm galima užsakyti šuns vardą, trumpą žinutę arba telefono numerį.
        </p>
        <p>
          Rinkitės trumpą tekstą, kuris išliks įskaitomas. Namų adreso dažnai nerašoma, kad jo nematytų pašaliniai.
          Antkaklis su telefonu yra papildoma apsauga, bet ne mikroschemos pakaitalas.
        </p>
      </GuideSection>

      <GuideSection heading='5. Sagtis ir detalės'>
        <p>
          Patikrinkite, ar sagtis tvirtai užsifiksuoja, ar yra D formos žiedas pavadėliui ir ar antkaklį galima
          reguliuoti. Reguliuojamas antkaklis tinka ir šuniui, kuris dar auga.
        </p>
      </GuideSection>

      <GuideSection heading='6. Priežiūra'>
        <p>
          Po pasivaikščiojimo antkaklį dažniausiai pakanka nuplauti švariu vandeniu ir nušluostyti minkštu
          skudurėliu. Prieš vėl užsegdami, leiskite jam nudžiūti.
        </p>
      </GuideSection>

      <div className='max-w-[760px]'>
        <GuideCallout title='Ką patikrinti prieš užsakant' tone='blossom'>
          <p className='m-0'>
            Paruošėme dešimties punktų sąrašą:{' '}
            <GuideLink href='/guide/ka-patikrinti-uzsakant-antkakli-su-vardu'>ką patikrinti užsakant antkaklį su vardu</GuideLink>.
          </p>
        </GuideCallout>
      </div>

      <GuideFaq items={FAQ_ITEMS} />

      <GuideCta
        title='Susikurkite savo antkaklį su vardu'
        text='Pasirinkite spalvą, dydį ir pridėkite graviravimą arba pakabukus.'
        href='/products'
        label='Rankų darbo antkakliai šunims →'
      />
    </GuideLayout>
  )
}
