import { SIZES } from '@/lib/data'

interface SizeStepProps {
  borderColor: string
  isDark: boolean
  next: () => void
  setSize: (size: string) => void
  size: string
  textMuted: string
  textPrimary: string
}

export function SizeStep ({
  borderColor,
  isDark,
  next,
  setSize,
  size,
  textMuted,
  textPrimary
}: SizeStepProps) {
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
        Select size
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {SIZES.map((option) => (
          <button
            key={option}
            className='btn-press'
            onClick={() => {
              setSize(option)
              setTimeout(next, 200)
            }}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              border: size === option ? `2px solid ${textPrimary}` : `1.5px solid ${borderColor}`,
              background: size === option ? textPrimary : 'transparent',
              transition: 'border-color 150ms ease-out, background-color 150ms ease-out, color 150ms ease-out, transform 100ms ease-out',
              fontFamily: "'DM Sans',sans-serif"
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: size === option ? (isDark ? '#3D3530' : '#FAF7F2') : textPrimary
              }}
            >
              {option.split(' — ')[0]}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: size === option
                  ? (isDark ? 'rgba(61,53,48,0.65)' : 'rgba(250,247,242,0.65)')
                  : textMuted
              }}
            >
              {option.split(' — ')[1]}
            </span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#A8D5A2', cursor: 'pointer' }}>
        Sizing guide →
      </div>
    </div>
  )
}
