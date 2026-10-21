'use client'

import Image from 'next/image'
import { Eyebrow, DisplayHeading, BodyCopy } from '@/components/storefront/Typography'

interface ProductStorySectionProps {
  eyebrow?: string
  title?: string
  body?: string
  imageAlt?: string
  secondImageAlt?: string
}

export function ProductStorySection({
  eyebrow = 'Mūsų istorija',
  title = 'Gaminama rankomis, kad tarnautų metų metus',
  body = 'Kiekvienas PawsCharm antkaklis siuvamas rankomis Lietuvoje iš BioThane medžiagos — atsparios vandeniui, purvui ir nubluko spalvai. Pasirinkite dydį, spalvą ir pakabukus, kurie atspindi jūsų šuns charakterį, ir gaukite daiktą, kuris atlaikys kiekvieną nuotykį.',
  imageAlt = 'Rankų darbo PawsCharm antkaklis',
  secondImageAlt = 'Juodai baltas šuo su rožiniu PawsCharm antkakliu ir violetiniais pakabukais-raidėmis „META“',
}: ProductStorySectionProps) {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:gap-20 md:px-6 md:py-24">
        {/* Photo pair: large frame with a smaller tilted one overlapping its corner */}
        <div className="relative order-2 mx-auto aspect-[4/5] w-full max-w-[520px] md:order-1">
          <div className="absolute inset-0 right-[12%] overflow-hidden rounded-[32px] bg-surface-2">
            <Image
              src="/hero-figma/hero-dsc01798.jpg"
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 460px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 right-0 h-[42%] w-[44%] rotate-3 overflow-hidden rounded-[28px] bg-surface-2 ring-4 ring-cream transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-1">
            <Image
              src="/hero-figma/hero-dsc02225.jpg"
              alt={secondImageAlt}
              fill
              sizes="(min-width: 768px) 230px, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-5 md:order-2">
          <Eyebrow className="w-fit rounded-full bg-bark/5 px-3 py-1.5 leading-none text-bark-light">{eyebrow}</Eyebrow>
          <DisplayHeading size="section" className="max-w-[460px] text-bark">
            {title}
          </DisplayHeading>
          <BodyCopy className="max-w-[460px]">
            {body}
          </BodyCopy>
        </div>
      </div>
    </section>
  )
}
