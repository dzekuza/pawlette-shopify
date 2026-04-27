import type { Metadata } from 'next';
import { LandingPage } from '@/components/LandingPage';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are PawCharms collars waterproof?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All Žavesys collars are made from food-grade silicone — fully waterproof and safe for swimming, rain, and muddy walks. The material does not absorb odours or stains.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do the swap charms work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each charm uses a snap connector that clicks on and off in around 5 seconds — no tools, no fiddling. You can mix and match all 12 charm designs freely between collars.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I choose the right collar size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Measure around the widest part of your dog's neck and add 2–3 cm for comfort. XS fits 20–28 cm, S fits 28–36 cm, M fits 36–44 cm, and L fits 44–54 cm.",
      },
    },
    {
      '@type': 'Question',
      name: "Can I engrave my dog's name on the collar?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — personalised engraving is available at checkout. You can add your dog's name, a short message, or a phone number for safety.",
      },
    },
    {
      '@type': 'Question',
      name: 'Where are PawCharms collars made?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Every collar is designed and handcrafted in Vilnius, Lithuania. We're a small team and each order is made with care.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: 'PawCharms — Handcrafted Dog Collars with Swap Charms | Made in Vilnius',
  description: 'Waterproof, customisable dog collars with 5-second swap charms. Choose your colour, add charms, engrave your dog\'s name. Free shipping over €50. Ships from Vilnius, Lithuania.',
  openGraph: {
    title: 'PawCharms — Handcrafted Dog Collars with Swap Charms',
    description: 'Waterproof dog collars with 5-second swap charms. Mix colours, add charms, engrave a name. Made in Lithuania.',
    type: 'website',
    url: 'https://pawcharms.lt',
    siteName: 'PawCharms',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PawCharms — Handcrafted Dog Collars with Swap Charms',
    description: 'Waterproof dog collars with 5-second swap charms. Made in Vilnius, Lithuania.',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingPage />
    </>
  );
}
