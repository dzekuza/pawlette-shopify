'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { addLinesToCart, type ShopifyCartLine } from '@/lib/cart';

const LEASH_COLOR_HEX: Record<string, string> = {
  pink: '#F4B5C0',
  purple: '#C3A8D5',
  'dark blue': '#6B9FD4',
  blue: '#B8D8F4',
  yellow: '#F9E4A0',
  sage: '#A8D5A2',
  blossom: '#F4B5C0',
  sky: '#B8D8F4',
  honey: '#F9E4A0',
  melyna: '#B8D8F4',
  'tamsiai melyna': '#6B9FD4',
  rozine: '#F4B5C0',
  geltona: '#F9E4A0',
  violetine: '#C3A8D5',
  mėlyna: '#B8D8F4',
  'tamsiai mėlyna': '#6B9FD4',
  rožinė: '#F4B5C0',
  violetinė: '#C3A8D5',
};

interface UpsellLeashVariant {
  id: string;
  color: string;
  price: string;
  image?: string;
}

interface UpsellProduct {
  slug: string;
  name: string;
  price: string;
  image: string;
  variantId: string;
  productType: 'collar' | 'charm' | 'leash';
  leashColors?: string[];
  leashVariants?: UpsellLeashVariant[];
}

export function CartUpsell({ lines }: { lines: ShopifyCartLine[] }) {
  const cartTitles = lines.map((line) => line.merchandise.product.title).join(',');

  const [product, setProduct] = useState<UpsellProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/cart-upsell?titles=${encodeURIComponent(cartTitles)}`)
      .then((res) => res.json())
      .then((data: { product: UpsellProduct | null }) => {
        if (cancelled) return;
        setProduct(data.product);
        setSelectedColor(data.product?.leashColors?.[0] ?? '');
      })
      .catch(() => { if (!cancelled) setProduct(null); });
    return () => { cancelled = true; };
  }, [cartTitles]);

  if (!product) return null;

  const variant = product.leashVariants?.find((v) => v.color.toLowerCase() === selectedColor.toLowerCase());
  const variantId = variant?.id ?? product.variantId;
  const price = variant?.price ?? product.price;
  const image = variant?.image ?? product.image;

  async function handleAdd() {
    if (adding || added) return;
    setAdding(true);
    try {
      await addLinesToCart([{ merchandiseId: variantId, quantity: 1 }]);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mb-4 rounded-2xl border border-bark/8 bg-white p-3">
      <span className="mb-2.5 block text-[12px] font-semibold text-bark">Pridėk prie užsakymo</span>
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-surface-2">
          <Image src={image} alt={product.name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-bark">{product.name}</p>
          <span className="text-[13px] font-bold text-interactive-text">{price}</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={adding || added}
          aria-label={`Pridėti ${product.name} į krepšelį`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-none text-[20px] leading-none text-cream transition-opacity ${
            added ? 'bg-interactive-text' : 'bg-bark'
          } ${adding || added ? 'cursor-default' : 'cursor-pointer'} ${adding ? 'opacity-60' : 'opacity-100'}`}
        >
          {added ? '✓' : '+'}
        </button>
      </div>

      {product.leashColors && product.leashColors.length > 1 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {product.leashColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              title={color}
              aria-label={color}
              className="h-6 w-6 rounded-full border-none p-0 cursor-pointer transition-transform"
              style={{
                background: LEASH_COLOR_HEX[color.toLowerCase()] ?? '#ccc',
                outline: color === selectedColor ? '2.5px solid var(--color-bark)' : '1.5px solid var(--color-bark-border)',
                outlineOffset: 2,
                transform: color === selectedColor ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
