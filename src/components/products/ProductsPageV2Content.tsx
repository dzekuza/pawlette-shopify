'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useCartCount } from '@/hooks/useCartCount'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import type { ProductDetail } from '@/lib/catalog'
import { ProductCard } from './ProductCard'
import { PageHero } from '@/components/storefront/PageHero'
import { cn } from '@/lib/utils'

interface ProductsPageV2ContentProps {
  products: ProductDetail[]
}

type CategoryFilter = 'all' | ProductDetail['productType']
type SortOption = 'featured' | 'price-asc' | 'price-desc'

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Visi' },
  { value: 'collar', label: 'Antkakliai' },
  { value: 'charm', label: 'Pakabukai' },
  { value: 'leash', label: 'Pavadėliai' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Rekomenduojama' },
  { value: 'price-asc', label: 'Kaina: nuo mažiausios' },
  { value: 'price-desc', label: 'Kaina: nuo didžiausios' },
]

function parsePrice (price: string): number {
  const numeric = Number(price.replace(/[^0-9.,]/g, '').replace(',', '.'))
  return Number.isFinite(numeric) ? numeric : 0
}

export function ProductsPageV2Content ({ products }: ProductsPageV2ContentProps) {
  const router = useRouter()
  const cartCount = useCartCount()
  const width = useWindowWidth() ?? 1200
  const isMobile = width < 768
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sort, setSort] = useState<SortOption>('featured')

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length }
    for (const product of products) {
      counts[product.productType] = (counts[product.productType] ?? 0) + 1
    }
    return counts
  }, [products])

  const visibleProducts = useMemo(() => {
    const filtered = category === 'all' ? products : products.filter((product) => product.productType === category)

    if (sort === 'price-asc') {
      return [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    }
    if (sort === 'price-desc') {
      return [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    }
    return filtered
  }, [products, category, sort])

  return (
    <>
      <LandingNav cartCount={cartCount} />

      <main className='mx-auto max-w-[1200px]' style={{ padding: isMobile ? '32px 16px' : '64px 48px' }}>
        <PageHero
          tone='hero'
          eyebrow='Parduotuvė'
          title='Antkakliai, pakabukai ir deriniai jiems.'
          description='Rinkitės vandeniui atsparius antkaklius, naršykite keičiamus pakabukus ir raskite paruoštą derinį vienoje vietoje.'
        />

        <div className='grid grid-cols-1 gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:items-start'>
          <aside className='top-24 flex flex-row gap-2 overflow-x-auto pb-2 md:sticky md:flex-col md:gap-1.5 md:overflow-visible md:pb-0'>
            {CATEGORY_OPTIONS.map((option) => {
              const isActive = category === option.value
              const count = categoryCounts[option.value] ?? 0
              return (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setCategory(option.value)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2.5 text-left font-sans text-[14px] font-medium transition-colors duration-150 ease-out md:rounded-[14px]',
                    isActive
                      ? 'bg-bark text-cream'
                      : 'bg-surface-2 text-bark-muted hover:bg-bark/10'
                  )}
                >
                  {option.label}
                  <span className={cn('ml-1.5 text-[12px]', isActive ? 'text-cream/60' : 'text-bark-muted/70')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </aside>

          <div>
            <div className='mb-5 flex items-center justify-between gap-3 border-b border-border pb-4'>
              <span className='font-sans text-[13px] text-bark-muted'>
                {visibleProducts.length} {visibleProducts.length === 1 ? 'prekė' : 'prekės'}
              </span>
              <label className='relative inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2'>
                <ArrowUpDown className='h-3.5 w-3.5 shrink-0 text-bark-muted' aria-hidden='true' />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className='cursor-pointer appearance-none bg-transparent font-sans text-[13px] font-medium text-bark focus:outline-none'
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {visibleProducts.length > 0 ? (
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5'>
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className='rounded-[20px] bg-surface-2 px-6 py-12 text-center'>
                <p className='font-sans text-[14px] text-bark-muted'>Šioje kategorijoje prekių kol kas nėra.</p>
                <button
                  type='button'
                  onClick={() => router.push('/products')}
                  className='mt-3 font-sans text-[13px] font-medium text-interactive-text underline underline-offset-2'
                >
                  Grįžti į visas prekes
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <LandingFooter />
    </>
  )
}
