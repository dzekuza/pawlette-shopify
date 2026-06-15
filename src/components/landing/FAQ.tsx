'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';
import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';
import Link from 'next/link';

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
    <section style={{ background: 'var(--color-cream)' }}>
      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '64px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Heading */}
        <h2 style={{
          fontSize: isMobile ? 32 : 40,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          textAlign: 'center',
          margin: 0,
        }}>
          Turite klausimų?
        </h2>

        {/* Accordion */}
        <div style={{ width: '100%' }}>
          <Accordion items={FAQS} />
        </div>

        {/* CTA */}
        <Link
          href="/products"
          style={{
            display: 'inline-block',
            textAlign: 'center',
            background: 'var(--color-sage)',
            borderRadius: 100,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--color-interactive-text)',
            textDecoration: 'none',
          }}
        >
          Užsakyti iš anksto
        </Link>
      </div>
    </section>
  );
}
