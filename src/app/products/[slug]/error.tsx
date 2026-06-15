'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        fontSize: 'clamp(32px, 6vw, 56px)',
        color: '#3D3530',
        margin: 0,
      }}>Kažkas nutiko</h1>
      <p style={{ fontSize: 16, color: '#3D3530', marginTop: 12, marginBottom: 28 }}>
        Įvyko klaida. Bandykite dar kartą.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '14px 28px',
          background: '#A8D5A2',
          color: '#2a5a25',
          borderRadius: 100,
          fontWeight: 600,
          fontSize: 15,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Bandyti dar kartą
      </button>
    </main>
  );
}
