const SITE = 'https://pawscharm.com'
const ORGANIZATION = { '@type': 'Organization', name: 'PawsCharm', url: SITE } as const

export interface GuideFaqItem {
  question: string
  answer: string
}

export function buildArticleSchema ({ title, description, path, published, modified }: {
  title: string
  description: string
  path: string
  published: string
  modified: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'lt',
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: `${SITE}${path}`,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
  }
}

export function buildFaqSchema (items: readonly GuideFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'lt',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function buildBreadcrumbSchema (name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pradžia', item: SITE },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
    ],
  }
}
