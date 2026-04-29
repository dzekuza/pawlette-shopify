'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ProductDetail } from '@/lib/catalog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DisplayHeading, Eyebrow } from '@/components/storefront/Typography'

interface ProductDetailSummaryProps {
  isMobile: boolean
  product: ProductDetail
}

type DetailTab = 'overview' | 'fit' | 'shipping'

const TAB_LABELS: Array<{ id: DetailTab, label: string }> = [
  { id: 'overview', label: 'Apžvalga' },
  { id: 'fit', label: 'Suderinamumas' },
  { id: 'shipping', label: 'Pristatymas' }
]

export function ProductDetailSummary ({ isMobile, product }: ProductDetailSummaryProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [openFaq, setOpenFaq] = useState(0)

  const isCharm = product.productType === 'charm'

  const quickPoints = isCharm
    ? [
        'Pakeičiama prisegant per maždaug 5 sekundes',
        'Tinka visiems PawCharms antkaklių rinkiniams',
        'Puikus lengvai pasirenkamas papildymas'
      ]
    : [
        'Vandeniui atsparus silikonas kasdieniam nešiojimui',
        'Įeina 5 keičiami pakabukai',
        'Sukurta atnaujinti stilių laikui bėgant'
      ]

  const statItems = isCharm
    ? [
        { label: 'Formatas', value: 'Vienas pakabukas' },
        { label: 'Tinka', value: 'Visiems PawCharms antkakliams' },
        { label: 'Paskirtis', value: 'Lengvas papildomas pasirinkimas' }
      ]
    : [
        { label: 'Formatas', value: 'Antkaklio rinkinys' },
        { label: 'Medžiaga', value: 'Vandeniui atsparus silikonas' },
        { label: 'Paskirtis', value: 'Kasdieniam nešiojimui' }
      ]

  const tabContent: Record<DetailTab, { intro: string, bullets: string[] }> = isCharm
    ? {
        overview: {
          intro: 'Šis puslapis turėtų padėti lengvai apsispręsti dėl papildymo. Vertė čia slypi ne sudėtingume, o greitame vizualiniame atnaujinime, universaliame suderinamume ir lengvai priimtinoje kainoje.',
          bullets: [
            'Suteikia įvairovės nekeičiant viso antkaklio',
            'Lengvas būdas padidinti krepšelio vertę beveik be jokios trinties',
            'Kolekcionuojama, dovanojama ir lengvai derinama pagal nuotaiką ar sezoną'
          ]
        },
        fit: {
          intro: product.compatibilityNote,
          bullets: [
            'Sukurta veikti su visa PawCharms antkaklių linija',
            'Geriausia pirkti kartu su antkaklio rinkiniu arba keliais pakabukais',
            'Puikus pasirinkimas sugrįžtantiems klientams, kurie jau turi rinkinį'
          ]
        },
        shipping: {
          intro: 'Siunčiama iš Vilniaus, Lietuvos. Geriausiam rezultatui derinkite su antkaklio rinkiniu arba susikurkite mini rinkinį iš kelių pakabukų viename užsakyme.',
          bullets: [
            'Ships from Vilnius, LT',
            'Puikus papildomas produktas dovanoms ir pakartotiniams užsakymams',
            'Lengvai derinamas su perkamiausiais produktais'
          ]
        }
      }
    : {
        overview: {
          intro: 'Stipriausia šio produkto vertė yra patogumas, vandeniui atsparus patvarumas ir galimybė laikui bėgant atnaujinti įvaizdį nepirkant visai naujo rinkinio.',
          bullets: [
            'Sukurta kasdieniam naudojimui',
            'Asmeniškas įvaizdis su keičiamais papildymais',
            'Lengva valyti po šlapių ar purvinų pasivaikščiojimų'
          ]
        },
        fit: {
          intro: product.compatibilityNote,
          bullets: [
            'Pradiniame rinkinyje yra penki pakabukai',
            'Galima plėsti platesne pakabukų kolekcija',
            'Puikiai tinka tiek dovanai, tiek pirmam užsakymui'
          ]
        },
        shipping: {
          intro: 'Siunčiama iš Vilniaus, Lietuvos, o vėliau rinkinį lengva plėsti papildomais pakabukais ir sezoniniais leidimais.',
          bullets: [
            'Ships from Vilnius, LT',
            'Puikus pirmas pirkimas su aiškiomis papildymo galimybėmis',
            'Sukurta stiliui atnaujinti laikui bėgant'
          ]
        }
      }

  const faqItems = isCharm
    ? [
        {
          question: 'Ar tai tiks mano antkakliui?',
          answer: 'Taip. Kiekvienas PawCharms pakabukas sukurtas taip, kad tiktų visiems PawCharms antkaklių rinkiniams, todėl nereikia rūpintis dėl konkretaus pagrindo derinimo.'
        },
        {
          question: 'Kada vienas pakabukas yra geriausias pasirinkimas?',
          answer: 'Vienas pakabukas geriausiai tinka esamiems PawCharms klientams, kaip dovanos papildymas ar pirkėjams, norintiems susikurti mažą kelių pakabukų rinkinį vietoje viso naujo komplekto.'
        },
        {
          question: 'Kaip iš šio puslapio gauti daugiausia vertės?',
          answer: 'Naudokite kaip papildymą. Geriausias krepšelio formavimo kelias yra derinti pakabuką su antkaklio rinkiniu arba pridėti kelis pakabukus kartu, kad sukurtumėte pilnesnį įvaizdį.'
        }
      ]
    : [
        {
          question: 'Kas įeina į rinkinį?',
          answer: 'Kiekviename antkaklio rinkinyje yra pagrindinis antkaklis ir penki suderinami pakabukai, todėl klientas nuo pirmos dienos gauna paruoštą įvaizdį.'
        },
        {
          question: 'Ar galėsiu vėliau atnaujinti įvaizdį?',
          answer: 'Taip. Tai viena stipriausių priežasčių rinktis šį rinkinį. Papildomi pakabukai leidžia atnaujinti stilių laikui bėgant nekeičiant viso antkaklio.'
        },
        {
          question: 'Kodėl tai lengviau įsigyti nei įprastą antkaklį?',
          answer: 'Tai sumažina apsisprendimo nuovargį, nes sujungia kasdienį praktiškumą su integruota stiliaus sistema. Klientai perka vieną pagrindą ir vėliau gali toliau keisti įvaizdį.'
        }
      ]

  return (
    <div style={{ paddingTop: isMobile ? 8 : 12 }}>
      {product.badge && (
        <Badge
          variant='default'
          size='compact'
          className='mb-[14px]'
          style={{ color: '#3D3530', backgroundColor: `${product.accentColor}22` }}
        >
          {product.badge}
        </Badge>
      )}

      <DisplayHeading as='h1' size='section' className={isMobile ? 'text-[34px] leading-[1.03] tracking-[-0.04em]' : 'text-[48px] leading-[1.03] tracking-[-0.04em]'}>
        {product.name}
      </DisplayHeading>

      <p
        style={{
          marginTop: 12,
          maxWidth: 560,
          fontSize: 16,
          lineHeight: 1.65,
          color: '#8f8680'
        }}
      >
        {product.shortDescription}
      </p>

      <div
        style={{
          marginTop: 18,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8
        }}
      >
        {quickPoints.map((point) => (
          <span
            key={point}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 999,
              padding: '8px 12px',
              background: 'rgba(61,53,48,0.045)',
              color: '#6B6460',
              fontSize: 12,
              fontWeight: 500
            }}
          >
            {point}
          </span>
        ))}
      </div>

      <section
        style={{
          marginTop: 28,
          paddingTop: 22,
          borderTop: '1px solid rgba(61,53,48,0.10)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div>
                <Eyebrow className='mb-2'>Kaina</Eyebrow>
                <div style={{ fontSize: isMobile ? 38 : 44, lineHeight: 0.95, letterSpacing: '-0.05em', color: '#3D3530' }}>
                  {product.price}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#8f8680' }}>
                Siunčiama iš Vilniaus, LT
              </div>
            </div>
          </div>

          <div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#6B6460', maxWidth: 560 }}>
              {product.compatibilityNote}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 10,
                marginTop: 18,
                alignItems: 'stretch'
              }}
            >
              <Button asChild variant='sage' size='pill' className={isMobile ? 'w-full flex-1' : 'min-w-[220px]'}>
                <Link href={product.ctaHref}>{product.ctaLabel}</Link>
              </Button>
              <Button asChild variant='pillOutline' size='pill' className={isMobile ? 'w-full flex-1' : 'min-w-[220px]'}>
                <Link href='/products'>Peržiūrėti daugiau produktų</Link>
              </Button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? 12 : 18,
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid rgba(61,53,48,0.08)'
          }}
        >
          {statItems.map((item) => (
            <div key={item.label}>
              <Eyebrow className='mb-1.5 text-[10px] font-semibold'>{item.label}</Eyebrow>
              <div style={{ fontSize: 15, lineHeight: 1.45, color: '#3D3530', fontWeight: 500 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <div
          style={{
            display: 'flex',
            gap: 18,
            borderBottom: '1px solid rgba(61,53,48,0.10)',
            overflowX: 'auto'
          }}
        >
          {TAB_LABELS.map((tab) => {
            const active = tab.id === activeTab

            return (
              <button
                key={tab.id}
                className='btn-press'
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '0 0 12px',
                  borderBottom: active ? '2px solid #3D3530' : '2px solid transparent',
                  color: active ? '#3D3530' : '#9B948F',
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div style={{ paddingTop: 18 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: '#4f4843' }}>
            {tabContent[activeTab].intro}
          </p>

          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            {tabContent[activeTab].bullets.map((bullet) => (
              <div key={bullet} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: product.accentColor,
                    flexShrink: 0,
                    marginTop: 8
                  }}
                />
                <span style={{ fontSize: 14, lineHeight: 1.7, color: '#6B6460' }}>
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid rgba(61,53,48,0.10)' }}>
        <Eyebrow className='mb-2 text-[12px] font-semibold'>Verta žinoti</Eyebrow>

        {faqItems.map((item, index) => {
          const isOpen = openFaq === index

          return (
            <div key={item.question} style={{ borderBottom: '1px solid rgba(61,53,48,0.08)' }}>
              <button
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#3D3530', lineHeight: 1.45 }}>
                  {item.question}
                </span>
                <span style={{ fontSize: 20, lineHeight: 1, color: '#9B948F' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 0 16px', fontSize: 14, lineHeight: 1.8, color: '#6B6460', maxWidth: 620 }}>
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
