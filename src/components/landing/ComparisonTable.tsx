'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { DisplayHeading, BodyCopy } from '@/components/storefront/Typography'

const PAWCHARMS_BADGES = [
  { label: 'Keičiami pakabukai per 5 sek.',   bottom: 340, left: 20,  rotate: -8 },
  { label: 'Personalizuojamas dizainas',      bottom: 250, left: 200, rotate: 9 },
  { label: 'Nesugeria kvapų ir dėmių',        bottom: 130, left: 190, rotate: 5 },
  { label: 'Vandeniui atsparus silikonas',    bottom: 20,  left: 20,  rotate: -3 },
]

const COMPETITOR_BADGES = [
  { label: 'Pakabukų nepakeisi',              bottom: 340, left: 20,  rotate: -8 },
  { label: 'Vienodas dizainas visiems',       bottom: 250, left: 200, rotate: 9 },
  { label: 'Sugeria kvapus ir dėmes',         bottom: 130, left: 190, rotate: 5 },
  { label: 'Neatsparus vandeniui',            bottom: 20,  left: 20,  rotate: -3 },
]

const CARD_SIZE = 454

function BadgeCard ({ badges, badgeBg }: { badges: typeof PAWCHARMS_BADGES, badgeBg: string }) {
  return (
    <>
      {badges.map((badge) => (
        <div
          key={badge.label}
          data-compare-badge
          data-fall={CARD_SIZE - badge.bottom}
          data-rotate={badge.rotate}
          style={{
            position: 'absolute',
            bottom: `${(badge.bottom / CARD_SIZE) * 100}%`,
            left: `${(badge.left / CARD_SIZE) * 100}%`,
            background: badgeBg,
            borderRadius: 'clamp(6px, 6cqw, 40px)',
            padding: 'clamp(3px, 2.5cqw, 12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 'clamp(7px, 3.5cqw, 16px)', fontWeight: 500, color: 'var(--color-bark)', whiteSpace: 'nowrap' }}>
            {badge.label}
          </span>
        </div>
      ))}
    </>
  )
}

export function ComparisonTable () {
  const w = useWindowWidth() ?? 1200
  const isMobile = w < 768
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mm: any

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!sectionRef.current) return
        gsap.registerPlugin(ScrollTrigger)
        mm = gsap.matchMedia()

        mm.add(
          {
            allowMotion: '(prefers-reduced-motion: no-preference)',
            reduceMotion: '(prefers-reduced-motion: reduce)',
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (context: any) => {
            const { allowMotion } = context.conditions as { allowMotion?: boolean }
            const badges = gsap.utils.selector(sectionRef)('[data-compare-badge]')
            if (!badges.length) return

            if (!allowMotion) {
              gsap.set(badges, { clearProps: 'all' })
              return
            }

            gsap.set(badges, {
              transformOrigin: 'left center',
              rotation: (_i: number, el: Element) => parseFloat((el as HTMLElement).dataset.rotate || '0'),
              y: (_i: number, el: Element) => -(parseFloat((el as HTMLElement).dataset.fall || '0') + 48),
              autoAlpha: 1,
            })

            // Resting state: badges gently float near the top of the card until triggered.
            const floatTween = gsap.to(badges, {
              y: '+=12',
              duration: 2.4,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              stagger: { each: 0.3, from: 'random' },
            })

            ScrollTrigger.create({
              trigger: sectionRef.current,
              start: 'bottom 85%',
              once: true,
              onEnter: () => {
                floatTween.kill()
                gsap.to(badges, {
                  y: 0,
                  duration: (_i: number, el: Element) => 0.55 + parseFloat((el as HTMLElement).dataset.fall || '0') / 260,
                  ease: 'bounce.out',
                  stagger: 0.06,
                })
              },
            })
          }
        )

        if (document.readyState === 'complete') {
          ScrollTrigger.refresh()
        } else {
          window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
        }
      }
    )

    return () => { mm?.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="bg-white" style={{ padding: isMobile ? '56px 20px' : '120px 64px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 40 : 64,
        }}
      >
        {/* Left — two comparison panels */}
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            minWidth: 0,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 32,
            order: isMobile ? 2 : 0,
          }}
        >
          {/* PawCharms panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: '1 0 0', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Image src="/pawcharms.svg" alt="PawCharms" width={107} height={57} style={{ height: 40, width: 'auto' }} />
              <div className="bg-sage" style={{ borderRadius: 50, padding: '16px 24px' }}>
                <p className="font-display" style={{ fontSize: 20, color: 'var(--color-bark)', letterSpacing: '0.07em', whiteSpace: 'nowrap', margin: 0 }}>
                  Pawcharms
                </p>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                aspectRatio: '1 / 1',
                width: '100%',
                containerType: 'inline-size',
                backgroundImage: 'linear-gradient(153deg, rgb(168, 213, 162) 0%, rgb(248, 248, 248) 107.09%)',
              }}
            >
              <BadgeCard badges={PAWCHARMS_BADGES} badgeBg="#fff" />
            </div>
          </div>

          {/* Competitors panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: '1 0 0', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#e1e1e1', borderRadius: 50, padding: '12px 16px' }}>
                <p className="font-display" style={{ fontSize: 24, color: 'var(--color-bark)', letterSpacing: '0.06em', whiteSpace: 'nowrap', margin: 0 }}>
                  Kiti
                </p>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                aspectRatio: '1 / 1',
                width: '100%',
                containerType: 'inline-size',
                background: '#e1e1e1',
              }}
            >
              <BadgeCard badges={COMPETITOR_BADGES} badgeBg="#f5f5f5" />
            </div>
          </div>
        </div>

        {/* Right — heading + copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', width: isMobile ? '100%' : 468, flexShrink: 0, order: isMobile ? 1 : 0 }}>
          <DisplayHeading as="h2" size="section" className="m-0 text-bark">
            Palyginkime
          </DisplayHeading>
          <BodyCopy className="m-0">
            Vandeniui atsparus silikonas, patogi rankena ir spalvos, tinkančios kiekvienam šuniui.
          </BodyCopy>
        </div>
      </div>
    </section>
  )
}
