import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingPage } from '@/components/LandingPage';
import { FREE_SHIPPING_THRESHOLD_TEXT } from '@/lib/site-config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === 'en' ? 'https://pawscharm.com/en' : 'https://pawscharm.com';

  const title = locale === 'en'
    ? 'Personalized Dog Collars with Name and Interchangeable Charms'
    : 'Šunų antkakliai su vardu ir keičiamais pakabukais';
  const description = locale === 'en'
    ? `Personalized dog collars with your dog's name — waterproof, with charms you can swap in 5 seconds. Choose a color, engrave the name. Free shipping over ${FREE_SHIPPING_THRESHOLD_TEXT}.`
    : `Personalizuoti šunų antkakliai su vardu — vandeniui atsparūs, su keičiamais per 5 sek. pakabukais. Rinkitės spalvą, graviruokite vardą. Nemokamas pristatymas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`;
  const ogDescription = locale === 'en'
    ? 'Personalized, waterproof dog collars with a name tag and charms you can swap in 5 seconds. Mix colors, add charms, engrave the name.'
    : 'Personalizuoti, vandeniui atsparūs šunų antkakliai su vardu ir per 5 sekundes keičiamais pakabukais. Derinkite spalvas, pridėkite pakabukų, graviruokite vardą.';
  const twitterDescription = locale === 'en'
    ? 'Personalized, waterproof dog collars with a name tag, swappable in 5 seconds. Handmade in Vilnius, Lithuania.'
    : 'Personalizuoti, vandeniui atsparūs šunų antkakliai su vardu, keičiami per 5 sekundes. Pagaminta Vilniuje, Lietuvoje.';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        lt: 'https://pawscharm.com',
        en: 'https://pawscharm.com/en',
        'x-default': 'https://pawscharm.com',
      },
    },
    keywords: locale === 'en'
      ? ['dog collar with name', 'personalized dog collar', 'custom dog collar with name tag', 'dog collars', 'dog collar with charms', 'BioThane dog collar', 'PawsCharm']
      : ['šuns antkaklis', 'šunų antkakliai su vardu', 'personalizuotas šuns antkaklis su vardu', 'šunų antkakliai', 'šuns antkaklis su pakabukais', 'BioThane antkaklis šuniui', 'PawsCharm'],
    openGraph: {
      title: `${title} | PawsCharm`,
      description: ogDescription,
      type: 'website',
      url: canonical,
      siteName: 'PawsCharm',
      images: [{ url: '/og-image.jpg', width: 1920, height: 1080 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PawsCharm`,
      description: twitterDescription,
    },
  };
}

export default async function Page() {
  const t = await getTranslations('seo.faqSchema');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('waterproof.question'),
        acceptedAnswer: { '@type': 'Answer', text: t('waterproof.answer') },
      },
      {
        '@type': 'Question',
        name: t('charms.question'),
        acceptedAnswer: { '@type': 'Answer', text: t('charms.answer') },
      },
      {
        '@type': 'Question',
        name: t('sizing.question'),
        acceptedAnswer: { '@type': 'Answer', text: t('sizing.answer') },
      },
      {
        '@type': 'Question',
        name: t('engraving.question'),
        acceptedAnswer: { '@type': 'Answer', text: t('engraving.answer') },
      },
      {
        '@type': 'Question',
        name: t('manufacturing.question'),
        acceptedAnswer: { '@type': 'Answer', text: t('manufacturing.answer') },
      },
    ],
  };

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
