import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { DisplayHeading } from '@/components/storefront/Typography';

export const metadata: Metadata = {
  title: 'Kaip išmatuoti šunį antkakliui',
  description: 'Žingsnis po žingsnio gidas, kaip išmatuoti šuns kaklą, kad antkaklis tiktų idealiai. Su dydžių lentele ir patarimais.',
  alternates: { canonical: 'https://pawscharm.com/guide/how-to-measure-dog-collar' },
  openGraph: {
    title: 'Kaip išmatuoti šunį antkakliui',
    description: 'Tinkamą dydį pasirinkite per 5 žingsnius. Su S, M ir L dydžių lentele.',
    type: 'article',
    url: 'https://pawscharm.com/guide/how-to-measure-dog-collar',
    siteName: 'PawsCharm',
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Kaip išmatuoti šuns kaklą antkakliui',
  description: 'Išmatuokite šuns kaklą per 5 žingsnius ir pasirinkite tinkamą antkaklio dydį.',
  datePublished: '2026-04-26',
  dateModified: '2026-06-14',
  author: { '@type': 'Organization', name: 'PawsCharm', url: 'https://pawscharm.com' },
  publisher: { '@type': 'Organization', name: 'PawsCharm', url: 'https://pawscharm.com' },
  inLanguage: 'lt',
  totalTime: 'PT2M',
  tool: [{ '@type': 'HowToTool', name: 'Lanksti matavimo juosta (arba virvelė ir liniuotė)' }],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Pasiruoškite lanksčią matavimo juostą',
      text: 'Naudokite minkštą matavimo juostą. Jei jos neturite, tiks virvelė ir liniuotė.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Raskite plačiausią kaklo vietą',
      text: 'Dažniausiai tai kaklo vidurys — ne ties pečiais ir ne iškart po žandikauliu.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Apjuoskite ir išmatuokite',
      text: 'Juosta turi priglusti, bet neveržti. Tarp juostos ir kaklo turėtų tilpti du pirštai. Užsirašykite rezultatą centimetrais.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Patogumui pridėkite 2–3 cm',
      text: 'Galutinis antkaklio dydis turėtų būti kaklo apimtis plius 2–3 cm. Taip jis bus patogus, bet nenuslys per galvą.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Palyginkite su dydžių lentele',
      text: 'S tinka 28–36 cm, M tinka 36–44 cm, L tinka 44–52 cm. Jei šuo tarp dydžių, rinkitės didesnį.',
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Pradžia', item: 'https://pawscharm.com' },
    { '@type': 'ListItem', position: 2, name: 'Kaip išmatuoti šunį antkakliui', item: 'https://pawscharm.com/guide/how-to-measure-dog-collar' },
  ],
};

const SIZES = [
  { size: 'S',  range: '28–36 cm', breeds: 'Prancūzų buldogas, biglis, šiba inu, miniatiūrinis šnauceris' },
  { size: 'M',  range: '36–44 cm', breeds: 'Borderkolis, kokerspanielis, vipetas, basendžis' },
  { size: 'L',  range: '44–54 cm', breeds: 'Auksaspalvis retriveris, labradoras, vokiečių aviganis, haskis' },
];

