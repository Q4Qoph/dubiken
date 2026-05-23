'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatKshLabel } from '@/lib/currency';
import { HUB_LABELS, HUB_OPTIONS, type HubCode } from '@/lib/contracts/enums';

const BLUE = '#004aad';

const HUB_FLAG: Record<string, string> = Object.fromEntries(
  HUB_OPTIONS.map((h) => [h.code, h.flag]),
);

function hubDisplayLabel(origin: string): string {
  if (origin in HUB_LABELS) return HUB_LABELS[origin as HubCode];
  return origin;
}

export interface ProductCardItem {
  productId: string;
  name: string;
  image_url: string;
  origin: string;
  price_kes: string;
  stock: number;
}

type ProductCardProps = {
  product: ProductCardItem;
  href?: string;
  className?: string;
  footer?: ReactNode;
};

export default function ProductCard({ product, href, className = '', footer }: ProductCardProps) {
  const link = href ?? `/product/${product.productId}`;
  const flag = HUB_FLAG[product.origin] ?? '🌐';
  const priceLabel = formatKshLabel(product.price_kes);
  const stock = Math.max(0, product.stock ?? 0);

  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden bg-white border border-[#c3c6d5] hover:border-[#004aad] transition-colors ${className}`}
    >
      <Link href={link} className="relative block bg-[#eff4ff] h-36 sm:h-[168px] border-b border-[#c3c6d5]">
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white border border-black text-[10px] font-semibold text-[#0b1c30] px-2 py-0.5 leading-none">
          <span aria-hidden>{flag}</span>
          {hubDisplayLabel(product.origin)}
        </span>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
        ) : (
          <div className="absolute inset-0 bg-[#dce9ff]" />
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 bg-white">
        <p className="text-xl font-bold tabular-nums" style={{ color: BLUE }}>
          {priceLabel}
        </p>

        <p className="mt-1 text-xs font-medium text-[#737784]">
          {stock === 0 ? 'Out of stock' : `${stock.toLocaleString()} in stock`}
        </p>

        <Link href={link} className="block mt-2">
          <h3 className="text-sm font-bold text-[#0b1c30] leading-snug line-clamp-2 hover:text-[#004aad]">
            {product.name}
          </h3>
        </Link>

        {footer ? <div className="mt-auto pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}
