import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Silicone vs Nylon Dog Collars: Which Is Better? | PawCharms',
  description: 'Comparing silicone and nylon dog collars across waterproofing, durability, comfort, cleaning, and customisation. An honest side-by-side breakdown to help you choose.',
  openGraph: {
    title: 'Silicone vs Nylon Dog Collars: Which Is Better?',
    description: 'Side-by-side comparison of silicone and nylon dog collars — waterproofing, durability, comfort, cleaning, and cost.',
    type: 'article',
    url: 'https://pawcharms.lt/guide/silicone-vs-nylon-dog-collars',
    siteName: 'PawCharms',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Silicone vs Nylon Dog Collars: Which Is Better?',
  description: 'A side-by-side comparison of silicone and nylon dog collars covering waterproofing, durability, comfort, cleaning, and customisation.',
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
  name: 'Silicone vs Nylon Dog Collar Comparison',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Product',
        name: 'Silicone dog collar',
        description: 'Waterproof, odour-resistant, easy-clean silicone collar with snap-on charm system',
        material: 'Food-grade silicone',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Product',
        name: 'Nylon dog collar',
        description: 'Lightweight woven nylon collar, available in many patterns',
        material: 'Nylon',
      },
    },
  ],
};

const COMPARISON = [
  {
    criterion: 'Waterproofing',
    silicone: '✓ Fully waterproof. Does not absorb water, mud, or pool chemicals.',
    nylon: '✗ Absorbs water. Stays damp after swims and can develop mildew smell.',
    winner: 'silicone',
  },
  {
    criterion: 'Odour resistance',
    silicone: '✓ Non-porous surface. Odours do not penetrate the material.',
    nylon: '✗ Fibres trap bacteria and odours over time, especially with active dogs.',
    winner: 'silicone',
  },
  {
    criterion: 'Cleaning',
    silicone: '✓ Wipe with a damp cloth or rinse under the tap. Dry in seconds.',
    nylon: '△ Requires washing and full drying time to avoid mildew.',
    winner: 'silicone',
  },
  {
    criterion: 'Durability',
    silicone: '✓ Resistant to UV, salt water, and most chemicals. Does not fray.',
    nylon: '△ High-quality nylon is durable, but edges fray over time with rough use.',
    winner: 'silicone',
  },
  {
    criterion: 'Comfort',
    silicone: '✓ Soft and flexible. Smooth surface does not cause fur matting around the collar.',
    nylon: '✓ Lightweight and flexible. Some dogs prefer the lighter weight.',
    winner: 'tie',
  },
  {
    criterion: 'Customisation',
    silicone: '✓ Snap-on charm systems, colour options, engraving.',
    nylon: '△ Printed patterns only. Limited personalisation.',
    winner: 'silicone',
  },
  {
    criterion: 'Price',
    silicone: '△ Typically €20–45 for quality options.',
    nylon: '✓ Wide range, from €5 to €30+.',
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

        {/* Nav */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(61,53,48,0.08)', padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 13, color: '#9B948F', textDecoration: 'none', fontWeight: 500 }}>← Back</Link>
          <Link href="/" style={{ fontSize: 18, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.02em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#A8D5A2', display: 'inline-block' }} />
            PawCharms
          </Link>
          <Link href="/configure" style={{ fontSize: 13, fontWeight: 500, padding: '8px 18px', borderRadius: 100, background: '#A8D5A2', color: '#2a5a25', textDecoration: 'none' }}>
            Build yours →
          </Link>
        </header>

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 96px' }}>

          <p style={{ fontSize: 13, fontWeight: 500, color: '#A8D5A2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Collar guide</p>

          <h1 style={{ fontSize: 40, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20, marginTop: 0 }}>
            Silicone vs nylon dog collars: which is better?
          </h1>

          <p style={{ fontSize: 17, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Nylon has been the default dog collar material for decades. Silicone collars are newer — and genuinely better in several areas that matter for active dogs. Here is an honest breakdown so you can decide.
          </p>

          <p style={{ fontSize: 14, color: '#9B948F', marginBottom: 48 }}>
            Last updated: April 2026
          </p>

          {/* Comparison table */}
          <h2 style={{ fontSize: 24, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.01em', marginBottom: 24, marginTop: 0 }}>Side-by-side comparison</h2>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(61,53,48,0.1)', marginBottom: 56 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif" }}>
              <thead>
                <tr style={{ background: '#3D3530' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: '#FAF7F2', letterSpacing: '0.06em', textTransform: 'uppercase', width: '22%' }}>Criterion</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: '#A8D5A2', letterSpacing: '0.06em', textTransform: 'uppercase', width: '39%' }}>Silicone</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', width: '39%' }}>Nylon</th>
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
          <h2 style={{ fontSize: 24, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.01em', marginBottom: 20, marginTop: 0 }}>Silicone collars</h2>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Silicone collars are made from moulded or extruded food-grade silicone — the same material used in kitchen utensils and medical devices. The surface is non-porous, which is the key advantage: water, bacteria, and odours cannot penetrate it.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            <div style={{ background: '#EEF5EE', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2a5a25', marginBottom: 12, marginTop: 0 }}>Advantages</p>
              {['Stays odour-free even with regular swims', 'Wipes clean in seconds', 'Does not fray or deteriorate at edges', 'UV and salt-water resistant', 'Supports snap-on charm customisation', 'Hypoallergenic for sensitive skin'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#3D5a3a', margin: '0 0 6px', lineHeight: 1.5 }}>✓ {p}</p>
              ))}
            </div>
            <div style={{ background: '#FFF5F5', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#8B3A3A', marginBottom: 12, marginTop: 0 }}>Limitations</p>
              {['Higher upfront cost than basic nylon', 'Fewer pattern options (solid colours)', 'Less common in budget pet shops'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#6B4040', margin: '0 0 6px', lineHeight: 1.5 }}>△ {p}</p>
              ))}
            </div>
          </div>

          {/* Nylon pros/cons */}
          <h2 style={{ fontSize: 24, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.01em', marginBottom: 20, marginTop: 0 }}>Nylon collars</h2>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            Nylon collars are woven from polyamide fibres and are the most widely available collar type. Quality varies significantly — cheap nylon collars can fray quickly, while reinforced nylon (used in working-dog gear) is extremely tough.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }}>
            <div style={{ background: '#EEF5EE', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2a5a25', marginBottom: 12, marginTop: 0 }}>Advantages</p>
              {['Wide price range, available everywhere', 'Very lightweight', 'Huge variety of patterns and prints', 'High-strength options for working dogs'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#3D5a3a', margin: '0 0 6px', lineHeight: 1.5 }}>✓ {p}</p>
              ))}
            </div>
            <div style={{ background: '#FFF5F5', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#8B3A3A', marginBottom: 12, marginTop: 0 }}>Limitations</p>
              {['Absorbs water and takes time to dry', 'Fibres trap bacteria and odour over time', 'Edges fray with heavy use', 'Can cause matting in long-coated dogs'].map(p => (
                <p key={p} style={{ fontSize: 14, color: '#6B4040', margin: '0 0 6px', lineHeight: 1.5 }}>△ {p}</p>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <h2 style={{ fontSize: 24, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.01em', marginBottom: 16, marginTop: 0 }}>Which should you choose?</h2>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: '#3D3530' }}>Choose silicone if:</strong> your dog swims, plays in mud, or has sensitive skin. The waterproofing and odour resistance alone make it worth the higher cost. Cleaning takes seconds rather than minutes.
          </p>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: '#3D3530' }}>Choose nylon if:</strong> you want a specific printed pattern, are on a very tight budget, or your dog is a calm indoor pet who rarely gets wet.
          </p>

          <p style={{ fontSize: 16, color: '#6B6560', lineHeight: 1.7, marginBottom: 56 }}>
            For most active dogs, silicone is the better long-term value — the collar lasts longer and stays genuinely clean rather than just looking clean.
          </p>

          {/* Related guide */}
          <div style={{ borderTop: '1px solid rgba(61,53,48,0.1)', paddingTop: 32, marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#9B948F', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, marginTop: 0 }}>Related guide</p>
            <Link href="/guide/how-to-measure-dog-collar" style={{ fontSize: 16, fontWeight: 500, color: '#3D3530', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              How to measure your dog for a collar →
            </Link>
          </div>

          {/* CTA */}
          <div style={{ padding: '40px', background: '#3D3530', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 500, color: '#FAF7F2', marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em' }}>
              Try a silicone collar
            </p>
            <p style={{ fontSize: 15, color: 'rgba(250,247,242,0.6)', marginBottom: 28, marginTop: 0 }}>
              Waterproof, odour-proof, and customisable with swap charms. Built in Vilnius.
            </p>
            <Link href="/configure" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 100, background: '#A8D5A2', color: '#2a5a25', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              Build your collar →
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}
