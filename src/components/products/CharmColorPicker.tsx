'use client'

import { useTranslations } from 'next-intl'
import { TEXT_MUTED, TEXT_SECONDARY } from '@/components/products/pdpConstants'

export function CharmColorPicker ({ color, onColorChange, options }: { color: string; onColorChange: (c: string) => void; options: { value: string; label: string; dot: string }[] }) {
  const t = useTranslations('products.pdp')
  const selectedLabel = options.find((option) => option.value === color)?.label
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED, flexShrink: 0 }}>{t('colorLabel')}</span>
      {selectedLabel && <span style={{ fontSize: 13, color: TEXT_SECONDARY, flexShrink: 0 }}>{selectedLabel}</span>}
      <div style={{ display: 'flex', gap: 6 }}>
        {options.map(({ value, label, dot }) => (
          <button
            key={value}
            onClick={() => onColorChange(value)}
            title={label}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: color === value ? '2px solid var(--color-bark)' : '2px solid transparent',
              background: dot, cursor: 'pointer', outline: 'none',
              boxShadow: color === value ? '0 0 0 1px var(--color-bark-border)' : 'none',
              transition: 'border-color 120ms',
              padding: 0,
            }}
            aria-label={label}
            aria-pressed={color === value}
          />
        ))}
      </div>
    </div>
  )
}
