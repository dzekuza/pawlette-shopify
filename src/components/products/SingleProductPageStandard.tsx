'use client'

import type { ProductDetail } from '@/lib/catalog'
import { CharmPhotoGrid } from '@/components/products/CharmGalleries'
import { CharmBuilderPanel } from '@/components/products/CharmBuilderPanel'
import { CollarBuyPanel } from '@/components/products/CollarBuyPanel'
import { CollarPhotoGrid } from '@/components/products/CollarGalleries'
import { ProductPageBody } from '@/components/products/ProductPageBody'
import { ProductPageProvider } from '@/components/products/ProductPageContext'
import { NAV_H } from '@/components/products/productPageLayout'

/** Standard product page: photo grid on the left, a sticky detail column on the right. */
export function SingleProductPageStandard({ product }: { product: ProductDetail }) {
  return (
    <ProductPageProvider product={product}>
      <ProductPageBody
        desktopCollar={
          <>
            <CollarPhotoGrid />
            <div style={{ position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, paddingLeft: 8, paddingRight: 8 }}>
              <CollarBuyPanel />
            </div>
          </>
        }
        desktopCharm={
          <>
            <CharmPhotoGrid />
            <div style={{ position: 'sticky', top: NAV_H + 16, alignSelf: 'start', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <CharmBuilderPanel />
            </div>
          </>
        }
      />
    </ProductPageProvider>
  )
}
