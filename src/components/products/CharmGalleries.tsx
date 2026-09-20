'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Charm3DGalleryTile } from '@/components/products/Charm3DGalleryTile'
import { CharmBuilderPanel } from '@/components/products/CharmBuilderPanel'
import { useCharmProduct } from '@/components/products/CharmProductContext'
import { useSwipeGallery } from '@/components/products/useSwipeGallery'
import { CHARM_GALLERY_SURFACE, NAV_H, SPLIT_PANEL_HEIGHT } from '@/components/products/productPageLayout'

/** Mobile charm hero: swipeable photo gallery (3D preview first when charms are picked) above the builder. */
export function CharmMobileHero() {
  const t = useTranslations('products.pdp')
  const {
    state: { displayName, gallery: { images: visibleCharmGallery, index: safeCharmGalleryIndex, charms3D: previewCharms3D, showHero3D: showCharmHero3D } },
    actions: { setGalleryIndex: setCharmGalleryIndex },
  } = useCharmProduct()
  const { handleSwipeStart, handleSwipeEnd, clearSwipe } = useSwipeGallery()

  return (
    <>
          <div style={{ margin: '16px 16px 0' }}>
            <div
              style={{ height: 'auto', borderRadius: 20, overflow: 'hidden', position: 'relative', background: CHARM_GALLERY_SURFACE, aspectRatio: '1 / 1', touchAction: 'pan-y' }}
              onPointerDown={(e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return
                handleSwipeStart(e.clientX)
              }}
              onPointerUp={(e) => handleSwipeEnd(e.clientX, visibleCharmGallery.length, setCharmGalleryIndex)}
              onPointerCancel={clearSwipe}
              onPointerLeave={clearSwipe}
            >
              <div style={{ display: 'flex', height: '100%', transition: 'transform 300ms ease', transform: `translateX(-${safeCharmGalleryIndex * 100}%)` }}>
                {visibleCharmGallery.map((src, index) => (
                  <div key={`${src}-${index}`} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                    {index === 0 && showCharmHero3D ? (
                      <Charm3DGalleryTile items={previewCharms3D} variant="slide" />
                    ) : (
                      <Image
                        src={src}
                        alt={index === safeCharmGalleryIndex ? displayName : ''}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        priority={index === safeCharmGalleryIndex && index === 0}
                        draggable={false}
                        className='select-none object-cover'
                      />
                    )}
                  </div>
                ))}
              </div>
              {visibleCharmGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCharmGalleryIndex((current) => Math.max(current - 1, 0))}
                    style={{ position: 'absolute', left: 0, top: 0, width: '28%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label={t('gallery.prevImage')}
                  />
                  <button
                    type="button"
                    onClick={() => setCharmGalleryIndex((current) => Math.min(current + 1, visibleCharmGallery.length - 1))}
                    style={{ position: 'absolute', right: 0, top: 0, width: '28%', height: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label={t('gallery.nextImage')}
                  />
                </>
              )}
            </div>
            {visibleCharmGallery.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                {visibleCharmGallery.map((_, index) => (
                  <div key={index} onClick={() => setCharmGalleryIndex(index)} style={{ width: index === safeCharmGalleryIndex ? 20 : 6, height: 6, borderRadius: 3, background: index === safeCharmGalleryIndex ? 'var(--color-bark)' : 'rgba(61,53,48,0.2)', cursor: 'pointer', transition: 'width 200ms' }} />
                ))}
              </div>
            )}
          </div>
      <div style={{ padding: '24px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CharmBuilderPanel />
      </div>
    </>
  )
}

/** Standard desktop charm gallery: full-width hero on top, 2x2 thumbnail grid below. */
export function CharmPhotoGrid() {
  const {
    state: { displayName, gallery: { index: safeCharmGalleryIndex, heroImage: charmHeroImage, thumbnails: charmThumbnails, charms3D: previewCharms3D, showHero3D: showCharmHero3D } },
    actions: { setGalleryIndex: setCharmGalleryIndex },
  } = useCharmProduct()
  return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, position: 'sticky', top: NAV_H, alignSelf: 'start', overflow: 'hidden' }}>
            {showCharmHero3D ? (
              <Charm3DGalleryTile items={previewCharms3D} variant="grid" />
            ) : (
              <div style={{ gridColumn: 'span 2', borderRadius: '20px 20px 8px 8px', overflow: 'hidden', background: CHARM_GALLERY_SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 300ms', aspectRatio: '1 / 1', position: 'relative' }}>
                {charmHeroImage ? <Image src={charmHeroImage} alt={displayName} fill sizes='(max-width: 1280px) 50vw, 600px' priority className='object-cover' /> : null}
              </div>
            )}
            {charmThumbnails.map(({ src, index }, thumbIndex) => (
              <div key={`${src}-${index}`} onClick={() => setCharmGalleryIndex(index)} style={{ borderRadius: thumbIndex === charmThumbnails.length - 2 ? '8px 8px 8px 20px' : thumbIndex === charmThumbnails.length - 1 ? '8px 8px 20px 8px' : 8, overflow: 'hidden', background: CHARM_GALLERY_SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', cursor: 'pointer', outline: safeCharmGalleryIndex === index ? '2px solid var(--color-bark)' : 'none', position: 'relative' }}>
                <Image src={src} alt="" fill sizes='(max-width: 1280px) 25vw, 300px' className='object-cover' />
              </div>
            ))}
          </div>
  )
}

/** Split desktop charm stage: one viewport-height sticky 3D (or hero photo) panel. */
export function CharmStage() {
  const {
    state: { displayName, gallery: { heroImage: charmHeroImage, charms3D: previewCharms3D, showHero3D: showCharmHero3D } },
  } = useCharmProduct()
  const splitPanelHeight = SPLIT_PANEL_HEIGHT
  return (
            <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', height: splitPanelHeight, borderRadius: 24, overflow: 'hidden', background: CHARM_GALLERY_SURFACE }}>
              {showCharmHero3D ? (
                <Charm3DGalleryTile items={previewCharms3D} variant='slide' />
              ) : charmHeroImage ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src={charmHeroImage} alt={displayName} fill sizes='50vw' priority className='object-cover' />
                </div>
              ) : null}
            </div>
  )
}
