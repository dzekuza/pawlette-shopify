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
    title: 'Are Pawlette collars waterproof?',
    content:
      'Yes. All Pawlette collars are made from food-grade silicone — fully waterproof and safe for swimming, rain, and muddy walks. The material does not absorb odours or stains, so a quick rinse is all you need after a wet adventure.',
  },
  {
    id: 'charms',
    title: 'How do the swap charms work?',
    content:
      'Each charm uses a snap connector that clicks on and off in around 5 seconds — no tools, no fiddling. You can mix and match all 12 charm designs freely between any Pawlette collar.',
  },
  {
    id: 'size',
    title: 'How do I choose the right collar size?',
    content:
      "Measure around the widest part of your dog's neck and add 2–3 cm for comfort. XS fits 20–28 cm, S fits 28–36 cm, M fits 36–44 cm, and L fits 44–54 cm. If your dog is between sizes, size up.",
  },
  {
    id: 'engrave',
    title: "Can I engrave my dog's name on the collar?",
    content:
      "Yes — personalised engraving is available at checkout. You can add your dog's name, a short message, or a phone number for safety. Engraving is laser-etched directly into the silicone for a clean, permanent finish.",
  },
  {
    id: 'origin',
    title: 'Where are Pawlette collars made?',
    content:
      "Every collar is designed and handcrafted in Vilnius, Lithuania. We're a small team and each order is made with care — not mass-produced in a factory.",
  },
  {
    id: 'durability',
    title: 'How durable is the silicone material?',
    content:
      'Pawlette collars are built to last. Food-grade silicone is highly resistant to UV, saltwater, chlorine, and everyday wear. The collar will not crack, fade, or fray with regular use. We back every collar with a 12-month durability guarantee.',
  },
  {
    id: 'charm-compatibility',
    title: 'Are charms compatible with all collar sizes?',
    content:
      'Yes — all Pawlette charms use a universal snap connector that works across every collar size (XS through L). Any charm you buy today will fit any collar you buy in the future.',
  },
];

const ORDERS_FAQS: AccordionItem[] = [
  {
    id: 'shipping-time',
    title: 'How long does shipping take?',
    content:
      'Standard delivery within Lithuania takes 1–3 business days. EU shipping takes 3–7 business days. Orders are dispatched the next business day after payment is confirmed. You will receive a tracking link by email as soon as your parcel is on its way.',
  },
  {
    id: 'returns',
    title: 'What is your returns policy?',
    content:
      'We accept returns within 30 days of delivery for unused, unaltered items in their original packaging. Personalised (engraved) orders cannot be returned unless the item is faulty. To start a return, email us at hello@pawlette.lt with your order number.',
  },
  {
    id: 'gift-wrapping',
    title: 'Do you offer gift wrapping?',
    content:
      'Yes! Select "Gift wrapping" at checkout and we will pack your order in our signature kraft box with a ribbon and a handwritten note card. You can add a personal message during checkout at no extra charge. Gift wrapping costs €2.50.',
  },
];

export default function FaqPage() {
  const router = useRouter();
  const cartCount = useCartCount();

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-cream)' }}>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      {/* Hero */}
      <section className="pt-[120px] pb-12 md:pb-16 px-6 md:px-12 text-center">
        <div className="max-w-[640px] mx-auto">
          {/* Section label */}
          <span
            className="inline-block text-[12px] font-semibold tracking-[0.12em] uppercase opacity-50 mb-4"
            style={{ color: 'var(--color-bark)' }}
          >
            FAQ
          </span>

          {/* Heading */}
          <h1
            className="text-[48px] md:text-[72px] font-normal leading-[1.05] mb-5"
            style={{ color: 'var(--color-bark)', letterSpacing: '0.01em' }}
          >
            Got questions?
          </h1>

          {/* Subtext */}
          <p
            className="text-[16px] md:text-[18px] opacity-65 leading-relaxed m-0"
            style={{ color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Everything you need to know about Pawlette collars, charms, and
            orders. Can&apos;t find an answer?{' '}
            <a
              href="mailto:hello@pawlette.lt"
              className="underline underline-offset-[3px]"
              style={{ color: 'var(--color-bark)' }}
            >
              Drop us a message.
            </a>
          </p>
        </div>
      </section>

      {/* FAQ columns */}
      <section className="max-w-[1120px] mx-auto px-6 md:px-12 pb-20 md:pb-[120px]">
        {/* Single column on mobile, two columns on desktop */}
        <div className="block md:grid md:grid-cols-2 md:gap-16 md:items-start">
          <CategoryBlock
            title="Product"
            accent="var(--color-sage)"
            items={PRODUCT_FAQS}
          />
          <div className="h-12 md:hidden" />
          <CategoryBlock
            title="Orders &amp; Shipping"
            accent="var(--color-sage)"
            items={ORDERS_FAQS}
          />
        </div>
      </section>

      {/* Bottom CTA band */}
      <section
        className="px-6 md:px-12 py-12 md:py-16 text-center"
        style={{ background: 'var(--color-bark)' }}
      >
        <p
          className="text-[22px] md:text-[28px] mb-2"
          style={{ color: 'var(--color-sage)', fontFamily: "'Caveat', cursive", letterSpacing: '0.01em' }}
        >
          Still not sure?
        </p>
        <h2
          className="font-normal mb-6"
          style={{ color: 'var(--color-cream)', fontSize: 'clamp(32px, 5vw, 44px)', letterSpacing: '0.01em' }}
        >
          We&apos;re happy to help.
        </h2>
        <a
          href="mailto:hello@pawlette.lt"
          className="inline-block font-bold text-[15px] tracking-[0.04em] uppercase no-underline px-8 py-[14px] rounded-full"
          style={{ background: 'var(--color-sage)', color: 'var(--color-bark)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Email us
        </a>
      </section>

      <LandingFooter />
    </div>
  );
}

/* Internal helper */

interface CategoryBlockProps {
  title: string;
  accent: string;
  items: AccordionItem[];
}

function CategoryBlock({ title, accent, items }: CategoryBlockProps) {
  return (
    <div>
      <div className="mb-8">
        <h2
          className="text-[22px] md:text-[26px] font-normal mb-2"
          style={{ color: 'var(--color-bark)', letterSpacing: '0.01em' }}
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
