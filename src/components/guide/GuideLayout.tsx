import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'

interface GuideLayoutProps {
  schemas: readonly object[]
  children: React.ReactNode
}

/** Shell for server-rendered guide pages: nav, footer, page width and JSON-LD. */
export function GuideLayout ({ schemas, children }: GuideLayoutProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className='bg-cream min-h-dvh font-sans'>
        <LandingNav topOffset={0} />
        <main className='max-w-[1200px] mx-auto px-6 pb-24'>{children}</main>
        <LandingFooter />
      </div>
    </>
  )
}