export default function MeasureGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-cream min-h-dvh font-sans">
        <LandingNav topOffset={0} />

        {/* Content */}
        <main className="max-w-[1200px] mx-auto px-6 pb-24">
          <div className="mb-6">
            <Link href="/guide/silicone-vs-nylon-dog-collars" className="text-[13px] text-bark-muted no-underline font-semibold tracking-[0.01em]">
              Palyginti antkaklių medžiagas →
            </Link>
          </div>

          <p className="text-[13px] font-medium text-sage tracking-[0.08em] uppercase mb-4 mt-0">Dydžių gidas</p>

          <DisplayHeading as="h1" size="page" className="mb-5">
            Kaip išmatuoti šunį antkakliui
          </DisplayHeading>

          <p className="text-[17px] text-bark-light leading-[1.7] mb-4">
            Gerai tinkantis antkaklis patogiai laikosi kaklo viduryje — neveržia ir nenuslysta per galvą. Šis gidas užtruks apie 2 minutes.
          </p>

          <p className="text-sm text-bark-muted mb-12">
            Atnaujinta: 2026 m. birželį
          </p>

          {/* Steps */}
          <DisplayHeading as="h2" size="compact" className="mb-7">5 žingsnių matavimo gidas</DisplayHeading>

          {howToSchema.step.map((step, i) => (
            <div key={i} className="flex gap-5 mb-7">
              <div className="shrink-0 w-9 h-9 rounded-full bg-sage flex items-center justify-center text-[15px] font-semibold text-interactive-text">
                {i + 1}
              </div>
              <div>
                <p className="text-base font-medium text-bark my-1.5">{step.name}</p>
                <p className="text-[15px] text-bark-light leading-[1.6] m-0">{step.text}</p>
              </div>
            </div>
          ))}

          {/* Size chart */}
          <DisplayHeading as="h2" size="compact" className="mt-14 mb-6">Dydžių lentelė</DisplayHeading>

          <div className="rounded-2xl overflow-hidden border border-bark/10">
            <table className="w-full border-collapse font-sans">
              <thead>
                <tr className="bg-bark">
                  {['Dydis', 'Kaklo apimtis', 'Dažnos veislės'].map(h => (
                    <th key={h} className="px-5 py-[14px] text-left text-xs font-medium text-cream tracking-[0.06em] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? "bg-white border-t border-bark/[0.06]" : "bg-cream border-t border-bark/[0.06]"}>
                    <td className="px-5 py-4 text-base font-semibold text-bark">{row.size}</td>
                    <td className="px-5 py-4 text-[15px] text-bark font-medium">{row.range}</td>
                    <td className="px-5 py-4 text-sm text-bark-light">{row.breeds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[13px] text-bark-muted mt-3">
            Tai apytikslės gairės. Visada matuokite konkretų šunį — vien veislė nėra pakankamai patikimas kriterijus.
          </p>

          {/* Between sizes */}
          <div className="bg-sage/15 rounded-2xl px-7 py-6 mt-12">
            <p className="text-[15px] font-medium text-bark mb-2 mt-0">Ką daryti, jei šuo tarp dydžių?</p>
            <p className="text-sm text-interactive-text leading-[1.6] m-0">
              Visada rinkitės didesnį dydį. Šiek tiek didesnis antkaklis yra saugesnis ir patogesnis nei per ankštas. Visi PawsCharm antkakliai turi kelias reguliavimo pozicijas.
            </p>
          </div>

          {/* The two-finger rule */}
          <div className="bg-blossom/20 rounded-2xl px-7 py-6 mt-4">
            <p className="text-[15px] font-medium text-bark mb-2 mt-0">Dviejų pirštų taisyklė</p>
            <p className="text-sm text-bark-light leading-[1.6] m-0">
              Užsegę antkaklį, pakiškite po juo du pirštus. Jei jie telpa patogiai, dydis tinkamas. Jei telpa trys ar daugiau, rinkitės mažesnį. Jei vos telpa vienas, antkaklis per ankštas.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 mb-6 p-10 bg-bark rounded-[20px] text-center">
            <p className="text-[22px] font-medium text-cream mb-2 mt-0 tracking-[-0.01em]">Pasiruošę kurti savo antkaklį?</p>
            <p className="text-[15px] text-cream/60 mb-7 mt-0">Išsirinkite spalvą, pridėkite pakabukus ir konfigūratoriuje nurodykite dydį.</p>
            <PrimaryButton href="/products" variant="sage" size="lg">
              Kurti antkaklį →
            </PrimaryButton>
          </div>

        </main>

        <LandingFooter />
      </div>
    </>
  );
}
