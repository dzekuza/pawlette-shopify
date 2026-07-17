'use client';

import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';
import { DisplayHeading } from '@/components/storefront/Typography';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

const FAQS: AccordionItem[] = [
  {
    id: 'personalize',
    title: 'Kaip personalizuoti antkaklį?',
    content: 'Paspauskite ant pirmo laisvo langelio prie „1. Įrašykite raides" ir tiesiog pradėkite rašyti klaviatūra — pasirinkta raidė iškart atsiras pasirinktame langelyje, o kitas langelis automatiškai taps aktyvus, kad galėtumėte rašyti toliau. Taip galite iš anksto peržiūrėti, kaip atrodys jūsų šuns vardas ar norimas užrašas ant antkaklio.',
  },
  {
    id: 'edit-letter',
    title: 'Kaip pakeisti raidę?',
    content: 'Paspauskite ant norimo langelio ir įrašykite naują raidę — ji pakeis ankstesnę.',
  },
  {
    id: 'letter-count',
    title: 'Kiek raidžių galiu pridėti?',
    content: 'Galite užpildyti iki 6 langelių. 5 pakabukai yra įskaičiuoti į antkaklio kainą, o kiekvienas papildomas kainuos €3.99.',
  },
  {
    id: 'color',
    title: 'Kaip pasirinkti spalvą?',
    content: 'Pažymėkite jau įrašytą raidę, ir vėliau apačioje pasirinkite norimą spalvą.',
  },
  {
    id: 'size',
    title: 'Kaip pasirinkti tinkamą dydį?',
    content: 'Prie dydžio pasirinkimo paspauskite mygtuką „Kaip išmatuoti tinkamą dydį".',
  },
];

export function FAQ({ showCta = true }: { showCta?: boolean } = {}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div style={{
          maxWidth: 760,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}>
          <DisplayHeading as="h2" size="section" className="text-bark text-center">
            Turite klausimų?
          </DisplayHeading>

          <div style={{ width: '100%' }}>
            <Accordion items={FAQS} />
          </div>

          {showCta && (
            <PrimaryButton href="/products" variant="sage" size="md">
              Apsipirkti
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
}
