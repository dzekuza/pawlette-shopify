import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#FAF7F2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '32px 24px',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: "'Luckiest Guy', cursive",
        fontSize: 'clamp(48px, 10vw, 96px)',
        color: '#3D3530',
        margin: 0,
        lineHeight: 1,
      }}>404</h1>
      <p style={{ fontSize: 18, color: '#3D3530', marginTop: 16, marginBottom: 32 }}>
        Puslapis nerastas. Gal šuo jį suvalgė?
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        padding: '14px 28px',
        background: '#A8D5A2',
        color: '#2a5a25',
        borderRadius: 100,
        fontWeight: 600,
        fontSize: 15,
        textDecoration: 'none',
      }}>
        Grįžti į pradžią →
      </Link>
    </main>
  );
}
