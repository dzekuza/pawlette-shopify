import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { PrimaryButton } from '@/components/shared/PrimaryButton';

export const metadata: Metadata = {
  title: 'Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?',
  description: 'Silikoninių ir nailoninių šunų antkaklių palyginimas pagal atsparumą vandeniui, patvarumą, patogumą, priežiūrą ir personalizavimą.',
  openGraph: {
    title: 'Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?',
    description: 'Išsamus silikoninių ir nailoninių šunų antkaklių palyginimas.',
    type: 'article',
    url: 'https://pawcharms.lt/guide/silicone-vs-nylon-dog-collars',
    siteName: 'PawCharms',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?',
  description: 'Silikoninių ir nailoninių šunų antkaklių palyginimas pagal atsparumą vandeniui, patvarumą, patogumą, priežiūrą ir personalizavimą.',
  author: { '@type': 'Organization', name: 'PawCharms' },
  publisher: {
    '@type': 'Organization',
    name: 'PawCharms',
    url: 'https://pawcharms.lt',
  },
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  url: 'https://pawcharms.lt/guide/silicone-vs-nylon-dog-collars',
};

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Silikoninių ir nailoninių šunų antkaklių palyginimas',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Product',
        name: 'Silikoninis šuns antkaklis',
        description: 'Vandeniui atsparus, kvapų nesugerianis, lengvai valomas silikoninis antkaklis su prisegamų pakabukų sistema',
        material: 'Food-grade silicone',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Product',
        name: 'Nailoninis šuns antkaklis',
        description: 'Lengvas austas nailoninis antkaklis, siūlomas įvairiais raštais',
        material: 'Nylon',
      },
    },
  ],
};

const COMPARISON = [
  {
    criterion: 'Atsparumas vandeniui',
    silicone: '✓ Visiškai atsparus vandeniui. Nesugeria vandens, purvo ar baseino chemikalų.',
    nylon: '✗ Sugerio vandenį. Po maudynių ilgai lieka drėgnas ir gali imti skleisti kvapą.',
    winner: 'silicone',
  },
  {
    criterion: 'Atsparumas kvapams',
    silicone: '✓ Neporėtas paviršius. Kvapai neįsigeria į medžiagą.',
    nylon: '✗ Pluoštai laikui bėgant kaupia bakterijas ir kvapus, ypač aktyvių šunų atveju.',
    winner: 'silicone',
  },
  {
    criterion: 'Priežiūra',
    silicone: '✓ Pakanka nuvalyti drėgna šluoste arba nuskalauti po čiaupu. Išdžiūsta per kelias sekundes.',
    nylon: '△ Reikia plauti ir visiškai išdžiovinti, kad neatsirastų nemalonus kvapas.',
    winner: 'silicone',
  },
  {
    criterion: 'Patvarumas',
    silicone: '✓ Atsparus UV spinduliams, sūriam vandeniui ir daugumai chemikalų. Neirsta.',
    nylon: '△ Kokybiškas nailonas patvarus, tačiau kraštai ilgainiui gali susidėvėti.',
    winner: 'silicone',
  },
  {
    criterion: 'Patogumas',
    silicone: '✓ Minkštas ir lankstus. Lygus paviršius nesuvelia kailio aplink kaklą.',
    nylon: '✓ Lengvas ir lankstus. Kai kuriems šunims patinka mažesnis svoris.',
    winner: 'tie',
  },
  {
    criterion: 'Personalizavimas',
    silicone: '✓ Prisegami pakabukai, spalvų pasirinkimas, graviravimas.',
    nylon: '△ Dažniausiai tik raštai. Personalizavimas ribotas.',
    winner: 'silicone',
  },
  {
    criterion: 'Kaina',
    silicone: '△ Kokybiški variantai dažniausiai kainuoja 20–45 €.',
    nylon: '✓ Platus pasirinkimas — nuo 5 € iki 30 € ir daugiau.',
    winner: 'nylon',
  },
];

