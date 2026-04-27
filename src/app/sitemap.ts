import { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/lib/catalog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const productSlugs = await getAllProductSlugs()
  const productEntries = productSlugs.map((slug) => ({
    url: `https://pawcharms.lt/products/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: slug === 'charm-charms' ? 0.75 : 0.7,
  }))

  return [
    {
      url: 'https://pawcharms.lt',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://pawcharms.lt/products',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://pawcharms.lt/guide/how-to-measure-dog-collar',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: 'https://pawcharms.lt/guide/silicone-vs-nylon-dog-collars',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: 'https://pawcharms.lt/coming-soon',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productEntries,
  ]
}
