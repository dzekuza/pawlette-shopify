'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography';

const STEPS = [
  { n: '01', title: 'Išsirinkite antkaklį', desc: 'Keturios pastelinės spalvos, visos atsparios vandeniui ir reguliuojamos, kad tiktų skirtingiems kaklo dydžiams.', icon: '🎨' },
  { n: '02', title: 'Pasirinkite pakabukus', desc: 'Kiekvienas rinkinys atkeliauja su 5 pakabukais. Maišykite, derinkite ir keiskite pagal sezoną.', icon: '✨' },
  { n: '03', title: 'Prisekite ir keliaukite', desc: 'Kiekvienas pakabukas lengvai prisitvirtina. Penkios sekundės, jokių įrankių, jokio vargo.', icon: '⚡' },
];

export function HowItWorks() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section id="how" className="bg-blossom/10">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ textAlign: 'center' }}>
          <Eyebrow className="text-sage mb-2">Kaip tai veikia</Eyebrow>
          <DisplayHeading as="h2" size="section" className="text-bark">
            Užsekite.<br />Parodykite.
          </DisplayHeading>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 20 : 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: '36px 32px', border: '1px solid rgba(255,255,255,0.9)' }}>
              <div style={{ fontSize: 52, fontWeight: 500, color: 'var(--color-blossom)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-bark)', marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 16, color: 'var(--color-bark-light)', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
