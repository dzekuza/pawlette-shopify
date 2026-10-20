import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GuideLayout } from '@/components/guide/GuideLayout'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

const URL = 'https://pawscharm.com/guide'
const TITLE = 'Šunų antkaklių gidai: dydis, medžiaga, vardas'
const DESCRIPTION = 'PawsCharm gidai: kaip išmatuoti šunį antkakliui, kaip išsirinkti antkaklį su vardu, BioThane ar nailonas ir ką patikrinti prieš užsakant.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | PawsCharm`,
    description: DESCRIPTION,
    type: 'website',
    url: URL,
    siteName: 'PawsCharm',
    images: [{ url: '/og-image.jpg', width: 1920, height: 1080 }],
  },
}

const GUIDES = [
  {
    href: '/guide/how-to-measure-dog-collar',
    label: 'Dydžių gidas',
    title: 'Kaip išmatuoti šunį antkakliui',
    description: 'Žingsnis po žingsnio: kaip išmatuoti šuns kaklą ir pasirinkti S, M arba L dydį.',
  },
  {
    href: '/guide/kaip-isrinkti-antkakli-su-vardu',
    label: 'Pirkimo gidas',
    title: 'Kaip išsirinkti šuns antkaklį su vardu',
    description: 'Dydis, medžiaga, vardo užrašymo būdas ir sagtis — į ką atkreipti dėmesį.',
  },
  {
    href: '/guide/silicone-vs-nylon-dog-collars',
    label: 'Medžiagos',
    title: 'BioThane ar nailonas: koks antkaklis geriau?',
    description: 'Palyginimas pagal atsparumą vandeniui, patvarumą, priežiūrą ir personalizavimą.',
  },
  {
    href: '/guide/ka-patikrinti-uzsakant-antkakli-su-vardu',
    label: 'Sąrašas',
    title: 'Ką patikrinti užsakant šuns antkaklį su vardu',
    description: 'Dešimties punktų sąrašas: dydis, medžiaga, užrašas, sagtis, pristatymas ir grąžinimas.',
  },
] as const

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: 'lt',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: GUIDES.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.title,
        url: `https://pawscharm.com${guide.href}`,
      })),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pradžia', item: 'https://pawscharm.com' },
      { '@type': 'ListItem', position: 2, name: 'Gidai', item: URL },
    ],
  },
] as const

export default function GuideIndexPage () {
  return (
    <GuideLayout schemas={schemas}>
      <div className='flex flex-col items-start gap-4 pb-12 pt-10 md:pb-16 md:pt-16'>
        <Eyebrow className='w-fit rounded-full bg-bark/5 px-3 py-1.5 leading-none text-bark-light'>Gidai</Eyebrow>
        <DisplayHeading as='h1' size='page' className='max-w-[720px] text-bark'>
          Šunų antkaklių gidai
        </DisplayHeading>
        <p className='m-0 max-w-[560px] text-[17px] leading-relaxed text-bark-light'>
          Viskas, ką verta žinoti prieš renkantis antkaklį su vardu: kaip išmatuoti šunį, kokia medžiaga tinka ir ką patikrinti prieš užsakant.
        </p>
      </div>

      <ul className='m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2'>
        {GUIDES.map((guide) => (
          <li key={guide.href}>
            <Link
              href={guide.href}
              className='group flex h-full flex-col justify-between gap-10 rounded-[28px] bg-white p-7 no-underline ring-1 ring-bark/[0.06] transition-transform duration-300 ease-out hover:-translate-y-1 md:p-9'
            >
              <div className='flex flex-col gap-3'>
                <span className='w-fit rounded-full bg-sage/25 px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.08em] text-interactive-text'>
                  {guide.label}
                </span>
                <h2 className='m-0 text-[26px] leading-[1.15] text-bark md:text-[30px]'>{guide.title}</h2>
                <p className='m-0 max-w-[44ch] text-[15px] leading-relaxed text-bark-light'>{guide.description}</p>
              </div>
              <span className='inline-flex items-center gap-2 text-sm font-semibold text-interactive-text'>
                Skaityti gidą
                <ArrowRight className='h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1' aria-hidden='true' />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className='mt-14 flex max-w-[720px] flex-col gap-4 pb-6 md:mt-20'>
        <h2 className='m-0 text-[26px] leading-[1.15] text-bark md:text-[30px]'>Kodėl verta perskaityti gidus prieš užsakant</h2>
        <p className='m-0 text-[16px] leading-relaxed text-bark-light'>
          Antkaklis su vardu gaminamas pagal jūsų užsakymą, todėl verta iš anksto apsispręsti dėl dydžio, medžiagos ir užrašo. Šie gidai padeda pasirinkti dydį pagal šuns kaklo apimtį, palyginti BioThane su nailonu ir pasitikrinti, ar nieko nepamiršote prieš apmokėdami.
        </p>
        <p className='m-0 text-[16px] leading-relaxed text-bark-light'>
          PawsCharm antkakliai gaminami iš vandeniui atsparaus BioThane, vardas graviruojamas, o pakabukai keičiami maždaug per 5 sekundes. Viską rankomis gaminame Vilniuje.
        </p>
        <p className='m-0 text-[16px] leading-relaxed text-bark-light'>
          Jau žinote, ko ieškote? Peržiūrėkite <Link href='/products' className='text-interactive-text underline'>visus antkaklius ir pakabukus</Link> arba <Link href='/pavadeliai' className='text-interactive-text underline'>BioThane pavadėlius</Link>.
        </p>
      </section>
    </GuideLayout>
  )
}
