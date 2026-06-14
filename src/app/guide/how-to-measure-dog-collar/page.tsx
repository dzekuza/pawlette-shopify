import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { DisplayHeading } from '@/components/storefront/Typography';

export const metadata: Metadata = {
  title: 'Kaip išmatuoti šunį antkakliui',
  description: 'Žingsnis po žingsnio gidas, kaip išmatuoti šuns kaklą, kad antkaklis tiktų idealiai. Su dydžių lentele ir patarimais.',
  alternates: { canonical: 'https://pawcharms.lt/guide/how-to-measure-dog-collar' },
  openGraph: {
    title: 'Kaip išmatuoti šunį antkakliui',
    description: 'Tinkamą dydį pasirinkite per 5 žingsnius. Su S, M ir L dydžių lentele.',
    type: 'article',
    url: 'https://pawcharms.lt/guide/how-to-measure-dog-collar',
    siteName: 'PawCharms',
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Kaip išmatuoti šuns kaklą antkakliui',
  description: 'Išmatuokite šuns kaklą per 5 žingsnius ir pasirinkite tinkamą antkaklio dydį.',
  datePublished: '2026-04-26',
  dateModified: '2026-06-14',
  author: { '@type': 'Organization', name: 'PawCharms', url: 'https://pawcharms.lt' },
  publisher: { '@type': 'Organization', name: 'PawCharms', url: 'https://pawcharms.lt' },
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
    { '@type': 'ListItem', position: 1, name: 'Pradžia', item: 'https://pawcharms.lt' },
    { '@type': 'ListItem', position: 2, name: 'Gidai', item: 'https://pawcharms.lt/guide' },
    { '@type': 'ListItem', position: 3, name: 'Kaip išmatuoti šunį antkakliui', item: 'https://pawcharms.lt/guide/how-to-measure-dog-collar' },
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

      <div style={{ background: 'var(--color-cream)', minHeight: '100dvh', fontFamily: "'DM Sans',sans-serif" }}>
        <LandingNav topOffset={0} />

        {/* Content */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '128px 24px 96px' }}>
          <div style={{ marginBottom: 24 }}>
            <Link href="/guide/silicone-vs-nylon-dog-collars" style={{ fontSize: 13, color: '#9B948F', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.01em' }}>
              Palyginti antkaklių medžiagas →
            </Link>
          </div>

          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-sage)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Dydžių gidas</p>

          <DisplayHeading as="h1" size="page" style={{ marginBottom: 20 }}>
            Kaip išmatuoti šunį antkakliui
          </DisplayHeading>

          <p style={{ fontSize: 17, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Gerai tinkantis antkaklis patogiai laikosi kaklo viduryje — neveržia ir nenuslysta per galvą. Šis gidas užtruks apie 2 minutes.
          </p>

          <p style={{ fontSize: 14, color: '#9B948F', marginBottom: 48 }}>
            Atnaujinta: 2026 m. birželį
          </p>

          {/* Steps */}
          <DisplayHeading as="h2" size="compact" style={{ marginBottom: 28 }}>5 žingsnių matavimo gidas</DisplayHeading>

          {howToSchema.step.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#2a5a25' }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-bark)', margin: '6px 0 6px' }}>{step.name}</p>
                <p style={{ fontSize: 15, color: '#6B6560', lineHeight: 1.6, margin: 0 }}>{step.text}</p>
              </div>
            </div>
          ))}

          {/* Size chart */}
          <DisplayHeading as="h2" size="compact" style={{ marginTop: 56, marginBottom: 24 }}>Dydžių lentelė</DisplayHeading>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(61,53,48,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif" }}>
              <thead>
                <tr style={{ background: 'var(--color-bark)' }}>
                  {['Dydis', 'Kaklo apimtis', 'Dažnos veislės'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--color-cream)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row, i) => (
                  <tr key={row.size} style={{ background: i % 2 === 0 ? '#FFFFFF' : 'var(--color-cream)', borderTop: '1px solid rgba(61,53,48,0.06)' }}>
                    <td style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, color: 'var(--color-bark)' }}>{row.size}</td>
                    <td style={{ padding: '16px 20px', fontSize: 15, color: 'var(--color-bark)', fontWeight: 500 }}>{row.range}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#6B6560' }}>{row.breeds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 13, color: '#9B948F', marginTop: 12 }}>
            Tai apytikslės gairės. Visada matuokite konkretų šunį — vien veislė nėra pakankamai patikimas kriterijus.
          </p>

          {/* Between sizes */}
          <div style={{ background: '#EEF5EE', borderRadius: 16, padding: '24px 28px', marginTop: 48 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-bark)', marginBottom: 8, marginTop: 0 }}>Ką daryti, jei šuo tarp dydžių?</p>
            <p style={{ fontSize: 14, color: '#4a6b47', lineHeight: 1.6, margin: 0 }}>
              Visada rinkitės didesnį dydį. Šiek tiek didesnis antkaklis yra saugesnis ir patogesnis nei per ankštas. Visi PawCharms antkakliai turi kelias reguliavimo pozicijas.
            </p>
          </div>

          {/* The two-finger rule */}
          <div style={{ background: '#FAF0F5', borderRadius: 16, padding: '24px 28px', marginTop: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-bark)', marginBottom: 8, marginTop: 0 }}>Dviejų pirštų taisyklė</p>
            <p style={{ fontSize: 14, color: '#6B4455', lineHeight: 1.6, margin: 0 }}>
              Užsegę antkaklį, pakiškite po juo du pirštus. Jei jie telpa patogiai, dydis tinkamas. Jei telpa trys ar daugiau, rinkitės mažesnį. Jei vos telpa vienas, antkaklis per ankštas.
            </p>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, marginBottom: 24, padding: '40px', background: 'var(--color-bark)', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-cream)', marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em' }}>Pasiruošę kurti savo antkaklį?</p>
            <p style={{ fontSize: 15, color: 'rgba(250,247,242,0.6)', marginBottom: 28, marginTop: 0 }}>Išsirinkite spalvą, pridėkite pakabukus ir konfigūratoriuje nurodykite dydį.</p>
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
