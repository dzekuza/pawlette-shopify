const STEPS = ['Colour', 'Charms', 'Size'] as const

interface ConfigPanelStepTabsProps {
  isDark: boolean
  step: 0 | 1 | 2
  setStep: (step: 0 | 1 | 2) => void
  textMuted: string
  textPrimary: string
}

export function ConfigPanelStepTabs ({
  isDark,
  step,
  setStep,
  textMuted,
  textPrimary
}: ConfigPanelStepTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
      {STEPS.map((label, index) => {
        const currentStep = index as 0 | 1 | 2
        const done = currentStep < step
        const active = currentStep === step

        return (
          <button
            key={label}
            className={currentStep <= step ? 'btn-press' : undefined}
            onClick={() => currentStep <= step && setStep(currentStep)}
            style={{
              flex: 1,
              padding: '7px 4px',
              borderRadius: 10,
              border: 'none',
              cursor: currentStep <= step ? 'pointer' : 'default',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.04em',
              background: active
                ? textPrimary
                : done
                  ? (isDark ? 'rgba(168,213,162,0.2)' : '#E8F5E6')
                  : (isDark ? 'rgba(255,255,255,0.06)' : '#F3EDE6'),
              color: active
                ? (isDark ? '#3D3530' : '#FAF7F2')
                : done
                  ? '#A8D5A2'
                  : textMuted,
              transition: 'background-color 200ms ease-out, color 200ms ease-out, transform 100ms ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            {done && <span style={{ fontSize: 10 }}>✓</span>}
            {label}
          </button>
        )
      })}
    </div>
  )
}
