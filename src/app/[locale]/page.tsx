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

  return {
    title: 'Šunų antkakliai su vardu ir keičiamais pakabukais',
    description: `Personalizuoti šunų antkakliai su vardu — vandeniui atsparūs, su keičiamais per 5 sek. pakabukais. Rinkitės spalvą, graviruokite vardą. Nemokamas pristatymas nuo ${FREE_SHIPPING_THRESHOLD_TEXT}.`,
    alternates: {
      canonical,
      languages: {
        lt: 'https://pawscharm.com',
        en: 'https://pawscharm.com/en',
        'x-default': 'https://pawscharm.com',
      },
    },
    keywords: ['šuns antkaklis', 'šunų antkakliai su vardu', 'personalizuotas šuns antkaklis su vardu', 'šunų antkakliai', 'šuns antkaklis su pakabukais', 'silikoninis antkaklis šuniui', 'PawCharms'],
    openGraph: {
      title: 'Šunų antkakliai su vardu ir keičiamais pakabukais | PawCharms',
      description: 'Personalizuoti, vandeniui atsparūs šunų antkakliai su vardu ir per 5 sekundes keičiamais pakabukais. Derinkite spalvas, pridėkite pakabukų, graviruokite vardą.',
      type: 'website',
      url: canonical,
      siteName: 'PawCharms',
      images: [{ url: '/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Šunų antkakliai su vardu ir keičiamais pakabukais | PawCharms',
      description: 'Personalizuoti, vandeniui atsparūs šunų antkakliai su vardu, keičiami per 5 sekundes. Pagaminta Vilniuje, Lietuvoje.',
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
