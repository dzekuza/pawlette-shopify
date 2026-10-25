import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArViewer } from '@/components/products/ArViewer'
import { parseArShare } from '@/lib/ar-share'

export const metadata: Metadata = {
  title: 'AR',
  robots: { index: false, follow: false },
}

export default async function ArPage({ searchParams }: { searchParams: Promise<{ c?: string | string[]; i?: string | string[] }> }) {
  const build = parseArShare(await searchParams)
  if (!build) notFound()
  return <ArViewer build={build} />
}
