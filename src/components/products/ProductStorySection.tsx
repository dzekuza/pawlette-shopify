'use client'

import Image from 'next/image'
import { Eyebrow, DisplayHeading, BodyCopy } from '@/components/storefront/Typography'

export function ProductStorySection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-20">
        <div className="relative order-2 aspect-square w-full overflow-hidden rounded-[28px] bg-surface-2 md:order-1">
          <Image
            src="/hero-figma/hero-dsc01798.jpg"
            alt="Rankų darbo PawCharms antkaklis"
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 md:order-2">
          <Eyebrow className="mb-3">Mūsų istorija</Eyebrow>
          <DisplayHeading size="section" className="mb-5 max-w-[440px] text-bark">
            Gaminama rankomis, kad tarnautų metų metus
          </DisplayHeading>
          <BodyCopy className="max-w-[440px]">
            Kiekvienas PawCharms antkaklis siuvamas rankomis Lietuvoje iš BioThane medžiagos —
            atsparios vandeniui, purvui ir nubluko spalvai. Pasirinkite dydį, spalvą ir
            pakabukus, kurie atspindi jūsų šuns charakterį, ir gaukite daiktą, kuris atlaikys
            kiekvieną nuotykį.
          </BodyCopy>
        </div>
      </div>
    </section>
  )
}
