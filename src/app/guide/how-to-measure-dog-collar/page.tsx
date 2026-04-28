import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

export const metadata: Metadata = {
  title: 'Kaip išmatuoti šunį antkakliui',
  description: 'Žingsnis po žingsnio gidas, kaip išmatuoti šuns kaklą, kad antkaklis tiktų idealiai. Su dydžių lentele ir patarimais.',
  openGraph: {
    title: 'Kaip išmatuoti šunį antkakliui',
    description: 'Tinkamą dydį pasirinkite per 5 žingsnius. Su XS, S, M ir L lentele.',
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
      text: 'XS tinka 20–28 cm, S tinka 28–36 cm, M tinka 36–44 cm, L tinka 44–54 cm. Jei šuo tarp dydžių, rinkitės didesnį.',
    },
  ],
};

const SIZES = [
  { size: 'XS', range: '20–28 cm', breeds: 'Čihuahua, toy pudelis, Jorkšyro terjeras' },
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

      <div style={{ background: '#FAF7F2', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>
        <LandingNav topOffset={0} />

        {/* Content */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '128px 24px 96px' }}>
          <div style={{ marginBottom: 24 }}>
            <Link href="/guide/silicone-vs-nylon-dog-collars" style={{ fontSize: 13, color: '#9B948F', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.01em' }}>
              Palyginti antkaklių medžiagas →
            </Link>
          </div>

          <p style={{ fontSize: 13, fontWeight: 500, color: '#A8D5A2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Dydžių gidas</p>

          <h1 style={{ fontSize: 40, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Kaip išmatuoti šunį antkakliui
          </h1>

          <p style={{ fontSize: 17, color: '#6B6560', lineHeight: 1.7, marginBottom: 48 }}>
            Gerai tinkantis antkaklis patogiai laikosi kaklo viduryje — neveržia ir nenuslysta per galvą. Šis gidas užtruks apie 2 minutes.
          </p>

          {/* Steps */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', marginBottom: 28, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>5 žingsnių matavimo gidas</h2>

          {howToSchema.step.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#A8D5A2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#2a5a25' }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#3D3530', margin: '6px 0 6px' }}>{step.name}</p>
                <p style={{ fontSize: 15, color: '#6B6560', lineHeight: 1.6, margin: 0 }}>{step.text}</p>
              </div>
            </div>
          ))}

          {/* Size chart */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', marginTop: 56, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>Dydžių lentelė</h2>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(61,53,48,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif" }}>
              <thead>
                <tr style={{ background: '#3D3530' }}>
                  {['Dydis', 'Kaklo apimtis', 'Dažnos veislės'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: '#FAF7F2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row, i) => (
                  <tr key={row.size} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAF7F2', borderTop: '1px solid rgba(61,53,48,0.06)' }}>
                    <td style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, color: '#3D3530' }}>{row.size}</td>
                    <td style={{ padding: '16px 20px', fontSize: 15, color: '#3D3530', fontWeight: 500 }}>{row.range}</td>
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
            <p style={{ fontSize: 15, fontWeight: 500, color: '#3D3530', marginBottom: 8, marginTop: 0 }}>Ką daryti, jei šuo tarp dydžių?</p>
            <p style={{ fontSize: 14, color: '#4a6b47', lineHeight: 1.6, margin: 0 }}>
              Visada rinkitės didesnį dydį. Šiek tiek didesnis antkaklis yra saugesnis ir patogesnis nei per ankštas. Visi Žavesys antkakliai turi kelias reguliavimo pozicijas.
            </p>
          </div>

          {/* The two-finger rule */}
          <div style={{ background: '#FAF0F5', borderRadius: 16, padding: '24px 28px', marginTop: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#3D3530', marginBottom: 8, marginTop: 0 }}>Dviejų pirštų taisyklė</p>
            <p style={{ fontSize: 14, color: '#6B4455', lineHeight: 1.6, margin: 0 }}>
              Užsegę antkaklį, pakiškite po juo du pirštus. Jei jie telpa patogiai, dydis tinkamas. Jei telpa trys ar daugiau, rinkitės mažesnį. Jei vos telpa vienas, antkaklis per ankštas.
            </p>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, marginBottom: 24, padding: '40px', background: '#3D3530', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 500, color: '#FAF7F2', marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em' }}>Pasiruošę kurti savo antkaklį?</p>
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
