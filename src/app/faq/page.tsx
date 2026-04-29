'use client';

import { useRouter } from 'next/navigation';
import { useCartCount } from '@/hooks/useCartCount';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/storefront/PageHero';
import { DisplayHeading } from '@/components/storefront/Typography';

const PRODUCT_FAQS: AccordionItem[] = [
  {
    id: 'waterproof',
    title: 'Ar PawCharms antkakliai yra atsparūs vandeniui?',
    content:
      'Taip. Visi PawCharms antkakliai pagaminti iš maistinio silikono, todėl puikiai tinka maudynėms, lietui ir purviniems pasivaikščiojimams. Medžiaga nesugeria kvapų ar dėmių.',
  },
  {
    id: 'charms',
    title: 'Kaip veikia keičiami pakabukai?',
    content:
      'Kiekvienas pakabukas turi prisegamą jungtį, kuri užsisega ir nusiima maždaug per 5 sekundes. Jokų įrankių ir jokio vargo. Galite laisvai derinti visus 12 dizainų prie bet kurio PawCharms antkaklio.',
  },
  {
    id: 'size',
    title: 'Kaip pasirinkti tinkamą antkaklio dydį?',
    content:
      'Išmatuokite plačiausią šuns kaklo vietą ir patogumui pridėkite 2–3 cm. XS tinka 20–28 cm, S tinka 28–36 cm, M tinka 36–44 cm, o L tinka 44–54 cm. Jei šuo tarp dydžių, rinkitės didesnį.',
  },
  {
    id: 'engrave',
    title: 'Ar galiu išgraviruoti savo šuns vardą ant antkaklio?',
    content:
      'Taip — personalizuotas graviravimas galimas atsiskaitymo metu. Galite pridėti vardą, trumpą žinutę arba telefono numerį saugumui. Graviravimas lazeriu atliekamas tiesiai silikone.',
  },
  {
    id: 'origin',
    title: 'Kur gaminami PawCharms antkakliai?',
    content:
      'Kiekvienas antkaklis kuriamas ir gaminamas rankomis Vilniuje, Lietuvoje. Esame maža komanda, todėl kiekvienas užsakymas ruošiamas kruopščiai.',
  },
  {
    id: 'durability',
    title: 'Kiek patvari silikoninė medžiaga?',
    content:
      'PawCharms antkakliai sukurti ilgam. Maistinis silikonas atsparus UV spinduliams, sūriam vandeniui, chlorui ir kasdieniam nešiojimui. Jis netrūkinėja ir nenusibraukia taip greitai kaip įprastos medžiagos.',
  },
  {
    id: 'charm-compatibility',
    title: 'Ar pakabukai tinka visiems antkaklių dydžiams?',
    content:
      'Taip — visi PawCharms pakabukai turi universalią prisegamą jungtį, todėl tinka visiems antkaklių dydžiams nuo XS iki L.',
  },
];

const ORDERS_FAQS: AccordionItem[] = [
  {
    id: 'shipping-time',
    title: 'Kiek laiko trunka pristatymas?',
    content:
      'Standartinis pristatymas Lietuvoje trunka 1–3 darbo dienas. Į ES šalis siuntos paprastai keliauja 3–7 darbo dienas. Užsakymai išsiunčiami kitą darbo dieną po apmokėjimo.',
  },
  {
    id: 'returns',
    title: 'Kokia jūsų grąžinimo politika?',
    content:
      'Grąžinimus priimame per 30 dienų nuo pristatymo, jei prekė nenaudota ir originalioje pakuotėje. Personalizuoti užsakymai negrąžinami, nebent prekė brokuota.',
  },
  {
    id: 'gift-wrapping',
    title: 'Ar siūlote dovanų pakavimą?',
    content:
      'Taip. Pasirinkite dovanų pakavimą atsiskaitymo metu, ir užsakymą supakuosime į mūsų firminę dėžutę su juostele bei ranka rašyta kortele.',
  },
];

export default function FaqPage() {
  const router = useRouter();
  const cartCount = useCartCount();

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <PageHero
        centered
        className="px-5 pb-[60px] pt-[120px] md:px-10 md:pb-[80px]"
        eyebrow='FAQ'
        title='Turite klausimų?'
        description='Viskas, ką verta žinoti apie PawCharms antkaklius, pakabukus ir užsakymus. Neradote atsakymo? Parašykite mums.'
      />

      {/* FAQ columns */}
      <section className="max-w-[1120px] mx-auto px-5 md:px-10 pb-[60px] md:pb-[100px]">
        {/* Single column on mobile, two columns on desktop */}
        <div className="block md:grid md:grid-cols-2 md:gap-16 md:items-start">
          <CategoryBlock
            id="products"
            title="Produktai"
            accent="var(--color-sage)"
            items={PRODUCT_FAQS}
          />
          <div className="h-12 md:hidden" />
          <CategoryBlock
            id="orders"
            title="Užsakymai ir pristatymas"
            accent="var(--color-sage)"
            items={ORDERS_FAQS}
          />
        </div>
      </section>

      {/* Bottom CTA band */}
      <section
        className="px-5 md:px-10 py-[60px] md:py-[80px] text-center"
        style={{ background: 'var(--color-bark)' }}
      >
        <p
          className="text-[22px] md:text-[28px] mb-2"
          style={{ color: 'var(--color-sage)', fontFamily: "'Caveat', cursive", letterSpacing: '0.01em' }}
        >
          Dar abejojate?
        </p>
        <DisplayHeading as='h2' size='section' className="mb-6 text-cream">
          Mielai padėsime.
        </DisplayHeading>
        <Button asChild variant='sage' size='pill-lg'>
          <a href="mailto:hello@pawcharms.lt" className="no-underline">
            Parašykite el. paštu
          </a>
        </Button>
      </section>

      <LandingFooter />
    </div>
  );
}

/* Internal helper */

interface CategoryBlockProps {
  id: string;
  title: string;
  accent: string;
  items: AccordionItem[];
}

function CategoryBlock({ id, title, accent, items }: CategoryBlockProps) {
  return (
    <div id={id}>
      <div className="mb-8">
        <DisplayHeading size='compact' className='mb-2'>{title}</DisplayHeading>
        <div
          className="w-10 h-[3px] rounded-[2px]"
          style={{ background: accent }}
        />
      </div>

      <Accordion items={items} isMobile={false} />
    </div>
  );
}
