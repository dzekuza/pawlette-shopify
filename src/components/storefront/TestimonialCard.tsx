'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { SurfaceCard, SurfaceCardBody } from '@/components/storefront/SurfaceCard'
import { cn } from '@/lib/utils'

interface ReviewStarsProps {
  rating: number
  className?: string
  showValue?: boolean
  textClassName?: string
}

export function ReviewStars ({ rating, className, showValue = true, textClassName }: ReviewStarsProps) {
  return (
    <div className={cn('flex items-center gap-[3px]', className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} aria-hidden className='size-4 fill-[#F9E4A0] text-[#F9E4A0]' strokeWidth={1.5} />
      ))}
      {showValue ? (
        <span className={cn('ml-1 font-sans text-xs font-semibold text-white/90', textClassName)}>
          {rating.toFixed(1)}
        </span>
      ) : null}
    </div>
  )
}

interface TestimonialMediaCardProps {
  author: string
  avatar: string
  preview: string
  quote: string
  rating: number
  className?: string
  sizes?: string
  style?: CSSProperties
}

export function TestimonialMediaCard ({
  author,
  avatar,
  preview,
  quote,
  rating,
  className,
  sizes = '(max-width: 639px) 260px, (max-width: 1023px) 280px, 300px',
  style,
}: TestimonialMediaCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-[20px]', className)} style={style}>
      <Image src={preview} alt={author} fill sizes={sizes} className='block h-full w-full object-cover' />
      <div className='absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.1)_50%,transparent_100%)]' />
      <div className='absolute inset-x-0 bottom-0 p-[20px_18px]'>
        <ReviewStars rating={rating} />
        <p className='my-2 mb-3.5 font-sans text-[13px] leading-[1.5] text-white/[0.92]'>
          &ldquo;{quote}&rdquo;
        </p>
        <div className='flex items-center gap-2'>
          <Image src={avatar} alt={author} width={28} height={28} className='rounded-full border-2 border-white/50 object-cover' />
          <span className='font-sans text-xs font-medium text-white/80'>{author}</span>
        </div>
      </div>
    </div>
  )
}

interface TestimonialQuoteCardProps {
  author: string
  quote: string
  className?: string
}

export function TestimonialQuoteCard ({ author, quote, className }: TestimonialQuoteCardProps) {
  return (
    <SurfaceCard
      variant='white'
      padding='compact'
      className={cn(
        'rounded-[18px] border border-border/80 bg-[linear-gradient(180deg,rgba(255,253,249,0.96)_0%,rgba(244,239,232,0.92)_100%)]',
        className
      )}
    >
      <SurfaceCardBody className='gap-3'>
        <p className='m-0 font-sans text-[14px] leading-[1.6] text-bark-light'>
          &ldquo;{quote}&rdquo;
        </p>
        <span className='font-sans text-[13px] font-semibold text-bark-muted'>
          {author}
        </span>
      </SurfaceCardBody>
    </SurfaceCard>
  )
}
