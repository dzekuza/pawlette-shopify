'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { useCartCount } from '@/hooks/useCartCount'
import type { BundleSet } from '@/lib/sets'

export function SetsPageContent ({ sets }: { sets: BundleSet[] }) {
  const router = useRouter()
  const cartCount = useCartCount()

  return (
    <div className='sets-page min-h-screen bg-cream text-bark pt-16'>
      <LandingNav topOffset={0} cartCount={cartCount} onCart={() => router.push('/cart')} />

      <main className='mx-auto px-5 pb-20 md:px-8' style={{ maxWidth: 1320, paddingTop: 40 }}>
        <section
          style={{
            padding: 'clamp(28px, 4vw, 44px)',
            borderRadius: 36,
            background: 'linear-gradient(135deg, rgba(255,170,120,0.16) 0%, rgba(255,108,155,0.12) 30%, rgba(109,166,255,0.14) 68%, rgba(88,208,170,0.12) 100%)',
            border: '1px solid rgba(61,53,48,0.08)',
            boxShadow: '0 18px 50px rgba(61,53,48,0.08)',
          }}
        >
          <div>
            <div className='sets-kicker mb-3 text-bark-muted'>
              Rinkiniai
            </div>
            <h1 className='sets-display m-0 text-bark'>
              Suderinti antkakliai ir pavadėliai viename rinkinyje.
            </h1>
            <p className='sets-copy mb-0 mt-4 text-bark-muted'>
              Peržiūrėkite paruoštus derinius, palyginkite rinkinio kainą su pirkimu atskirai ir iškart atverkite derantį antkaklį bei pavadėlį.
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
                        color: '#6B6460',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, lineHeight: 1.45, color: '#6B6460' }}>
                      <span>Antkaklis</span>
                      <span>{set.collar.price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, lineHeight: 1.45, color: '#6B6460' }}>
                      <span>Pavadėlis</span>
                      <span>{set.leash.price}</span>
                    </div>
                    <div style={{ height: 1, background: 'rgba(61,53,48,0.08)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, color: '#9B948F' }}>
                      <span>Atskira kaina</span>
                      <span style={{ textDecoration: 'line-through' }}>{set.originalPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#3D3530' }}>Rinkinio kaina</span>
                      <span style={{ fontSize: 30, fontWeight: 700, color: '#2A5A25', lineHeight: 1 }}>{set.bundlePrice}</span>
                    </div>
                    <div
                      style={{
                        width: 'fit-content',
                        padding: '7px 11px',
                        borderRadius: 999,
                        background: 'rgba(168,213,162,0.22)',
                        color: '#2A5A25',
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
                        background: '#A8D5A2',
                        color: '#2A5A25',
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
                        color: '#3D3530',
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
