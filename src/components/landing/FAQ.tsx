'use client';

import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';

const FAQS: AccordionItem[] = [
  {
    id: 'waterproof',
    title: 'Ar PawCharms antkakliai yra atsparūs vandeniui?',
    content: 'Taip. Visi Žavesys antkakliai pagaminti iš maistinio silikono, todėl visiškai tinka maudynėms, lietui ir purviniems pasivaikščiojimams. Medžiaga nesugeria kvapų ar dėmių.',
  },
  {
    id: 'charms',
    title: 'Kaip veikia keičiami pakabukai?',
    content: 'Kiekvienas pakabukas turi prisegamą jungtį, kuri užsisega ir nusiima maždaug per 5 sekundes. Jokų įrankių ir jokio vargo. Galite laisvai derinti visus 12 dizainų tarp skirtingų antkaklių.',
  },
  {
    id: 'size',
    title: 'Kaip pasirinkti tinkamą antkaklio dydį?',
    content: 'Išmatuokite plačiausią šuns kaklo vietą ir patogumui pridėkite 2–3 cm. XS tinka 20–28 cm, S tinka 28–36 cm, M tinka 36–44 cm, o L tinka 44–54 cm.',
  },
  {
    id: 'engrave',
    title: 'Ar galiu išgraviruoti savo šuns vardą ant antkaklio?',
    content: 'Taip — personalizuotas graviravimas galimas atsiskaitymo metu. Galite pridėti savo šuns vardą, trumpą žinutę arba telefono numerį saugumui.',
  },
  {
    id: 'origin',
    title: 'Kur gaminami PawCharms antkakliai?',
    content: 'Kiekvienas antkaklis kuriamas ir gaminamas rankomis Vilniuje, Lietuvoje. Esame nedidelė komanda, todėl kiekvienas užsakymas ruošiamas itin kruopščiai.',
  },
];

export function FAQ() {
  return (
    <section className="bg-cream px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-[720px] mx-auto">
        <h2 className="font-sans text-[28px] md:text-[36px] font-medium text-bark tracking-tight mb-12 mt-0">
          Dažniausi klausimai
        </h2>
        <Accordion items={FAQS} />
      </div>
    </section>
  );
}
