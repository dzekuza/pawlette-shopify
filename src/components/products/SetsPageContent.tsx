'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'
import { useCartCount } from '@/hooks/useCartCount'
import type { BundleSet } from '@/lib/sets'

export function SetsPageContent ({ sets }: { sets: BundleSet[] }) {
  const router = useRouter()
  const cartCount = useCartCount()

  return (
    <div className='sets-page min-h-screen bg-cream text-bark pt-16'>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className='mx-auto px-5 pb-[100px] md:px-10' style={{ maxWidth: 1320, paddingTop: 60 }}>
        <section className='relative mb-12 overflow-hidden rounded-[32px] px-6 pb-6 pt-12 md:px-16 md:pb-6 md:pt-16'>
          <div className='pointer-events-none absolute -left-8 top-0 hidden md:block'>
            <Image src='/charm-z.png' alt='' width={89} height={100} className='h-auto w-[89px] -rotate-[3deg]' />
          </div>
          <div className='pointer-events-none absolute left-[22%] top-0 hidden md:block'>
            <Image src='/charm-heart.png' alt='' width={105} height={108} className='h-auto w-[105px] -rotate-[10deg]' />
          </div>
          <div className='pointer-events-none absolute left-[25%] top-[72%] hidden md:block'>
            <Image src='/charm-star.png' alt='' width={91} height={120} className='h-auto w-[91px] rotate-[5deg]' />
          </div>
          <div className='pointer-events-none absolute right-[18%] top-0 hidden md:block'>
            <Image src='/charm-paw.png' alt='' width={104} height={96} className='h-auto w-[104px] -rotate-[4deg]' />
          </div>

          <div className='relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between'>
            <div className='max-w-[12ch]'>
              <Eyebrow className='mb-3'>Rinkiniai</Eyebrow>
              <DisplayHeading as='h1' size='floatingHero' className='m-0 max-w-[9ch] text-[clamp(3.25rem,7vw,4.8rem)] leading-[0.98]'>
                Rinkiniai
              </DisplayHeading>
            </div>

            <p className='max-w-[24rem] font-sans text-[14px] leading-6 text-bark-muted md:pt-4'>
              Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir raskite paruoštą derinį vienoje vietoje.
            </p>
          </div>
        </section>

        {sets.length > 0 ? (
          <section className='mt-10 grid grid-cols-1 gap-8 2xl:grid-cols-2 2xl:gap-10'>
            {sets.map((set) => (
              <article
                key={set.id}
                className='grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-start'
                style={{
                  padding: 24,
                  borderRadius: 30,
                  background: '#FFFDF9',
                  border: '1px solid rgba(61,53,48,0.08)',
                  boxShadow: '0 16px 34px rgba(61,53,48,0.08)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: 14,
                    alignContent: 'start',
                  }}
                >
                  <div
                    style={{
                      width: 'fit-content',
                      zIndex: 2,
                      padding: '8px 12px',
                      borderRadius: 999,
                      background: 'linear-gradient(135deg, rgba(255,170,120,0.96) 0%, rgba(255,108,155,0.92) 34%, rgba(109,166,255,0.94) 68%, rgba(88,208,170,0.92) 100%)',
                      color: '#FFFDF9',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      boxShadow: '0 12px 26px rgba(105,94,160,0.22)',
                    }}
                  >
                    {set.savingsPercent}% nuolaida rinkiniui
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: '1 / 1',
                        minWidth: 0,
                        borderRadius: 24,
                        overflow: 'hidden',
                        background: `linear-gradient(160deg, ${set.accentColor}18 0%, rgba(255,255,255,0.94) 100%)`,
                        border: '1px solid rgba(61,53,48,0.06)',
                        boxShadow: '0 12px 28px rgba(61,53,48,0.08)',
                      }}
                    >
                      <img
                        src={set.collar.image}
                        alt={set.collar.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    <div
                      aria-hidden='true'
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        display: 'grid',
                        placeItems: 'center',
                        background: '#FFFDF9',
                        border: '1px solid rgba(61,53,48,0.08)',
                        boxShadow: '0 10px 24px rgba(61,53,48,0.08)',
                        color: 'var(--color-bark-light)',
                        fontSize: 24,
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </div>

                    <div
                      style={{
                        aspectRatio: '1 / 1',
                        minWidth: 0,
                        borderRadius: 24,
                        overflow: 'hidden',
                        background: '#FFF8F0',
                        border: '1px solid rgba(61,53,48,0.06)',
                        boxShadow: '0 12px 28px rgba(61,53,48,0.1)',
                      }}
                    >
                      <img
                        src={set.leash.image}
                        alt={set.leash.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          padding: 18,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0, justifyContent: 'space-between' }}>
                  <div>
                    <div className='sets-kicker mb-2 text-bark-muted'>
                      Pasivaikščiojimo rinkinys
                    </div>
                    <h2 className='sets-heading m-0 text-bark'>
                      {set.title}
                    </h2>
                    <p className='sets-copy mb-0 mt-3 text-bark-muted'>
                      {set.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: 10,
                      padding: 16,
                      borderRadius: 20,
                      background: 'rgba(61,53,48,0.035)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, lineHeight: 1.45, color: 'var(--color-bark-light)' }}>
                      <span>Antkaklis</span>
                      <span>{set.collar.price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, lineHeight: 1.45, color: 'var(--color-bark-light)' }}>
                      <span>Pavadėlis</span>
                      <span>{set.leash.price}</span>
                    </div>
                    <div style={{ height: 1, background: 'rgba(61,53,48,0.08)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, color: 'var(--color-bark-muted)' }}>
                      <span>Atskira kaina</span>
                      <span style={{ textDecoration: 'line-through' }}>{set.originalPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-bark)' }}>Rinkinio kaina</span>
                      <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--color-interactive-text)', lineHeight: 1 }}>{set.bundlePrice}</span>
                    </div>
                    <div
                      style={{
                        width: 'fit-content',
                        padding: '7px 11px',
                        borderRadius: 999,
                        background: 'rgba(168,213,162,0.22)',
                        color: 'var(--color-interactive-text)',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {set.savingsLabel}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 10 }}>
                    <Link
                      href={`/products/${set.collar.slug}`}
                      style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 48,
                        borderRadius: 999,
                        background: 'var(--color-sage)',
                        color: 'var(--color-interactive-text)',
                        fontSize: 14,
                        fontWeight: 700,
                        boxShadow: '0 10px 22px rgba(168,213,162,0.28)',
                      }}
                    >
                      Žiūrėti antkaklį
                    </Link>
                    <Link
                      href={`/products/${set.leash.slug}`}
                      style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 46,
                        borderRadius: 999,
                        border: '1px solid rgba(61,53,48,0.12)',
                        color: 'var(--color-bark)',
                        fontSize: 14,
                        fontWeight: 600,
                        background: '#FFFDF9',
                      }}
                    >
                      Žiūrėti derantį pavadėlį
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section
            style={{
              marginTop: 40,
              padding: '32px 28px',
              borderRadius: 28,
              background: '#FFFDF9',
              border: '1px solid rgba(61,53,48,0.08)',
            }}
          >
            <h2 className='sets-heading m-0 text-bark'>Rinkiniai jau pakeliui.</h2>
            <p className='sets-copy mb-0 mt-3 text-bark-muted'>
              Kol kas neradome abiejų produktų poravimui. Kai Shopify bus ir antkakliai, ir pavadėliai, šis puslapis užsipildys automatiškai.
            </p>
          </section>
        )}
      </main>

      <LandingFooter />
    </div>
  )
}