export default function ComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />

      <div style={{ background: '#FAF7F2', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>
        <LandingNav topOffset={0} />

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '128px 24px 96px' }}>
          <div style={{ marginBottom: 24 }}>
            <Link href="/guide/how-to-measure-dog-collar" style={{ fontSize: 13, color: '#9B948F', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.01em' }}>
              Skaityti dydžių gidą →
            </Link>
          </div>

          <p style={{ fontSize: 13, fontWeight: 500, color: '#A8D5A2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Antkaklių gidas</p>

          <h1 style={{ fontSize: 40, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?
          </h1>

          <p style={{ fontSize: 17, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Nailonas dešimtmečius buvo įprastas šunų antkaklių pasirinkimas. Silikoniniai antkakliai yra naujesni, tačiau aktyviems šunims dažnai gerokai praktiškesni. Štai aiškus palyginimas, kad būtų lengviau apsispręsti.
          </p>

          <p style={{ fontSize: 14, color: '#9B948F', marginBottom: 48 }}>
            Atnaujinta: 2026 m. balandį
          </p>

          {/* Comparison table */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', marginBottom: 24, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>Palyginimas greta</h2>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(61,53,48,0.1)', marginBottom: 56 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif" }}>
              <thead>
                <tr style={{ background: '#3D3530' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: '#FAF7F2', letterSpacing: '0.06em', textTransform: 'uppercase', width: '22%' }}>Kriterijus</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: '#A8D5A2', letterSpacing: '0.06em', textTransform: 'uppercase', width: '39%' }}>Silikonas</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', width: '39%' }}>Nailonas</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.criterion} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAF7F2', borderTop: '1px solid rgba(61,53,48,0.06)' }}>
                    <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: '#3D3530', verticalAlign: 'top' }}>{row.criterion}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#3D5a3a', lineHeight: 1.5, verticalAlign: 'top', background: row.winner === 'silicone' ? 'rgba(168,213,162,0.1)' : 'inherit' }}>{row.silicone}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#6B6560', lineHeight: 1.5, verticalAlign: 'top', background: row.winner === 'nylon' ? 'rgba(168,213,162,0.1)' : 'inherit' }}>{row.nylon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Silicone pros/cons */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', marginBottom: 20, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>Silikoniniai antkakliai</h2>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Silikoniniai antkakliai gaminami iš maistinio silikono — tos pačios medžiagos, kuri naudojama virtuvės įrankiuose ir medicinos gaminiuose. Svarbiausias privalumas yra neporėtas paviršius: į jį neįsigeria vanduo, bakterijos ar kvapai.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            <div style={{ background: '#EEF5EE', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2a5a25', marginBottom: 12, marginTop: 0 }}>Privalumai</p>
              {['Nesugeria kvapo net dažnai maudantis', 'Nuvalomas per kelias sekundes', 'Kraštai nesišerpetoja ir neirsta', 'Atsparus UV ir sūriam vandeniui', 'Tinka prisegamiems pakabukams', 'Tinka jautriai odai'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#3D5a3a', margin: '0 0 6px', lineHeight: 1.5 }}>✓ {p}</p>
              ))}
            </div>
            <div style={{ background: '#FFF5F5', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#8B3A3A', marginBottom: 12, marginTop: 0 }}>Ribojimai</p>
              {['Didesnė pradinė kaina nei bazinio nailono', 'Mažiau raštų pasirinkimo', 'Rečiau sutinkamas pigesnėse gyvūnų prekių parduotuvėse'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#6B4040', margin: '0 0 6px', lineHeight: 1.5 }}>△ {p}</p>
              ))}
            </div>
          </div>

          {/* Nylon pros/cons */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', marginBottom: 20, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>Nailoniniai antkakliai</h2>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Nailoniniai antkakliai audžiami iš poliamido pluošto ir yra vieni plačiausiai prieinamų. Kokybė stipriai skiriasi: pigesni gali greitai irti, o sustiprintas nailonas būna labai tvirtas.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }}>
            <div style={{ background: '#EEF5EE', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2a5a25', marginBottom: 12, marginTop: 0 }}>Privalumai</p>
              {['Platus kainų pasirinkimas, lengva rasti', 'Labai lengvas', 'Didelė raštų ir spaudinių įvairovė', 'Yra itin tvirtų variantų aktyviems šunims'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#3D5a3a', margin: '0 0 6px', lineHeight: 1.5 }}>✓ {p}</p>
              ))}
            </div>
            <div style={{ background: '#FFF5F5', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#8B3A3A', marginBottom: 12, marginTop: 0 }}>Ribojimai</p>
              {['Sugerio vandenį ir lėčiau džiūsta', 'Pluoštai ilgainiui kaupia bakterijas ir kvapus', 'Kraštai gali irti intensyviai naudojant', 'Gali velti ilgesnį kailį'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#6B4040', margin: '0 0 6px', lineHeight: 1.5 }}>△ {p}</p>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3D3530', letterSpacing: '-0.03em', marginBottom: 16, marginTop: 0, fontFamily: "'DM Sans', sans-serif" }}>Ką rinktis?</h2>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: '#3D3530' }}>Rinkitės silikoną, jei:</strong> jūsų šuo maudosi, dažnai išsipurvina ar turi jautrią odą. Vien atsparumas vandeniui ir kvapams dažnai pateisina didesnę kainą.
          </p>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: '#3D3530' }}>Rinkitės nailoną, jei:</strong> jums svarbus konkretus raštas, turite labai ribotą biudžetą arba jūsų šuo retai sušlampa.
          </p>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 56 }}>
            Daugumai aktyvių šunų silikonas ilgainiui yra geresnė investicija — antkaklis tarnauja ilgiau ir iš tiesų išlieka švarus, o ne tik atrodo švariai.
          </p>

          {/* Related guide */}
          <div style={{ borderTop: '1px solid rgba(61,53,48,0.1)', paddingTop: 32, marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#9B948F', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, marginTop: 0 }}>Susijęs gidas</p>
            <Link href="/guide/how-to-measure-dog-collar" style={{ fontSize: 16, fontWeight: 500, color: '#3D3530', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              Kaip išmatuoti šunį antkakliui →
            </Link>
          </div>

          {/* CTA */}
          <div style={{ padding: '40px', background: '#3D3530', borderRadius: 20, textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 22, fontWeight: 500, color: '#FAF7F2', marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em' }}>
              Išbandykite silikoninį antkaklį
            </p>
            <p style={{ fontSize: 15, color: 'rgba(250,247,242,0.6)', marginBottom: 28, marginTop: 0 }}>
              Atsparus vandeniui, nesugeriantis kvapų ir personalizuojamas pakabukais. Sukurtas Vilniuje.
            </p>
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
