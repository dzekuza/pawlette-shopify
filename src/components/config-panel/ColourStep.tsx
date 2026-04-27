import type { ShopifyCollar } from '@/lib/shopify'

interface ColourStepProps {
  collar: ShopifyCollar | null
  collars: ShopifyCollar[]
  next: () => void
  panelBg: string
  setCollar: (collar: ShopifyCollar) => void
  textMuted: string
  textPrimary: string
  textSecondary: string
}

export function ColourStep ({
  collar,
  collars,
  next,
  panelBg,
  setCollar,
  textMuted,
  textPrimary,
  textSecondary
}: ColourStepProps) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: textMuted,
          marginBottom: 14
        }}
      >
        Select colour —{' '}
        <span
          style={{
            textTransform: 'none',
            letterSpacing: 0,
            fontSize: 12,
            fontWeight: 400,
            color: textSecondary
          }}
        >
          {collar?.title ?? ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {collars.map((option) => (
          <button
            key={option.id}
            className='btn-press'
            onClick={() => {
              setCollar(option)
              setTimeout(next, 200)
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: option.color,
              cursor: 'pointer',
              outline: 'none',
              border: collar.id === option.id ? `3px solid ${textPrimary}` : '3px solid transparent',
              transition: 'border-color 150ms ease-out, box-shadow 200ms ease-out, transform 100ms ease-out',
              boxShadow: collar.id === option.id
                ? `0 0 0 1px ${panelBg}, 0 4px 12px ${option.glowColor}`
                : `0 2px 8px ${option.glowColor}`
            }}
          />
        ))}
      </div>
    </div>
  )
}
