'use client'

import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import type { ProductDetail } from '@/lib/catalog'
import { ProductCard } from './ProductCard'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/storefront/PageHero'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Accordion } from '@/components/shared/Accordion'
import type { AccordionItem } from '@/components/shared/Accordion'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { BodyCopy, DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

interface Props {
  leashes: ProductDetail[]
}

const GRID_ID = 'pavadeliu-rinkinys'

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'length',
    title: 'Koks pavadėlio ilgis tinka mano šuniui?',
    content:
      'PawsCharm pavadėlis tinka visų dydžių šunims — nuo mažiausio iki didžiausio. Rankena ir kilpa sukurtos taip, kad pavadėlis būtų patogus laikyti tiek trumpiems, tiek ilgiems pasivaikščiojimams.',
  },
  {
    id: 'waterproof',
    title: 'Ar pavadėlis atsparus vandeniui?',
    content:
      'Taip. Pavadėlis pagamintas iš BioThane juostos, todėl atlaiko lietų, balas ir purviną žolę — pakanka nuvalyti drėgna šluoste, ir jis vėl atrodo kaip naujas.',
  },
  {
    id: 'color-match',
    title: 'Ar galima derinti pavadėlį su antkakliu pagal spalvą?',
    content:
      'Taip. Pavadėliai gaminami tomis pačiomis spalvomis kaip PawsCharm antkakliai, todėl galite lengvai suderinti visą rinkinį — antkaklį, pavadėlį ir pakabukus.',
  },
  {
    id: 'care',
    title: 'Kaip prižiūrėti BioThane pavadėlį?',
    content:
      'Priežiūra minimali — nuvalykite drėgna šluoste arba nuskalaukite po čiaupu ir leiskite išdžiūti. BioThane nereikia jokios specialios priežiūros ar impregnavimo, priešingai nei odiniams ar nailoniniams pavadėliams.',
  },
]

export function PavadeliaiPageContent ({ leashes }: Props) {
  const router = useRouter()
  const cartCount = useCartCount()
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768

  return (
    <>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px' }}>
        <PageHero
          tone='hero'
          stacked
          eyebrow='Pavadėlis šuniui'
          title='BioThane pavadėlis šuniui — rankų darbo Vilniuje'
          description='Pavadėlis šuniui, sukurtas kasdieniams pasivaikščiojimams — vandeniui atsparus, lengvai valomas ir spalvomis suderintas su PawsCharm antkakliais. Kiekvienas pavadėlis siuvamas rankomis Vilniuje iš tos pačios BioThane juostos kaip ir mūsų antkakliai, todėl atlaiko lietų, purvą ir kasdienį naudojimą. Kaip ir visi PawsCharm gaminiai, jis turi 30 dienų grąžinimo garantiją.'
        />

        <div id={GRID_ID} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leashes.map((leash) => (
            <ProductCard key={leash.id} product={leash} />
          ))}
        </div>

        {/* Material + pairing — real supporting copy for the leash landing page, not just the product grid */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-2 md:gap-14">
          <div>
            <Eyebrow className="mb-3">Medžiaga</Eyebrow>
            <DisplayHeading size="compact" className="mb-4">BioThane: patvarumas kiekvienam pasivaikščiojimui</DisplayHeading>
            <BodyCopy>
              Pavadėlis siuvamas iš BioThane juostos — vandeniui atsparios, kvapų nesugeriančios ir lengvai nuvalomos drėgna šluoste po lietaus ar purvino pasivaikščiojimo. Rankena patogi laikyti tiek trumpuose, tiek ilguose pasivaikščiojimuose. Medžiaga atspari UV spinduliams ir sūriam vandeniui, todėl pavadėlis nepraranda formos ir spalvos metų metus. Kraštai nesišerpetoja ir neirsta net intensyviai naudojant kasdien.
            </BodyCopy>
          </div>
          <div>
            <Eyebrow className="mb-3">Derinys</Eyebrow>
            <DisplayHeading size="compact" className="mb-4">Suderink pavadėlį su antkakliu pagal spalvą</DisplayHeading>
            <BodyCopy>
              PawsCharm pavadėliai gaminami tomis pačiomis spalvomis kaip ir antkakliai, todėl visą rinkinį — antkaklį, pavadėlį ir pakabukus — galite lengvai suderinti pagal savo šuns stilių. Pavadėlį rinkitės atskirai arba kaip dalį pilno rinkinio su antkakliu, kad jūsų šuo turėtų vientisą, tvarkingą išvaizdą kiekvienam pasivaikščiojimui ar nuotykiui.
            </BodyCopy>
          </div>
        </div>

        {/* FAQ — also lets the target keyword phrase appear naturally a second time */}
        <div className="mt-16 max-w-[720px] md:mt-24">
          <DisplayHeading size="compact" className="mb-6">Dažnai užduodami klausimai</DisplayHeading>
          <Accordion items={FAQ_ITEMS} isMobile={isMobile} />
        </div>
      </main>

      <section className="px-5 py-[60px] text-center bg-bark md:px-10 md:py-[80px]">
        <p className="font-handwriting text-[22px] mb-2 text-sage tracking-[0.01em] md:text-[28px]">
          Sukurta jūsų šuniui
        </p>
        <DisplayHeading as="h2" size="section" className="mb-6 text-cream">
          Pavadėlis šuniui, suderintas su jo antkakliu.
        </DisplayHeading>
        <PrimaryButton href={`#${GRID_ID}`} variant="sage" size="lg">
          Rinktis pavadėlį
        </PrimaryButton>
      </section>

      <LandingFooter />
    </>
  )
}
