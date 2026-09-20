'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Collar3DGalleryTile } from '@/components/products/Collar3DGalleryTile'
import { CollarBuyPanel } from '@/components/products/CollarBuyPanel'
import { useProductPage } from '@/components/products/ProductPageContext'
import { useSwipeGallery } from '@/components/products/useSwipeGallery'
import { NAV_H, SPLIT_PANEL_HEIGHT } from '@/components/products/productPageLayout'

/** Mobile collar/leash hero: swipeable gallery (3D preview is slide 0 for collars) above the buy panel. */
export function CollarMobileHero() {
  const t = useTranslations('products.pdp')
  const { state: { configurator: { collar, selectedCollarCharms }, gallery }, meta: { showCollar3DViewer } } = useProductPage()
  const [activeSlide, setActiveSlide] = useState(0)
  const { handleSwipeStart, handleSwipeEnd, clearSwipe } = useSwipeGallery()

  return (
    <>
          <div style={{ padding: '16px 20px 0' }}>
            {/* Slider — the 3D preview is slide 0 when this is a collar, so it's visible without any extra tap */}
            {(() => {
              const show3DSlide = showCollar3DViewer
              const totalSlides = gallery.length + (show3DSlide ? 1 : 0)
              const on3DSlide = show3DSlide && activeSlide === 0
              return (
                <>
                  <div
                    style={{ aspectRatio: '1 / 1', borderRadius: 20, overflow: 'hidden', position: 'relative', touchAction: on3DSlide ? 'none' : 'pan-y' }}
                    onPointerDown={(e) => {
                      if (on3DSlide) return
                      if (e.pointerType === 'mouse' && e.button !== 0) return
                      handleSwipeStart(e.clientX)
                    }}
                    onPointerUp={(e) => {
                      if (on3DSlide) return
                      handleSwipeEnd(e.clientX, totalSlides, setActiveSlide)
                    }}
                    onPointerCancel={clearSwipe}
                    onPointerLeave={clearSwipe}
                  >
                    <div style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${activeSlide * 100}%)` }}>
                      {show3DSlide && (
                        <Collar3DGalleryTile
                          collar={collar}
                          selectedCharms={selectedCollarCharms}
                          variant="slide"
                        />
                      )}
                      {gallery.map((src, i) => (
                        <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                          <Image
                            src={src}
                            alt={i > 0
                              ? t('gallery.collarAltWithPhoto', { title: collar?.title ?? '', n: i + 1 })
                              : t('gallery.collarAlt', { title: collar?.title ?? '' })}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            priority={i === 0 && !show3DSlide}
                            draggable={false}
                            className='select-none object-cover'
                          />
                        </div>
                      ))}
                    </div>
                    {activeSlide > 0 && (
                      <button
                        onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                        aria-label={t('gallery.prev')}
                        style={{
                          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.8)',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-bark)',
                        }}
                      >
                        <ChevronLeft size={16} strokeWidth={2.2} />
                      </button>
                    )}
                    {activeSlide < totalSlides - 1 && (
                      <button
                        onClick={() => setActiveSlide(s => Math.min(totalSlides - 1, s + 1))}
                        aria-label={t('gallery.next')}
                        style={{
                          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.8)',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-bark)',
                        }}
                      >
                        <ChevronRight size={16} strokeWidth={2.2} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                    {Array.from({ length: totalSlides }, (_, i) => (
                      <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
                    ))}
                  </div>
                  {gallery.length > 1 && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      {gallery.slice(0, 4).map((src, i) => {
                        const slideIndex = show3DSlide ? i + 1 : i
                        return (
                          <button
                            key={`${src}-${i}`}
                            type="button"
                            onClick={() => setActiveSlide(slideIndex)}
                            aria-label={t('gallery.showPhoto', { n: i + 1 })}
                            style={{
                              flex: '1 0 0', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden', position: 'relative',
                              border: `1px solid ${activeSlide === slideIndex ? 'var(--color-bark)' : 'var(--color-border)'}`,
                              padding: 0, cursor: 'pointer', background: 'none',
                            }}
                          >
                            <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )
            })()}
          </div>

      {/* Right panel on mobile */}
      <div style={{ padding: '24px 20px 104px' }}>
        <CollarBuyPanel />
      </div>
    </>
  )
}

/** Standard desktop collar gallery: 3D tile plus a 2-column photo grid that opens the lightbox. */
export function CollarPhotoGrid() {
  const t = useTranslations('products.pdp')
  const { state: { configurator: { collar, selectedCollarCharms }, gallery }, actions: { openLightbox }, meta: { showCollar3DViewer } } = useProductPage()
  const setLightboxIndex = openLightbox
  return (
    <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              position: 'sticky', top: NAV_H, alignSelf: 'start', overflow: 'hidden',
            }}
          >
            {showCollar3DViewer && (
              <Collar3DGalleryTile
                collar={collar}
                selectedCharms={selectedCollarCharms}
              />
            )}
            {gallery.map((src, i) => (
              <button
                key={i}
                type='button'
                onClick={() => setLightboxIndex(i)}
                aria-label={t('gallery.zoomPhoto')}
                style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1', border: 'none', padding: 0, cursor: 'zoom-in' }}
              >
                <Image
                  src={src}
                  alt={i === 0 ? t('gallery.collarAltPlain', { title: collar?.title ?? '' }) : ''}
                  fill
                  sizes='(max-width: 1280px) 50vw, 600px'
                  priority={i === 0}
                  className='object-cover'
                />
              </button>
            ))}
          </div>
  )
}

/** Split desktop collar stage: one viewport-height sticky 3D (or hero photo) panel. */
export function CollarStage() {
  const t = useTranslations('products.pdp')
  const { state: { configurator: { collar, selectedCollarCharms }, gallery }, meta: { showCollar3DViewer } } = useProductPage()
  const splitPanelHeight = SPLIT_PANEL_HEIGHT
  return (
            <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', height: splitPanelHeight, borderRadius: 24, overflow: 'hidden', background: 'var(--color-surface-2)' }}>
              {showCollar3DViewer ? (
                <Collar3DGalleryTile
                  collar={collar}
                  selectedCharms={selectedCollarCharms}
                  variant='slide'
                />
              ) : gallery[0] ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={gallery[0]}
                    alt={t('gallery.collarAltPlain', { title: collar?.title ?? '' })}
                    fill
                    sizes='50vw'
                    priority
                    className='object-cover'
                  />
                </div>
              ) : null}
            </div>
  )
}
