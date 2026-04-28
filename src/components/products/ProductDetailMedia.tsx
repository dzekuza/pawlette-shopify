import type { ProductDetail } from '@/lib/catalog'

interface ProductDetailMediaProps {
  isMobile: boolean
  product: ProductDetail
}

export function ProductDetailMedia ({ isMobile, product }: ProductDetailMediaProps) {
  const productLabel = product.productType === 'charm' ? 'Vienas pakabukas' : 'Antkaklio rinkinys'
  const imageAspectRatio = product.productType === 'charm'
    ? '1 / 1'
    : (isMobile ? '1 / 1' : '4 / 3')
  const imageFit = product.productType === 'charm' ? 'contain' : 'cover'

  return (
    <div
      style={{
        borderRadius: 24,
        border: '1px solid rgba(61,53,48,0.08)',
        padding: isMobile ? 20 : 28,
        background: `radial-gradient(circle at 20% 20%, ${product.accentColor}55, transparent 45%), linear-gradient(160deg, ${product.tintColor}, #fff)`
      }}
    >
      <div
        style={{
          marginBottom: 18,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 999,
          border: '1px solid rgba(61,53,48,0.08)',
          background: '#fff',
          padding: '7px 12px'
        }}
      >
        <span
          style={{ width: 8, height: 8, borderRadius: '50%', background: product.accentColor }}
        />
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6f6761' }}>
          {productLabel}
        </span>
      </div>

      <img
        src={product.image}
        alt={product.name}
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: imageAspectRatio,
          objectFit: imageFit
        }}
      />
    </div>
  )
}
