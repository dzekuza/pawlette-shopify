export function CommerceFooter () {
  return (
    <footer
      style={{
        background: '#3D3530',
        padding: '32px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '-0.03em',
          color: '#FAF7F2'
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#A8D5A2' }} />
        Žavesys
      </div>
      <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.35)' }}>
        © 2025 · Made with care in Lithuania
      </div>
      <div style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(250,247,242,0.4)' }}>
        Vandeniui atspari.
      </div>
    </footer>
  )
}
