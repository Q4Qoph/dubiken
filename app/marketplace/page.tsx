'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useExploreCategories, useMarketplaceProducts } from '@/lib/api/hooks';
import { useCart } from '@/hooks/use-cart';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const hubs = [
  { code: 'KE', label: 'Kenya (KE)' },
  { code: 'AE', label: 'Dubai (AE)' },
  { code: 'CN', label: 'China (CN)' },
] as const;

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? '';
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const { data: categoryData } = useExploreCategories(1, 50);
  const categoryNames = categoryData?.categories.map((c) => c.name) ?? [];
  const activeCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : undefined;
  const hubFilter = selectedHub === 'all' ? undefined : selectedHub;
  const { data: products = [], isLoading } = useMarketplaceProducts(hubFilter, activeCategory);
  const { addItem } = useCart();

  const hubLabel = useMemo(
    () => hubs.find((h) => h.code === selectedHub)?.label ?? 'All hubs',
    [selectedHub],
  );

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader searchPlaceholder="Search global marketplace..." />

      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        <aside className="hidden lg:block w-56 shrink-0 p-5 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#737784] mb-2">Category</p>
            {categoryNames.length === 0 ? (
              <p className="text-xs text-[#737784]">Loading…</p>
            ) : (
              categoryNames.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm text-[#434653] mb-1.5">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={() => toggleCategory(c)}
                    className="rounded"
                  />
                  {c}
                </label>
              ))
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-[#737784] mb-2">Origin Hub</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedHub('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border-2 ${
                  selectedHub === 'all'
                    ? 'border-[#004aad] bg-white text-[#004aad]'
                    : 'border-transparent bg-white/60 text-[#434653]'
                }`}
              >
                All hubs
              </button>
              {hubs.map((h) => (
                <button
                  key={h.code}
                  type="button"
                  onClick={() => setSelectedHub(h.code)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border-2 ${
                    selectedHub === h.code
                      ? 'border-[#004aad] bg-white text-[#004aad]'
                      : 'border-transparent bg-white/60 text-[#434653]'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
                Marketplace
              </h1>
              <p className="text-sm text-[#737784] mt-1">
                {isLoading
                  ? 'Loading products…'
                  : `${products.length} item${products.length === 1 ? '' : 's'} from ${hubLabel}`}
                {activeCategory ? ` · ${activeCategory}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#737784] font-medium">Sort by:</span>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 border border-[#c3c6d5] rounded-lg bg-white font-bold text-[#434653]"
              >
                Most Popular <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="lg:hidden flex items-center gap-2 mb-4 text-xs font-bold text-[#434653]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading ? (
              <p className="col-span-full text-sm text-[#737784] py-8">Loading products…</p>
            ) : null}
            {!isLoading && products.length === 0 ? (
              <p className="col-span-full text-sm text-[#737784] py-8">
                No products match these filters.
              </p>
            ) : null}
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden"
              >
                <Link href={`/product/${p.productId}`} className="block relative h-40 bg-[#f8f9ff]">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-full h-full bg-[#dce9ff]" />
                  )}
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#c3c6d5] rounded">
                    {p.origin}
                  </span>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-[#737784]">{p.vendor}</p>
                  <Link
                    href={`/product/${p.productId}`}
                    className="text-sm font-bold text-black hover:underline line-clamp-2"
                  >
                    {p.name}
                  </Link>
                  <p className="text-lg font-bold mt-2" style={{ color: BLUE }}>
                    {p.price_kes}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (p.cta === 'cart') {
                        addItem({
                          id: p.productId,
                          productId: p.productId,
                          name: p.name,
                          sku: `MP-${p.productId}`,
                          unitPrice: p.price_usd,
                          origin: p.origin,
                          imageUrl: p.image_url,
                        });
                      }
                    }}
                    className={`w-full mt-3 py-2.5 rounded-lg text-xs font-bold ${
                      p.cta === 'cart' ? 'text-white' : 'border-2 bg-white'
                    }`}
                    style={
                      p.cta === 'cart'
                        ? { backgroundColor: BLUE_DARK }
                        : { borderColor: BLUE, color: BLUE }
                    }
                  >
                    {p.cta === 'cart' ? 'Add to Cart' : 'Request Quote'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#737784]">
          Loading marketplace…
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
