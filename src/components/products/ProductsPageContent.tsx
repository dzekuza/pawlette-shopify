'use client'

import { useState } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { CommerceFooter } from '@/components/shared/CommerceFooter'
import { ALL_CHARMS, PRODUCTS } from '@/lib/data'
import { CharmCard } from './CharmCard'
import { ProductCard } from './ProductCard'
import { ProductFilter, ProductsFilterTabs } from './ProductsFilterTabs'

export function ProductsPageContent () {
  const [filter, setFilter] = useState<ProductFilter>('all')

  const showCollars = filter === 'all' || filter === 'collars'
  const showCharms = filter === 'all' || filter === 'charms'

  return (
    <div className="min-h-screen bg-cream text-bark pt-16">
      <LandingNav topOffset={0} />
      <ProductsFilterTabs filter={filter} onChange={setFilter} />

      <main className="mx-auto px-5 pb-20" style={{ maxWidth: 1160, paddingTop: 20 }}>
        {showCollars && (
          <section>
            {(filter === 'all' || filter === 'collars') && (
              <div className="mb-8">
                <p className="m-0 font-medium text-bark font-sans" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>
                  Collar sets
                </p>
                <span className="mt-1.5 block text-bark-muted" style={{ fontSize: 13 }}>
                  Each includes 5 snap-on charms
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {filter === 'all' && (
          <div className="h-px my-[72px]" style={{ background: 'rgba(61,53,48,0.08)' }} />
        )}

        {showCharms && (
          <section style={{ paddingTop: filter === 'charms' ? 64 : 0 }}>
            {filter === 'all' && (
              <div className="mb-8">
                <p className="m-0 font-medium text-bark font-sans" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>
                  Individual charms
                </p>
                <span className="mt-1.5 block text-bark-muted" style={{ fontSize: 13 }}>
                  Add extras · €4 each
                </span>
              </div>
            )}

            {filter === 'charms' && (
              <div className="mb-8">
                <p className="m-0 font-medium text-bark font-sans" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>
                  Charms
                </p>
                <p className="mt-2 text-bark-muted" style={{ fontSize: 14 }}>
                  Snap on and off in five seconds. Compatible with all collar sets.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {ALL_CHARMS.map((charm) => (
                <CharmCard key={charm.id} charm={charm} />
              ))}
            </div>
          </section>
        )}
      </main>

      <CommerceFooter />
    </div>
  )
}
