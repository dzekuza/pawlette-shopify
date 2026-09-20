'use client'

import type { ProductDetail } from '@/lib/catalog'
import { CharmStage } from '@/components/products/CharmGalleries'
import { CharmBuilderPanel } from '@/components/products/CharmBuilderPanel'
import { CollarBuyPanel } from '@/components/products/CollarBuyPanel'
import { CollarStage } from '@/components/products/CollarGalleries'
import { ProductPageBody } from '@/components/products/ProductPageBody'
import { ProductPageProvider } from '@/components/products/ProductPageContext'
import { NAV_H, SPLIT_PANEL_HEIGHT } from '@/components/products/productPageLayout'

/** Split product page: a viewport-height sticky 3D/media stage on the left and an independently scrollable detail panel on the right. */
export function SingleProductPageSplit({ product }: { product: ProductDetail }) {
  return (
    <ProductPageProvider product={product}>
      <ProductPageBody
        desktopCollar={
          <>
            <CollarStage />
            <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', height: SPLIT_PANEL_HEIGHT, overflowY: 'auto', minWidth: 0, paddingLeft: 8, paddingRight: 8, paddingBottom: 24 }}>
              <CollarBuyPanel />
            </div>
          </>
        }
        desktopCharm={
          <>
            <CharmStage />
            <div style={{ position: 'sticky', top: NAV_H, alignSelf: 'start', height: SPLIT_PANEL_HEIGHT, overflowY: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
              <CharmBuilderPanel />
            </div>
          </>
        }
      />
    </ProductPageProvider>
  )
}
