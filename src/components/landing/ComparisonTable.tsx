'use client'

import Image from 'next/image'
import { Check, X, PawPrint } from 'lucide-react'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { DisplayHeading, BodyCopy, Eyebrow } from '@/components/storefront/Typography'

interface ComparisonRow {
  pawcharms: string
  competitor: string
}

const ROWS: ComparisonRow[] = [
  { pawcharms: 'Keičiami pakabukai per 5 sekundes', competitor: 'Pakabukų nepakeisite' },
  { pawcharms: 'Personalizuojamas dizainas', competitor: 'Vienodas dizainas visiems' },
  { pawcharms: 'Nesugeria kvapų ir dėmių', competitor: 'Sugeria kvapus ir dėmes' },
  { pawcharms: 'Vandeniui atsparus silikonas', competitor: 'Neatsparus vandeniui' },
]

export function ComparisonTable () {
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 768

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 md:py-20">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <Eyebrow className="mb-3">Palyginimas</Eyebrow>
          <DisplayHeading size="section" className="max-w-[560px] text-bark">
            Ne visi antkakliai vienodi
          </DisplayHeading>
          <BodyCopy className="mt-4 max-w-[480px]">
            Vandeniui atsparus silikonas, patogi rankena ir spalvos, tinkančios kiekvienam šuniui.
          </BodyCopy>
        </div>

        <div
          className="relative mx-auto max-w-[880px] overflow-hidden rounded-[28px] border border-border"
          style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}
        >
          {/* PawCharms column */}
          <div className="flex flex-1 flex-col gap-6 bg-sage/12 p-6 md:p-8">
            <div className="flex items-center gap-2 self-start rounded-full bg-sage px-4 py-2">
              <PawPrint size={16} strokeWidth={2.5} className="text-bark" />
              <span className="font-display text-lg tracking-wide text-bark">Pawcharms</span>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-[280px] overflow-hidden rounded-2xl">
              <Image
                src="/hero-figma/bento-collar-charm.png"
                alt="PawCharms antkaklis su pakabuku"
                fill
                sizes="280px"
                className="object-contain"
              />
            </div>

            <ul className="flex flex-col gap-3">
              {ROWS.map((row) => (
                <li key={row.pawcharms} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage text-interactive-text">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="font-sans text-sm font-medium text-bark">{row.pawcharms}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider + VS badge */}
          <div
            className="relative shrink-0 bg-border"
            style={isMobile ? { height: 1, width: '100%' } : { width: 1 }}
          >
            <span className="absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-bark font-display text-xs tracking-wide text-cream shadow-[0_4px_12px_rgba(61,53,48,0.25)]">
              VS
            </span>
          </div>

          {/* Competitor column */}
          <div className="flex flex-1 flex-col gap-6 bg-surface-2 p-6 md:p-8">
            <div className="self-start rounded-full bg-white px-4 py-2">
              <span className="font-display text-lg tracking-wide text-bark-muted">Kiti</span>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-3">
              {ROWS.map((row) => (
                <li key={row.competitor} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bark/10 text-bark-muted">
                    <X size={13} strokeWidth={3} />
                  </span>
                  <span className="font-sans text-sm font-medium text-bark-muted">{row.competitor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
