'use client'

import Image from 'next/image'
import { Eyebrow, DisplayHeading, BodyCopy } from '@/components/storefront/Typography'

interface ProductStorySectionProps {
  eyebrow?: string
  title?: string
  body?: string
  imageAlt?: string
}

export function ProductStorySection({
  eyebrow = 'Mūsų istorija',
  title = 'Gaminama rankomis, kad tarnautų metų metus',
  body = 'Kiekvienas PawsCharm antkaklis siuvamas rankomis Lietuvoje iš BioThane medžiagos — atsparios vandeniui, purvui ir nubluko spalvai. Pasirinkite dydį, spalvą ir pakabukus, kurie atspindi jūsų šuns charakterį, ir gaukite daiktą, kuris atlaikys kiekvieną nuotykį.',
  imageAlt = 'Rankų darbo PawsCharm antkaklis',
}: ProductStorySectionProps) {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-20">
        <div className="relative order-2 aspect-square w-full overflow-hidden rounded-[28px] bg-surface-2 md:order-1">
          <Image
            src="/hero-figma/hero-dsc01798.jpg"
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 md:order-2">
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <DisplayHeading size="section" className="mb-5 max-w-[440px] text-bark">
            {title}
          </DisplayHeading>
          <BodyCopy className="max-w-[440px]">
            {body}
          </BodyCopy>
        </div>
      </div>
    </section>
  )
}
