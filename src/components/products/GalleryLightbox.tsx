'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export function GalleryLightbox({ images, index, onClose, onIndexChange }: { images: string[]; index: number; onClose: () => void; onIndexChange: (index: number) => void }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, images.length, onClose, onIndexChange])

  return (
    <div
      className="fade-in bg-bark/85"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
    >
      <button
        onClick={onClose}
        aria-label="Uždaryti"
        className="btn-press"
        style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', cursor: 'pointer', fontSize: 32, color: 'var(--color-cream)', lineHeight: 1 }}
      >
        ×
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onIndexChange((index - 1 + images.length) % images.length) }}
          aria-label="Ankstesnė nuotrauka"
          className="btn-press"
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 40, color: 'var(--color-cream)', lineHeight: 1 }}
        >
          ‹
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: 'min(90vw, 900px)', height: 'min(80vh, 900px)', borderRadius: 20, overflow: 'hidden' }}
      >
        <Image src={images[index]} alt="" fill sizes="90vw" className="object-contain" priority />
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onIndexChange((index + 1) % images.length) }}
          aria-label="Kita nuotrauka"
          className="btn-press"
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 40, color: 'var(--color-cream)', lineHeight: 1 }}
        >
          ›
        </button>
      )}
    </div>
  )
}
