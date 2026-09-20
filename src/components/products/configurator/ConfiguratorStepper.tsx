'use client'

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useCollarConfiguratorContext } from '@/components/products/configurator/CollarConfiguratorContext'
import { Charms, ColorSwatches, SizeOptions } from '@/components/products/configurator/ConfiguratorSections'
import { BORDER_COLOR, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, translateColorLabel } from '@/components/products/pdpConstants'

interface StepProps {
  title: string
  /** Shown on the collapsed header once the step is done. */
  summary?: ReactNode
  children: ReactNode
}

/** One step of a <Stepper />. Stepper reads its title/summary and renders its children as the step body. */
export function Step({ children }: StepProps) {
  return <>{children}</>
}

/** Guided one-at-a-time flow with an explicit "next" button; later steps stay locked until reached. */
export function Stepper({ children }: { children: ReactNode }) {
  const t = useTranslations('products.configurator')
  const [stepIndex, setStepIndex] = useState(0)
  const [maxStepReached, setMaxStepReached] = useState(0)
  const steps = Children.toArray(children).filter((child): child is ReactElement<StepProps> => isValidElement(child))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {steps.map((stepElement, i) => {
        const step = { key: stepElement.key ?? i, title: stepElement.props.title, summary: stepElement.props.summary ?? null, body: stepElement.props.children }
        const isActive = i === stepIndex
        const isDone = i < stepIndex
        const isLocked = i > maxStepReached
        const isLast = i === steps.length - 1
        return (
                <div
                  key={step.key}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${BORDER_COLOR}`,
                    background: isActive ? 'var(--color-cream)' : 'transparent',
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setStepIndex(i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '14px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: isLocked ? 'default' : 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700,
                          background: isDone ? 'var(--color-sage)' : isActive ? TEXT_PRIMARY : BORDER_COLOR,
                          color: isDone ? 'var(--color-interactive-text)' : isActive ? 'var(--color-cream)' : TEXT_MUTED,
                        }}
                      >
                        {isDone ? '✓' : i + 1}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: isLocked ? TEXT_MUTED : TEXT_PRIMARY }}>{step.title}</span>
                    </span>
                    {isDone && step.summary && <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{step.summary}</span>}
                  </button>

                  {isActive && (
                    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {step.body}
                      {!isLast && (
                        <button
                          type="button"
                          onClick={() => {
                            setMaxStepReached((m) => Math.max(m, i + 1))
                            setStepIndex(i + 1)
                          }}
                          style={{
                            alignSelf: 'flex-end',
                            padding: '10px 18px',
                            borderRadius: 999,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 700,
                            background: TEXT_PRIMARY,
                            color: 'var(--color-cream)',
                          }}
                        >
                          {t('next')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
        )
      })}
    </div>
  )
}

/** Explicit variant: colour → size → charms as a guided stepper (the homepage buy card). */
export function GuidedSteps() {
  const t = useTranslations('products.configurator')
  const tPdp = useTranslations('products.pdp')
  const { state: { configurator: { selectedColor, selectedSize, selectedCollarCharmCount } }, meta: { hasColors, hasSizes } } = useCollarConfiguratorContext()
  return (
    <Stepper>
      {hasColors && (
        <Step key="color" title={t('chooseColor')} summary={selectedColor ? translateColorLabel(tPdp, selectedColor) : null}>
          <div><ColorSwatches /></div>
        </Step>
      )}
      {hasSizes && (
        <Step key="size" title={t('size')} summary={selectedSize || null}>
          <div><SizeOptions /></div>
        </Step>
      )}
      <Step
        key="charms"
        title={t('decoratePanelTitle')}
        summary={selectedCollarCharmCount > 0 ? t('stepSummaryCharms', { count: selectedCollarCharmCount }) : t('stepSummarySkipped')}
      >
        <Charms />
      </Step>
    </Stepper>
  )
}
