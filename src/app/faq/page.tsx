'use client';

import { useRouter } from 'next/navigation';
import { useCartCount } from '@/hooks/useCartCount';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';

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

      {/* Hero */}
      <section className="pt-[120px] pb-[60px] md:pb-[80px] px-5 md:px-10 text-center">
        <div className="max-w-[640px] mx-auto">
          {/* Section label */}
          <span
            className="inline-block text-[11px] font-medium tracking-[0.08em] uppercase opacity-50 mb-4"
            style={{ color: 'var(--color-bark)' }}
          >
            FAQ
          </span>

          {/* Heading */}
          <h1
            className="text-[48px] md:text-[72px] font-normal leading-[1.05] mb-5"
            style={{ color: 'var(--color-bark)', letterSpacing: '-0.03em', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
          >
            Turite klausimų?
          </h1>

          {/* Subtext */}
          <p
            className="text-[16px] md:text-[18px] opacity-65 leading-relaxed m-0"
            style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Viskas, ką verta žinoti apie PawCharms antkaklius, pakabukus ir
            užsakymus. Neradote atsakymo?{' '}
            <a
              href="mailto:hello@pawcharms.lt"
              className="underline underline-offset-[3px]"
              style={{ color: 'var(--color-bark)' }}
            >
              Parašykite mums.
            </a>
          </p>
        </div>
      </section>

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
        <h2
          className="font-normal mb-6"
          style={{ color: 'var(--color-cream)', fontSize: 'clamp(32px, 5vw, 44px)', letterSpacing: '-0.03em', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
        >
          Mielai padėsime.
        </h2>
        <a
          href="mailto:hello@pawcharms.lt"
          className="inline-block font-bold text-[15px] tracking-[0.04em] uppercase no-underline px-8 py-[14px] rounded-full"
          style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Parašykite el. paštu
        </a>
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
        <h2
          className="text-[22px] md:text-[26px] font-normal mb-2"
          style={{ color: 'var(--color-bark)', letterSpacing: '-0.03em', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
        >
          {title}
        </h2>
        <div
          className="w-10 h-[3px] rounded-[2px]"
          style={{ background: accent }}
        />
      </div>

      <Accordion items={items} isMobile={false} />
    </div>
  );
}
