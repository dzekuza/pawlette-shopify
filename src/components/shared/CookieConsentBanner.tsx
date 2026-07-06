'use client'

import { useEffect, useState } from 'react'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from '@/components/shared/MetaPixel'

export function CookieConsentBanner () {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
    }
  }, [])

  const decide = (decision: 'granted' | 'denied') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, decision)
    if (decision === 'granted') {
      window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-cream/98 px-4 py-4 shadow-[0_-4px_20px_rgba(61,53,48,0.08)] backdrop-blur-sm md:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="font-sans text-[13px] leading-[1.5] text-bark-light md:text-[14px]">
          Naudojame slapukus, kad pagerintume jūsų naršymo patirtį ir matuotume rinkodaros kampanijų efektyvumą. Pasirinkite, ar sutinkate.
        </p>
        <div className="flex w-full shrink-0 gap-2.5 md:w-auto">
          <PrimaryButton variant="dark" size="sm" onClick={() => decide('denied')}>
            Atmesti
          </PrimaryButton>
          <PrimaryButton variant="sage" size="sm" onClick={() => decide('granted')}>
            Priimti
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
