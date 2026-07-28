import { NextRequest, NextResponse } from 'next/server'
import { getCollars, getLeashes } from '@/lib/shopify'
import { buildCollarProduct, buildGroupedLeashProduct } from '@/lib/catalog'

export async function GET(request: NextRequest) {
  const titlesParam = request.nextUrl.searchParams.get('titles') ?? ''
  const cartTitles = titlesParam
    .split(',')
    .map((title) => title.trim().toLowerCase())
    .filter(Boolean)

  // Locale is threaded through so buildGroupedLeashProduct/buildCollarProduct
  // apply the English-name overlay (see catalog.ts's applyLocaleOverlay) —
  // the client (CartUpsell.tsx) sends its own resolved locale as a query
  // param since this route has no NextIntlClientProvider/cookie context of
  // its own to read it from.
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'lt'

  const [collars, leashes] = await Promise.all([getCollars(), getLeashes()])

  const hasLeashInCart = leashes.some((leash) =>
    cartTitles.includes(leash.title.toLowerCase()) || cartTitles.includes((leash.parentTitle ?? '').toLowerCase())
  )
  const hasCollarInCart = collars.some((collar) =>
    cartTitles.includes(collar.title.toLowerCase()) || cartTitles.includes((collar.parentTitle ?? '').toLowerCase())
  )

  const product = !hasLeashInCart && leashes.length > 0
    ? buildGroupedLeashProduct(leashes, locale)
    : !hasCollarInCart && collars.length > 0
      ? buildCollarProduct(collars[0], undefined, locale)
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
