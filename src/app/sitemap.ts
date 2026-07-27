import { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/lib/catalog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const productSlugs = await getAllProductSlugs()
  // Exclude aliases that canonicalize to another URL (e.g. "pawcharms-pakabuciai" -> "charm-charms") —
  // a sitemap should only list self-canonical, index-worthy URLs.
  const CANONICAL_ALIASES = new Set(['pawcharms-pakabuciai'])
  const productEntries = productSlugs
    .filter((slug) => !CANONICAL_ALIASES.has(slug))
    .map((slug) => ({
    url: `https://pawscharm.com/products/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: slug === 'charm-charms' ? 0.75 : 0.7,
  }))

  return [
    {
      url: 'https://pawscharm.com',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://pawscharm.com/en',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://pawscharm.com/products',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://pawscharm.com/en/products',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://pawscharm.com/configure',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: 'https://pawscharm.com/en/configure',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: 'https://pawscharm.com/faq',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://pawscharm.com/guide/how-to-measure-dog-collar',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: 'https://pawscharm.com/guide/silicone-vs-nylon-dog-collars',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    ...productEntries,
  ]
}
