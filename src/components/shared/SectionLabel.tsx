interface SectionLabelProps {
  children: React.ReactNode
  color?: string
}

export function SectionLabel({ children, color = 'var(--color-bark-muted)' }: SectionLabelProps) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 11,
        fontWeight: 500,
        color,
        letterSpacing: '0.88px',
        textTransform: 'uppercase',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </p>
  )
}
