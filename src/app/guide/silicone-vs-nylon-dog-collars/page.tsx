import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNav } from '@/components/landing/LandingNav';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { DisplayHeading } from '@/components/storefront/Typography';

export const metadata: Metadata = {
  title: 'Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?',
  description: 'Silikoninių ir nailoninių šunų antkaklių palyginimas pagal atsparumą vandeniui, patvarumą, patogumą, priežiūrą ir personalizavimą.',
  alternates: { canonical: 'https://pawscharm.com/guide/silicone-vs-nylon-dog-collars' },
  openGraph: {
    title: 'Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?',
    description: 'Išsamus silikoninių ir nailoninių šunų antkaklių palyginimas.',
    type: 'article',
    url: 'https://pawscharm.com/guide/silicone-vs-nylon-dog-collars',
    siteName: 'PawsCharm',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?',
  description: 'Silikoninių ir nailoninių šunų antkaklių palyginimas pagal atsparumą vandeniui, patvarumą, patogumą, priežiūrą ir personalizavimą.',
  author: { '@type': 'Organization', name: 'PawsCharm' },
  publisher: {
    '@type': 'Organization',
    name: 'PawsCharm',
    url: 'https://pawscharm.com',
  },
  datePublished: '2026-04-26',
  dateModified: '2026-06-14',
  url: 'https://pawscharm.com/guide/silicone-vs-nylon-dog-collars',
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

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Pradžia', item: 'https://pawscharm.com' },
    { '@type': 'ListItem', position: 2, name: 'Gidai', item: 'https://pawscharm.com/guide' },
    { '@type': 'ListItem', position: 3, name: 'Silikoniniai ar nailoniniai šunų antkakliai', item: 'https://pawscharm.com/guide/silicone-vs-nylon-dog-collars' },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-cream min-h-dvh">
        <LandingNav topOffset={0} />

        <main className="max-w-[1200px] mx-auto px-6 pb-24">
          <div className="mb-6">
            <Link href="/guide/how-to-measure-dog-collar" className="text-[13px] text-bark-muted no-underline font-semibold tracking-[0.01em]">
              Skaityti dydžių gidą →
            </Link>
          </div>

          <p className="text-[13px] font-medium text-sage tracking-[0.08em] uppercase mb-4 mt-0">Antkaklių gidas</p>

          <DisplayHeading as="h1" size="page" className="mb-5">
            Silikoniniai ar nailoniniai šunų antkakliai: kas geriau?
          </DisplayHeading>

          <p className="text-[17px] text-bark-light leading-[1.7] mb-4">
            Nailonas dešimtmečius buvo įprastas šunų antkaklių pasirinkimas. Silikoniniai antkakliai yra naujesni, tačiau aktyviems šunims dažnai gerokai praktiškesni. Štai aiškus palyginimas, kad būtų lengviau apsispręsti.
          </p>

          <p className="text-sm text-bark-muted mb-12">
            Atnaujinta: 2026 m. birželį
          </p>

          {/* Comparison table */}
          <DisplayHeading as="h2" size="compact" className="mb-6">Palyginimas greta</DisplayHeading>

          <div className="rounded-2xl overflow-hidden border border-bark/10 mb-14">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bark">
                  <th className="px-5 py-[14px] text-left text-xs font-medium text-cream tracking-[0.06em] uppercase w-[22%]">Kriterijus</th>
                  <th className="px-5 py-[14px] text-left text-xs font-medium text-sage tracking-[0.06em] uppercase w-[39%]">Silikonas</th>
                  <th className="px-5 py-[14px] text-left text-xs font-medium text-cream/50 tracking-[0.06em] uppercase w-[39%]">Nailonas</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.criterion} className={i % 2 === 0 ? "bg-white border-t border-bark/[0.06]" : "bg-cream border-t border-bark/[0.06]"}>
                    <td className="px-5 py-4 text-sm font-semibold text-bark align-top">{row.criterion}</td>
                    <td className={`px-5 py-4 text-sm text-interactive-text leading-[1.5] align-top ${row.winner === 'silicone' ? 'bg-sage/10' : ''}`}>{row.silicone}</td>
                    <td className={`px-5 py-4 text-sm text-bark-light leading-[1.5] align-top ${row.winner === 'nylon' ? 'bg-sage/10' : ''}`}>{row.nylon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Silicone pros/cons */}
          <DisplayHeading as="h2" size="compact" className="mb-5">Silikoniniai antkakliai</DisplayHeading>

          <p className="text-base text-bark-light leading-[1.7] mb-4">
            Silikoniniai antkakliai gaminami iš maistinio silikono — tos pačios medžiagos, kuri naudojama virtuvės įrankiuose ir medicinos gaminiuose. Svarbiausias privalumas yra neporėtas paviršius: į jį neįsigeria vanduo, bakterijos ar kvapai.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-sage/15 rounded-[14px] py-5 px-[22px]">
              <p className="text-sm font-semibold text-interactive-text mb-3 mt-0">Privalumai</p>
              {['Nesugeria kvapo net dažnai maudantis', 'Nuvalomas per kelias sekundes', 'Kraštai nesišerpetoja ir neirsta', 'Atsparus UV ir sūriam vandeniui', 'Tinka prisegamiems pakabukams', 'Tinka jautriai odai'].map(p => (
                <p key={p} className="text-sm text-interactive-text mb-1.5 leading-[1.5]">✓ {p}</p>
              ))}
            </div>
            <div className="bg-blossom/15 rounded-[14px] py-5 px-[22px]">
              <p className="text-sm font-semibold text-bark mb-3 mt-0">Ribojimai</p>
              {['Didesnė pradinė kaina nei bazinio nailono', 'Mažiau raštų pasirinkimo', 'Rečiau sutinkamas pigesnėse gyvūnų prekių parduotuvėse'].map(p => (
                <p key={p} className="text-sm text-bark-light mb-1.5 leading-[1.5]">△ {p}</p>
              ))}
            </div>
          </div>

          {/* Nylon pros/cons */}
          <DisplayHeading as="h2" size="compact" className="mb-5">Nailoniniai antkakliai</DisplayHeading>

          <p className="text-base text-bark-light leading-[1.7] mb-4">
            Nailoniniai antkakliai audžiami iš poliamido pluošto ir yra vieni plačiausiai prieinamų. Kokybė stipriai skiriasi: pigesni gali greitai irti, o sustiprintas nailonas būna labai tvirtas.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-14">
            <div className="bg-sage/15 rounded-[14px] py-5 px-[22px]">
              <p className="text-sm font-semibold text-interactive-text mb-3 mt-0">Privalumai</p>
              {['Platus kainų pasirinkimas, lengva rasti', 'Labai lengvas', 'Didelė raštų ir spaudinių įvairovė', 'Yra itin tvirtų variantų aktyviems šunims'].map(p => (
                <p key={p} className="text-sm text-interactive-text mb-1.5 leading-[1.5]">✓ {p}</p>
              ))}
            </div>
            <div className="bg-blossom/15 rounded-[14px] py-5 px-[22px]">
              <p className="text-sm font-semibold text-bark mb-3 mt-0">Ribojimai</p>
              {['Sugerio vandenį ir lėčiau džiūsta', 'Pluoštai ilgainiui kaupia bakterijas ir kvapus', 'Kraštai gali irti intensyviai naudojant', 'Gali velti ilgesnį kailį'].map(p => (
                <p key={p} className="text-sm text-bark-light mb-1.5 leading-[1.5]">△ {p}</p>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <DisplayHeading as="h2" size="compact" className="mb-4">Ką rinktis?</DisplayHeading>

          <p className="text-base text-bark-light leading-[1.7] mb-4">
            <strong className="text-bark">Rinkitės silikoną, jei:</strong> jūsų šuo maudosi, dažnai išsipurvina ar turi jautrią odą. Vien atsparumas vandeniui ir kvapams dažnai pateisina didesnę kainą.
          </p>

          <p className="text-base text-bark-light leading-[1.7] mb-4">
            <strong className="text-bark">Rinkitės nailoną, jei:</strong> jums svarbus konkretus raštas, turite labai ribotą biudžetą arba jūsų šuo retai sušlampa.
          </p>

          <p className="text-base text-bark-light leading-[1.7] mb-14">
            Daugumai aktyvių šunų silikonas ilgainiui yra geresnė investicija — antkaklis tarnauja ilgiau ir iš tiesų išlieka švarus, o ne tik atrodo švariai.
          </p>

          {/* Related guide */}
          <div className="border-t border-bark/10 pt-8 mb-14">
            <p className="text-[13px] font-medium text-bark-muted tracking-[0.06em] uppercase mb-3 mt-0">Susijęs gidas</p>
            <Link href="/guide/how-to-measure-dog-collar" className="text-base font-medium text-bark no-underline flex items-center gap-2">
              Kaip išmatuoti šunį antkakliui →
            </Link>
          </div>

          {/* CTA */}
          <div className="p-10 bg-bark rounded-[20px] text-center mb-6">
            <p className="text-[22px] font-medium text-cream mb-2 mt-0 tracking-[-0.01em]">
              Išbandykite silikoninį antkaklį
            </p>
            <p className="text-[15px] text-cream/60 mb-7 mt-0">
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
