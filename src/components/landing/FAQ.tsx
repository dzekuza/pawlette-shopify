'use client';

import { Accordion } from '@/components/shared/Accordion';
import type { AccordionItem } from '@/components/shared/Accordion';

const FAQS: AccordionItem[] = [
  {
    id: 'waterproof',
    title: 'Are PawCharms collars waterproof?',
    content: 'Yes. All Žavesys collars are made from food-grade silicone — fully waterproof and safe for swimming, rain, and muddy walks. The material does not absorb odours or stains.',
  },
  {
    id: 'charms',
    title: 'How do the swap charms work?',
    content: 'Each charm uses a snap connector that clicks on and off in around 5 seconds — no tools, no fiddling. You can mix and match all 12 charm designs freely between collars.',
  },
  {
    id: 'size',
    title: 'How do I choose the right collar size?',
    content: "Measure around the widest part of your dog's neck and add 2–3 cm for comfort. XS fits 20–28 cm, S fits 28–36 cm, M fits 36–44 cm, and L fits 44–54 cm.",
  },
  {
    id: 'engrave',
    title: "Can I engrave my dog's name on the collar?",
    content: "Yes — personalised engraving is available at checkout. You can add your dog's name, a short message, or a phone number for safety.",
  },
  {
    id: 'origin',
    title: 'Where are PawCharms collars made?',
    content: "Every collar is designed and handcrafted in Vilnius, Lithuania. We're a small team and each order is made with care.",
  },
];

export function FAQ() {
  return (
    <section className="bg-cream px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-[720px] mx-auto">
        <h2 className="font-sans text-[28px] md:text-[36px] font-medium text-bark tracking-tight mb-12 mt-0">
          Common questions
        </h2>
        <Accordion items={FAQS} />
      </div>
    </section>
  );
}
