import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dažniausiai užduodami klausimai apie šunų antkaklius',
  description: 'Dažniausiai užduodami klausimai apie PawCharms antkaklius, pakabukus, pristatymą ir grąžinimą.',
  alternates: { canonical: 'https://pawcharms.lt/faq' },
  openGraph: {
    title: 'Dažniausiai užduodami klausimai | PawCharms',
    description: 'Dažniausiai užduodami klausimai apie PawCharms antkaklius, pakabukus, pristatymą ir grąžinimą.',
    type: 'website',
    url: 'https://pawcharms.lt/faq',
    siteName: 'PawCharms',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Ar PawCharms antkakliai yra atsparūs vandeniui?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip. Visi PawCharms antkakliai pagaminti iš maistinio silikono, todėl puikiai tinka maudynėms, lietui ir purviniems pasivaikščiojimams. Medžiaga nesugeria kvapų ar dėmių.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kaip veikia keičiami pakabukai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kiekvienas pakabukas turi prisegamą jungtį, kuri užsisega ir nusiima maždaug per 5 sekundes. Jokų įrankių ir jokio vargo. Galite laisvai derinti visus 12 dizainų prie bet kurio PawCharms antkaklio.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kaip pasirinkti tinkamą antkaklio dydį?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Išmatuokite plačiausią šuns kaklo vietą ir patogumui pridėkite 2–3 cm. S tinka 28–36 cm, M tinka 36–44 cm, o L tinka 44–52 cm. Jei šuo tarp dydžių, rinkitės didesnį.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar galiu išgraviruoti savo šuns vardą ant antkaklio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip — personalizuotas graviravimas galimas atsiskaitymo metu. Galite pridėti vardą, trumpą žinutę arba telefono numerį saugumui. Graviravimas lazeriu atliekamas tiesiai silikone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kur gaminami PawCharms antkakliai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kiekvienas antkaklis kuriamas ir gaminamas rankomis Vilniuje, Lietuvoje. Esame maža komanda, todėl kiekvienas užsakymas ruošiamas kruopščiai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kiek patvari silikoninė medžiaga?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PawCharms antkakliai sukurti ilgam. Maistinis silikonas atsparus UV spinduliams, sūriam vandeniui, chlorui ir kasdieniam nešiojimui. Jis netrūkinėja ir nenusibraukia taip greitai kaip įprastos medžiagos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar pakabukai tinka visiems antkaklių dydžiams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip — visi PawCharms pakabukai turi universalią prisegamą jungtį, todėl tinka visiems antkaklių dydžiams nuo S iki L.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kiek laiko trunka pristatymas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standartinis pristatymas Lietuvoje trunka 1–3 darbo dienas. Į ES šalis siuntos paprastai keliauja 3–7 darbo dienas. Užsakymai išsiunčiami kitą darbo dieną po apmokėjimo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kokia jūsų grąžinimo politika?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Grąžinimus priimame per 30 dienų nuo pristatymo, jei prekė nenaudota ir originalioje pakuotėje. Personalizuoti užsakymai negrąžinami, nebent prekė brokuota.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ar siūlote dovanų pakavimą?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taip. Pasirinkite dovanų pakavimą atsiskaitymo metu, ir užsakymą supakuosime į mūsų firminę dėžutę su juostele bei ranka rašyta kortele.',
      },
    },
  ],
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
