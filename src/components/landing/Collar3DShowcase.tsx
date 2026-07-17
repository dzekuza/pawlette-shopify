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

export function Collar3DShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const mountedCountRef = useRef(DEMO_ITEMS.length)
  const [mountedCount, setMountedCount] = useState(DEMO_ITEMS.length)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      mountedCountRef.current = DEMO_ITEMS.length
      setMountedCount(DEMO_ITEMS.length)
      setProgress(1)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mm: any = null
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !sectionRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        mountedCountRef.current = 0
        setMountedCount(0)
        setProgress(0)

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=960',
          pin: true,
          scrub: 0.6,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onUpdate: (self: any) => {
            setProgress(self.progress)
            const nextCount = Math.round(self.progress * DEMO_ITEMS.length)
            if (nextCount === mountedCountRef.current) return
            mountedCountRef.current = nextCount
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
            frameRef.current = requestAnimationFrame(() => {
              setMountedCount(nextCount)
              frameRef.current = null
            })
          },
        })

        return () => trigger.kill()
      })
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        mountedCountRef.current = DEMO_ITEMS.length
        setMountedCount(DEMO_ITEMS.length)
        setProgress(0)

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 82%',
          end: 'bottom top',
          scrub: 0.6,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onUpdate: (self: any) => setProgress(self.progress),
        })

        return () => trigger.kill()
      })
    })

    return () => {
      cancelled = true
      mm?.revert()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [reducedMotion])

  const items = useMemo(() => DEMO_ITEMS.slice(0, mountedCount), [mountedCount])
  const modelRotation = useMemo<[number, number, number]>(() => {
    const tiltX = 0.16 - progress * 0.24
    const spinY = -0.42 + progress * 0.96
    const tiltZ = 0.08 - progress * 0.18
    return [tiltX, spinY, tiltZ]
  }, [progress])
  const modelScale = useMemo(() => 0.86 + progress * 0.34, [progress])
  const modelPosition = useMemo<[number, number, number]>(() => [0, progress * 0.14, 0], [progress])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[480px] overflow-hidden bg-cream md:min-h-[100dvh]"
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <Collar3DScene
          items={items}
          strapColour={DEFAULT_STRAP_COLOUR}
          hardwareColour={HARDWARE_COLOUR}
          modelRotation={modelRotation}
          modelScale={modelScale}
          modelPosition={modelPosition}
        />
      </div>
    </section>
  )
}
