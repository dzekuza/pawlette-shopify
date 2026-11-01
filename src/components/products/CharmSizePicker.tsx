'use client'

import { useTranslations } from 'next-intl'
import type { CharmSizeGroup } from '@/lib/shopify'
import { cn } from '@/lib/utils'

type CharmSizePickerProps = {
  value: CharmSizeGroup
  options: CharmSizeGroup[]
  onChange: (group: CharmSizeGroup) => void
}

/** Segmented Small / Large picker for the charm product page. Renders nothing unless both sizes exist. */
export function CharmSizePicker({ value, options, onChange }: CharmSizePickerProps) {
  const t = useTranslations('products.pdp.charmSize')
  if (options.length < 2) return null
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-bark-muted">{t('label')}</span>
      <div role="group" aria-label={t('label')} className="flex gap-1 rounded-2xl bg-surface-2 p-1">
        {options.map((group) => {
          const isSelected = group === value
          return (
            <button
              key={group}
              type="button"
              onClick={() => onChange(group)}
              aria-pressed={isSelected}
              className={cn(
                'min-w-0 flex-1 rounded-xl px-2 py-2.5 text-sm font-semibold transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                isSelected ? 'bg-bark text-cream' : 'text-bark hover:bg-white',
              )}
            >
              {t(group)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
