import type { Metadata } from 'next';
import { LandingPage } from '@/components/LandingPage';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Ar PawCharms antkakliai yra atsparūs vandeniui?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip. Visi Žavesys antkakliai pagaminti iš maistinio silikono, todėl yra visiškai atsparūs vandeniui ir tinkami maudynėms, lietui bei purviniems pasivaikščiojimams. Medžiaga nesugeria kvapų ir dėmių.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kaip veikia keičiami pakabukai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kiekvienas pakabukas turi prisegamą jungtį, kuri užsisega ir nusiima maždaug per 5 sekundes. Jokų įrankių ir jokio vargo. Galite laisvai derinti visus 12 dizainų tarp skirtingų antkaklių.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kaip pasirinkti tinkamą antkaklio dydį?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Išmatuokite plačiausią savo šuns kaklo vietą ir patogumui pridėkite 2–3 cm. XS tinka 20–28 cm, S tinka 28–36 cm, M tinka 36–44 cm, o L tinka 44–54 cm.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar galiu išgraviruoti savo šuns vardą ant antkaklio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip — personalizuotas graviravimas galimas atsiskaitymo metu. Galite pridėti savo šuns vardą, trumpą žinutę arba telefono numerį saugumui.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kur gaminami PawCharms antkakliai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kiekvienas antkaklis kuriamas ir gaminamas rankomis Vilniuje, Lietuvoje. Esame nedidelė komanda, todėl kiekvienas užsakymas ruošiamas itin kruopščiai.',
      },
    },
  ],
};

export const metadata: Metadata = {
  title: 'PawCharms — Rankų darbo šunų antkakliai su keičiamais pakabukais | Pagaminta Vilniuje',
  description: 'Vandeniui atsparūs, personalizuojami šunų antkakliai su per 5 sekundes keičiamais pakabukais. Rinkitės spalvą, pridėkite pakabukus, išgraviruokite vardą. Nemokamas pristatymas nuo 50 €.',
  openGraph: {
    title: 'PawCharms — Rankų darbo šunų antkakliai su keičiamais pakabukais',
    description: 'Vandeniui atsparūs šunų antkakliai su per 5 sekundes keičiamais pakabukais. Derinkite spalvas, pridėkite pakabukų, graviruokite vardą.',
    type: 'website',
    url: 'https://pawcharms.lt',
    siteName: 'PawCharms',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PawCharms — Rankų darbo šunų antkakliai su keičiamais pakabukais',
    description: 'Vandeniui atsparūs šunų antkakliai su per 5 sekundes keičiamais pakabukais. Pagaminta Vilniuje, Lietuvoje.',
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
