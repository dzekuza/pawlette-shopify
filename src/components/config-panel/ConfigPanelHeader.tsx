interface ConfigPanelHeaderProps {
  isMobile: boolean
  textMuted: string
  textPrimary: string
}

export function ConfigPanelHeader ({
  isMobile,
  textMuted,
  textPrimary
}: ConfigPanelHeaderProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: textMuted,
          marginBottom: 6
        }}
      >
        Collar set
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1
          style={{
            fontSize: isMobile ? 32 : 22,
            fontFamily: isMobile ? "'Luckiest Guy','DM Sans',sans-serif" : "'DM Sans',sans-serif",
            fontWeight: isMobile ? 400 : 500,
            letterSpacing: isMobile ? '-0.013em' : '-0.02em',
            color: textPrimary,
            lineHeight: 1.15
          }}
        >
          Build your collar
        </h1>
        <span style={{ fontSize: 20, fontWeight: 500, color: textPrimary }}>€28</span>
      </div>
    </div>
  )
}
