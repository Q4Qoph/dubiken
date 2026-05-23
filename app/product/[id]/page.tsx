'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import { useProduct, useRelatedProducts } from '@/lib/api/hooks';
import { usePromptedCart } from '@/hooks/use-prompted-cart';
import { formatKshLabel } from '@/lib/currency';
import {
  marketplaceProductHref,
  marketplaceReturnHref,
} from '@/lib/marketplace-navigation';

const BLUE = '#004aad';
const SECTION_BG = '#eff4ff';
const ORANGE_SAVE = '#ff924d';

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#e5eeff] last:border-0">
      <span className="text-sm font-normal text-[#434653]">{label}</span>
      <span className="text-sm font-bold text-right" style={{ color: BLUE }}>
        {value}
      </span>
    </div>
  );
}

function ProductDetailContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const marketplaceBackHref = useMemo(
    () => marketplaceReturnHref(searchParams),
    [searchParams],
  );
  const { data: product, isLoading } = useProduct(params.id);
  const { data: relatedProducts = [] } = useRelatedProducts(params.id, 4);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const { addToCart, buyNow, GuestCartPrompt } = usePromptedCart();

  function cartPayload() {
    if (!product) return null;
    return {
      id: product.id,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: 0,
      unitPriceKes: product.price_kes,
      origin: product.origin,
      imageUrl: product.image_url,
      quantity,
    };
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center text-[#737784]">
          Loading product...
        </div>
      </div>
    );
  }

  const showComparePrice =
    product.compare_at_price_kes != null &&
    product.save_percent != null &&
    product.save_percent > 0;
  const images =
    product.images?.length > 0 ? product.images : [product.image_url].filter(Boolean);

  const specEntries = Object.entries(product.specs ?? {}).filter(([, v]) => v?.trim());
  const mid = Math.ceil(specEntries.length / 2);
  const techSpecs = specEntries.slice(0, mid).map(([label, value]) => ({
    label: label.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
    value,
  }));
  const buildSpecs = specEntries.slice(mid).map(([label, value]) => ({
    label: label.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
    value,
  }));
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <GuestCartPrompt />

      <div className="border-b border-[#e5eeff] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5">
          <Link
            href={marketplaceBackHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#434653] hover:text-[#004aad] mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to marketplace
          </Link>
          <nav className="flex items-center gap-1.5 text-xs text-[#737784]">
            <Link href={marketplaceBackHref} className="hover:underline">
              Marketplace
            </Link>
            {product.category ? (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#434653]">{product.category}</span>
              </>
            ) : null}
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#434653] truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <section className="bg-white py-8 lg:py-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <div>
              <div className="bg-[#f8f9ff] border border-[#e5eeff] rounded-lg h-[380px] lg:h-[420px] flex items-center justify-center mb-3 overflow-hidden">
                <img
                  src={images[activeImage] || product.image_url}
                  alt={product.name}
                  className="max-h-[90%] max-w-[90%] object-contain"
                />
              </div>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`w-[72px] h-[72px] rounded border-2 overflow-hidden bg-[#f8f9ff] flex-shrink-0 ${
                      activeImage === i ? 'border-[#004aad]' : 'border-[#c3c6d5]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-[#737784]">
                <span className="border border-[#c3c6d5] rounded px-2 py-0.5 font-medium text-[#434653]">
                  {product.origin} - Origin
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl lg:text-[1.75rem] font-bold leading-tight mb-5" style={{ color: BLUE }}>
                {product.name}
              </h1>

              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold" style={{ color: BLUE }}>
                  {formatKshLabel(product.price_kes)}
                </span>
                {showComparePrice ? (
                  <>
                    <span className="text-lg text-[#737784] line-through font-normal">
                      {formatKshLabel(product.compare_at_price_kes!)}
                    </span>
                    <span
                      className="text-xs font-bold text-white px-2 py-0.5 rounded"
                      style={{ backgroundColor: ORANGE_SAVE }}
                    >
                      SAVE {product.save_percent}%
                    </span>
                  </>
                ) : null}
              </div>
              {/* Shipping — light blue box */}
              <p className="text-sm font-medium text-black mb-2">Quantity</p>
              <div className="flex items-center mb-6 w-fit border border-[#c3c6d5] rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#f8f9ff] border-r border-[#c3c6d5]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-bold border-r border-[#c3c6d5]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#f8f9ff]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  disabled={buyNowLoading}
                  onClick={async () => {
                    const payload = cartPayload();
                    if (!payload) return;
                    setBuyNowLoading(true);
                    try {
                      await buyNow(payload);
                    } finally {
                      setBuyNowLoading(false);
                    }
                  }}
                  className="block w-full text-center py-3.5 rounded text-sm font-bold text-white uppercase tracking-wide hover:opacity-90 disabled:opacity-70"
                  style={{ backgroundColor: BLUE }}
                >
                  {buyNowLoading ? 'Processing…' : 'BUY NOW'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const payload = cartPayload();
                    if (payload) void addToCart(payload);
                  }}
                  className="w-full py-3.5 rounded text-sm font-bold uppercase tracking-wide border-2 bg-white hover:bg-[#f8f9ff]"
                  style={{ borderColor: BLUE, color: BLUE }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e5eeff] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <h2 className="text-base font-bold text-black mb-4">Specifications</h2>
          {specEntries.length === 0 ? (
            <p className="text-sm text-[#737784]">No specifications listed for this product.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                {techSpecs.map((s) => (
                  <SpecRow key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
              {buildSpecs.length > 0 ? (
                <div>
                  <h3 className="text-base font-bold text-black mb-4">Additional details</h3>
                  {buildSpecs.map((s) => (
                    <SpecRow key={s.label} label={s.label} value={s.value} />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="bg-white py-10 border-t border-[#e5eeff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: BLUE }}>
              Other products
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  href={marketplaceProductHref(item.id, {
                    hub: searchParams.get('hub') ?? undefined,
                    category: searchParams.get('category') ?? undefined,
                    search: searchParams.get('search') ?? undefined,
                  })}
                  product={{
                    productId: item.id,
                    name: item.name,
                    image_url: item.image_url,
                    origin: item.origin,
                    price_kes: item.price_kes,
                    stock: item.stock,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA banner — light blue */}
      <section className="py-10" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold mb-3" style={{ color: BLUE }}>
            Don&apos;t see what you need?
          </h2>
          <p className="text-sm text-[#434653] leading-relaxed mb-6 max-w-xl">
            We source industrial components from verified manufacturers in China and the UAE at
            wholesale prices. Request a custom quote for your project.
          </p>
          <Link
            href="/dashboard/sourcing/new"
            className="inline-block px-5 py-2.5 rounded text-xs font-bold text-white uppercase tracking-wide bg-black hover:opacity-90"
          >
            REQUEST CUSTOM QUOTE
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col">
          <SiteHeader />
          <div className="flex-1 flex items-center justify-center text-[#737784]">
            Loading product...
          </div>
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
