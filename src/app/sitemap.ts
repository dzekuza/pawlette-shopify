import { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/lib/catalog'

// Real per-route "last meaningfully changed" dates for static pages — bump the entry
// when that page's visible content or metadata actually changes. Using `new Date()`
// here would mark every static page as changing on every build, giving Google no
// real freshness signal to prioritize re-crawls with.
const STATIC_LAST_MODIFIED: Record<string, string> = {
  home: '2026-08-05',
  products: '2026-08-05',
  faq: '2026-08-05',
  pavadeliai: '2026-08-05',
  guideMeasure: '2026-08-05',
  guideMaterial: '2026-08-05',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const products = await getAllProductSlugs()
  // Exclude aliases that canonicalize to another URL (e.g. "pawcharms-pakabuciai" -> "charm-charms")
  // and thin letter×color charm variants (noindexed in generateMetadata, see products/[slug]/page.tsx)
  // — a sitemap should only list self-canonical, index-worthy URLs.
  const CANONICAL_ALIASES = new Set(['pawcharms-pakabuciai'])
  const indexableProducts = products.filter(({ slug, charmCategory }) => !CANONICAL_ALIASES.has(slug) && charmCategory !== 'letter')
  const productEntries = indexableProducts.map(({ slug, updatedAt }) => ({
    url: `https://pawscharm.com/products/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: slug === 'charm-charms' ? 0.75 : 0.7,
  }))
  // English PDPs (locale === 'en') became indexable alongside their LT counterparts —
  // list them too so Google discovers them without waiting on crawl/hreflang alone.
  const enProductEntries = indexableProducts.map(({ slug, updatedAt }) => ({
    url: `https://pawscharm.com/en/products/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: slug === 'charm-charms' ? 0.7 : 0.65,
  }))

  return [
    {
      url: 'https://pawscharm.com',
      lastModified: STATIC_LAST_MODIFIED.home,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://pawscharm.com/en',
      lastModified: STATIC_LAST_MODIFIED.home,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://pawscharm.com/products',
      lastModified: STATIC_LAST_MODIFIED.products,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://pawscharm.com/en/products',
      lastModified: STATIC_LAST_MODIFIED.products,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://pawscharm.com/faq',
      lastModified: STATIC_LAST_MODIFIED.faq,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://pawscharm.com/pavadeliai',
      lastModified: STATIC_LAST_MODIFIED.pavadeliai,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: 'https://pawscharm.com/guide/how-to-measure-dog-collar',
      lastModified: STATIC_LAST_MODIFIED.guideMeasure,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: 'https://pawscharm.com/guide/silicone-vs-nylon-dog-collars',
      lastModified: STATIC_LAST_MODIFIED.guideMaterial,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    ...productEntries,
    ...enProductEntries,
  ]
}
