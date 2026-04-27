import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Measure Your Dog for a Collar | PawCharms Guide',
  description: 'Step-by-step guide to measuring your dog\'s neck for the perfect collar fit. Includes a size chart (XS–L) and tips for between sizes. Takes 2 minutes.',
  openGraph: {
    title: 'How to Measure Your Dog for a Collar',
    description: 'Get the right fit in 5 steps. Includes size chart for XS, S, M, and L collars.',
    type: 'article',
    url: 'https://pawcharms.lt/guide/how-to-measure-dog-collar',
    siteName: 'PawCharms',
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: "How to Measure Your Dog's Neck for a Collar",
  description: "Measure your dog's neck in 5 steps to find the right collar size. Works for all breeds.",
  totalTime: 'PT2M',
  tool: [{ '@type': 'HowToTool', name: 'Flexible tape measure (or a piece of string and a ruler)' }],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Get a flexible tape measure',
      text: "Use a soft fabric tape measure. If you don't have one, use a piece of string and measure it against a ruler afterwards.",
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: "Find the widest part of your dog's neck",
      text: 'This is usually mid-neck — not the base where it meets the shoulders, and not right under the jaw.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Wrap and measure',
      text: "Hold the tape snug but not tight around the neck. You should be able to fit two fingers between the tape and the neck. Note the measurement in centimetres.",
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Add 2–3 cm for comfort',
      text: 'Your final collar size should be your neck measurement plus 2–3 cm. This gives enough room for comfort without the collar being loose enough to slip over the head.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Match to the size chart',
      text: 'XS fits 20–28 cm, S fits 28–36 cm, M fits 36–44 cm, L fits 44–54 cm. If your dog is between sizes, choose the larger size.',
    },
  ],
};

const SIZES = [
  { size: 'XS', range: '20–28 cm', breeds: 'Chihuahua, Toy Poodle, Yorkshire Terrier' },
  { size: 'S',  range: '28–36 cm', breeds: 'French Bulldog, Beagle, Shiba Inu, Miniature Schnauzer' },
  { size: 'M',  range: '36–44 cm', breeds: 'Border Collie, Cocker Spaniel, Whippet, Basenji' },
  { size: 'L',  range: '44–54 cm', breeds: 'Golden Retriever, Labrador, German Shepherd, Husky' },
];

export default function MeasureGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div style={{ background: '#FAF7F2', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>

        {/* Nav */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(61,53,48,0.08)', padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 13, color: '#9B948F', textDecoration: 'none', fontWeight: 500 }}>← Back</Link>
          <Link href="/" style={{ fontSize: 18, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.02em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#A8D5A2', display: 'inline-block' }} />
            PawCharms
          </Link>
          <Link href="/products" style={{ fontSize: 13, fontWeight: 500, padding: '8px 18px', borderRadius: 100, background: '#A8D5A2', color: '#2a5a25', textDecoration: 'none' }}>
            Build yours →
          </Link>
        </header>

        {/* Content */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>

          <p style={{ fontSize: 13, fontWeight: 500, color: '#A8D5A2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Sizing guide</p>

          <h1 style={{ fontSize: 40, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20, marginTop: 0 }}>
            How to measure your dog for a collar
          </h1>

          <p style={{ fontSize: 17, color: '#6B6560', lineHeight: 1.7, marginBottom: 48 }}>
            A collar that fits well sits comfortably mid-neck — not so tight it restricts breathing, not loose enough to slip over the head. This guide takes about 2 minutes.
          </p>

          {/* Steps */}
          <h2 style={{ fontSize: 24, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.01em', marginBottom: 28, marginTop: 0 }}>5-step measuring guide</h2>

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
          <h2 style={{ fontSize: 24, fontWeight: 500, color: '#3D3530', letterSpacing: '-0.01em', marginTop: 56, marginBottom: 24 }}>Size chart</h2>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(61,53,48,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif" }}>
              <thead>
                <tr style={{ background: '#3D3530' }}>
                  {['Size', 'Neck range', 'Common breeds'].map(h => (
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
            These are approximate. Always measure your individual dog — breed alone is not a reliable guide.
          </p>

          {/* Between sizes */}
          <div style={{ background: '#EEF5EE', borderRadius: 16, padding: '24px 28px', marginTop: 48 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#3D3530', marginBottom: 8, marginTop: 0 }}>What if my dog is between sizes?</p>
            <p style={{ fontSize: 14, color: '#4a6b47', lineHeight: 1.6, margin: 0 }}>
              Always go up a size. A slightly larger collar is safer and more comfortable than one that is too snug. All Žavesys collars have multiple adjustment positions so you can fine-tune the fit.
            </p>
          </div>

          {/* The two-finger rule */}
          <div style={{ background: '#FAF0F5', borderRadius: 16, padding: '24px 28px', marginTop: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#3D3530', marginBottom: 8, marginTop: 0 }}>The two-finger rule</p>
            <p style={{ fontSize: 14, color: '#6B4455', lineHeight: 1.6, margin: 0 }}>
              Once the collar is on your dog, slide two fingers underneath it. If they fit snugly, the collar is correctly sized. If you can fit three or more fingers, go down a size. If you can barely fit one, the collar is too tight.
            </p>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, padding: '40px', background: '#3D3530', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 500, color: '#FAF7F2', marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em' }}>Ready to build your collar?</p>
            <p style={{ fontSize: 15, color: 'rgba(250,247,242,0.6)', marginBottom: 28, marginTop: 0 }}>Pick your colour, add charms, and enter your size in the configurator.</p>
            <Link href="/products" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 100, background: '#A8D5A2', color: '#2a5a25', fontSize: 15, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.01em' }}>
              Build your collar →
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}
