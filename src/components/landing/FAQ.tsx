'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';
import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';
import Link from 'next/link';
import { DisplayHeading } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

const FAQS: AccordionItem[] = [
  {
    id: 'delivery',
    title: 'Kiek laiko trunka pristatymas?',
    content: 'Pristatymo laikas priklauso nuo atsiuntimo būdo. Dažniausiai siuntos pasiekia per 2–4 darbo dienas. Galiu pakeisti pristatymo adresą iki, kol siunta yra paruošta siuntimui.',
  },
  {
    id: 'material',
    title: 'Iš kokio medžiagos gaminami antkakliai?',
    content: 'Visi PawCharms antkakliai pagaminti iš maistinio silikono, todėl visiškai tinka maudynėms, lietui ir purviniems pasivaikščiojimams. Medžiaga nesugeria kvapų ar dėmių.',
  },
  {
    id: 'personalize',
    title: 'Ar galima personalizuoti pakabuką?',
    content: 'Kiekvienas pakabukas turi prisegamą jungtį, kuri užsisega ir nusiima maždaug per 5 sekundes. Jokių įrankių ir jokio vargo. Galite laisvai derinti visus dizainus tarp skirtingų antkaklių.',
  },
  {
    id: 'size',
    title: 'Kaip pasirinkti teisingą antkaklio dydį?',
    content: 'Išmatuokite plačiausią šuns kaklo vietą ir patogumui pridėkite 2–3 cm. S tinka 28–36 cm, M tinka 36–44 cm, o L tinka 44–52 cm.',
  },
];

export function FAQ() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section className="bg-cream">
      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '64px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
      }}>
        {/* Heading */}
        <DisplayHeading as="h2" size="section" className="text-bark text-center">
          Turite klausimų?
        </DisplayHeading>

        {/* Accordion */}
        <div style={{ width: '100%' }}>
          <Accordion items={FAQS} />
        </div>

        {/* CTA */}
        <PrimaryButton href="/products" variant="sage" size="md">
          Apsipirkti
        </PrimaryButton>
      </div>
    </section>
  );
}
