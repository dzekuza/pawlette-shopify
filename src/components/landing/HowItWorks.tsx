'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';

const STEPS = [
  { n: '01', title: 'Išsirinkite antkaklį', desc: 'Keturios pastelinės spalvos, visos atsparios vandeniui ir reguliuojamos, kad tiktų skirtingiems kaklo dydžiams.', icon: '🎨' },
  { n: '02', title: 'Pasirinkite pakabukus', desc: 'Kiekvienas rinkinys atkeliauja su 5 pakabukais. Maišykite, derinkite ir keiskite pagal sezoną.', icon: '✨' },
  { n: '03', title: 'Prisekite ir keliaukite', desc: 'Kiekvienas pakabukas lengvai prisitvirtina. Penkios sekundės, jokių įrankių, jokio vargo.', icon: '⚡' },
];

export function HowItWorks() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section id="how" style={{ background: '#FAF0F5', padding: isMobile ? '60px 20px' : '100px 40px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bark-muted)', marginBottom: 16 }}>Kaip tai veikia</div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(30px, 3.5vw, 40px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--color-bark)', lineHeight: 1.1 }}>
            Užsekite.<br />Parodykite.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 20 : 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: '36px 32px', border: '1px solid rgba(255,255,255,0.9)' }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 52, fontWeight: 500, color: 'var(--color-blossom)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 500, color: 'var(--color-bark)', marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--color-bark-light)', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
