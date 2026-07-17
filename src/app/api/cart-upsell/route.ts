import { NextRequest, NextResponse } from 'next/server'
import { getCollars, getLeashes } from '@/lib/shopify'
import { buildCollarProduct, buildGroupedLeashProduct } from '@/lib/catalog'

export async function GET(request: NextRequest) {
  const titlesParam = request.nextUrl.searchParams.get('titles') ?? ''
  const cartTitles = titlesParam
    .split(',')
    .map((title) => title.trim().toLowerCase())
    .filter(Boolean)

  const [collars, leashes] = await Promise.all([getCollars(), getLeashes()])

  const hasLeashInCart = leashes.some((leash) =>
    cartTitles.includes(leash.title.toLowerCase()) || cartTitles.includes((leash.parentTitle ?? '').toLowerCase())
  )
  const hasCollarInCart = collars.some((collar) =>
    cartTitles.includes(collar.title.toLowerCase()) || cartTitles.includes((collar.parentTitle ?? '').toLowerCase())
  )

  const product = !hasLeashInCart && leashes.length > 0
    ? buildGroupedLeashProduct(leashes)
    : !hasCollarInCart && collars.length > 0
      ? buildCollarProduct(collars[0])
      : null

  if (!product) return NextResponse.json({ product: null })

  return NextResponse.json({
    product: {
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      variantId: product.variantId,
      productType: product.productType,
      leashColors: product.leashColors,
      leashVariants: product.leashVariants,
    },
  })
}
