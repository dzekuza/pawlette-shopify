'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const MAX_IMAGES = 4
const CYCLE_MS = 1100

interface HoverImageCarouselProps {
  alt: string
  images: string[]
  sizes: string
}

/**
 * Crossfading image stack for catalog cards. Shows the first image at rest;
 * while a mouse hovers the media it cycles through the rest and resets on
 * leave. Extra images mount only after the first hover so they cost nothing
 * until used. Touch and reduced-motion users keep the static first image.
 */
export function HoverImageCarousel ({ alt, images, sizes }: HoverImageCarouselProps) {
  const gallery = images.slice(0, MAX_IMAGES)
  const [active, setActive] = useState(0)
  const [armed, setArmed] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setActive(0)
  }, [])

  const start = useCallback(() => {
    if (gallery.length < 2 || timer.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
    setActive(1)
    timer.current = setInterval(() => setActive((i) => (i + 1) % gallery.length), CYCLE_MS)
  }, [gallery.length])

  useEffect(() => stop, [stop])

  return (
    <div
      className='absolute inset-0'
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') start() }}
      onPointerLeave={stop}
    >
      <div className='absolute inset-0 transition-transform duration-[250ms] ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105'>
        {gallery.map((src, i) => (
          (i === 0 || armed) ? (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? alt : ''}
              fill
              sizes={sizes}
              className={cn(
                'block h-full w-full object-cover transition-opacity duration-500 ease-out',
                i === active ? 'opacity-100' : 'opacity-0',
              )}
            />
          ) : null
        ))}
      </div>
      {gallery.length > 1 ? (
        <div className='pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 opacity-0 transition-opacity duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100'>
          {gallery.map((src, i) => (
            <span
              key={src}
              className={cn(
                'h-1.5 rounded-full bg-white shadow-[0_1px_3px_rgba(61,53,48,0.3)] transition-[width,opacity] duration-300 ease-out',
                i === active ? 'w-4 opacity-100' : 'w-1.5 opacity-60',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
