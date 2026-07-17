'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_STRAP_COLOUR, HARDWARE_COLOUR, type CharmSpec } from '@/lib/collar3d'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const Collar3DScene = dynamic(() => import('@/components/products/Collar3DScene'), { ssr: false })

/** "ROCKY" is the demo dog name already used in the Blender source scene (Charms_ROCKY). */
const DEMO_NAME = 'ROCKY'
/** Brand palette (src/lib/shopify.ts COLOR_BG) — one colour per letter, cycling, for a rainbow mount-in. */
const DEMO_COLOURS = ['#B8D8F4', '#6B9FD4', '#D4B8F4', '#F4B5C0', '#F9E4A0']
const DEMO_ITEMS: CharmSpec[] = DEMO_NAME.split('').map((ch, i) => ({
  meshKey: ch,
  colour: DEMO_COLOURS[i % DEMO_COLOURS.length],
  kind: 'letter' as const,
}))

/** Collar reveal happens in the first slice of scroll progress; charms mount through the rest. */
const REVEAL_END = 0.35
/** How far the collar starts off-screen before it slides in, as a % of its own width. */
const SLIDE_DISTANCE = 18

export function Collar3DShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let trigger: any
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !sectionRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1600',
        pin: true,
        scrub: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (self: any) => setProgress(self.progress),
      })
    })

    return () => {
      cancelled = true
      trigger?.kill()
    }
  }, [reducedMotion])

  const revealT = reducedMotion ? 1 : Math.min(1, progress / REVEAL_END)
  const mountT = reducedMotion ? 1 : Math.max(0, (progress - REVEAL_END) / (1 - REVEAL_END))
  const mountedCount = Math.round(mountT * DEMO_ITEMS.length)
  const items = useMemo(() => DEMO_ITEMS.slice(0, mountedCount), [mountedCount])

  return (
    <section
      ref={sectionRef}
      style={{
        height: reducedMotion ? undefined : '100vh',
        minHeight: reducedMotion ? 480 : undefined,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-cream)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: revealT,
          transform: `translateX(${(1 - revealT) * -SLIDE_DISTANCE}%) scale(${0.9 + revealT * 0.1})`,
        }}
      >
        <Collar3DScene items={items} strapColour={DEFAULT_STRAP_COLOUR} hardwareColour={HARDWARE_COLOUR} />
      </div>
    </section>
  )
}
