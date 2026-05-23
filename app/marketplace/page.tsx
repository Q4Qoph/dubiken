'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import { useExploreCategories, useMarketplaceProducts } from '@/lib/api/hooks';
import { HUB_OPTIONS } from '@/lib/contracts/enums';
import { usePromptedCart } from '@/hooks/use-prompted-cart';
import { parseKsh } from '@/lib/currency';
import { marketplaceProductHref } from '@/lib/marketplace-navigation';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const MARKETPLACE_HUBS = [
  { code: 'all', label: 'All origins', flag: '🌐' },
  ...HUB_OPTIONS.map((h) => ({
    code: h.code,
    label: h.code === 'AE' ? 'Dubai' : h.label,
    flag: h.flag,
  })),
];

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? '';
  const searchQuery = (searchParams.get('search') ?? '').trim();
  const [selectedHub, setSelectedHub] = useState(searchParams.get('hub') ?? 'all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const { data: categoryData } = useExploreCategories(1, 50);
  const allCategories = categoryData?.categories ?? [];
  const activeCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : undefined;
  const hubFilter = selectedHub === 'all' ? undefined : selectedHub;
  const { data: products = [], isLoading } = useMarketplaceProducts(
    hubFilter,
    activeCategory,
    searchQuery || undefined,
  );
  const { addToCart, GuestCartPrompt } = usePromptedCart();

  const marketplaceFilters = {
    hub: selectedHub,
    category: activeCategory,
    search: searchQuery || undefined,
  };

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  useEffect(() => {
    setSelectedHub(searchParams.get('hub') ?? 'all');
  }, [searchParams]);

  function updateFilters(patch: { hub?: string; category?: string | null; search?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());
    if (patch.hub !== undefined) {
      if (patch.hub === 'all') params.delete('hub');
      else params.set('hub', patch.hub);
    }
    if (patch.search !== undefined) {
      if (patch.search) params.set('search', patch.search);
      else params.delete('search');
    }
    if (patch.category !== undefined) {
      if (patch.category) params.set('category', patch.category);
      else params.delete('category');
    }
    const qs = params.toString();
    router.replace(qs ? `/marketplace?${qs}` : '/marketplace');
  }

  function selectHub(code: string) {
    setSelectedHub(code);
    updateFilters({ hub: code });
  }

  const matchingCategories = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allCategories.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCategories, searchQuery]);

  const sidebarCategories = useMemo(() => {
    if (!searchQuery) return allCategories.map((c) => c.name);
    const q = searchQuery.toLowerCase();
    return allCategories
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => c.name);
  }, [allCategories, searchQuery]);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const resultsLabel = useMemo(() => {
    if (isLoading) return 'Searching…';
    const parts: string[] = [];
    if (searchQuery) parts.push(`“${searchQuery}”`);
    parts.push(`${products.length} product${products.length === 1 ? '' : 's'}`);
    if (activeCategory) parts.push(`in ${activeCategory}`);
    if (hubFilter) {
      const hubLabel = MARKETPLACE_HUBS.find((h) => h.code === hubFilter)?.label ?? hubFilter;
      parts.push(`from ${hubLabel}`);
    }
    return parts.join(' · ');
  }, [isLoading, searchQuery, products.length, activeCategory, hubFilter]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <GuestCartPrompt />

      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        <aside className="hidden lg:block w-56 shrink-0 p-5 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#737784] mb-2">Category</p>
            {sidebarCategories.length === 0 ? (
              <p className="text-xs text-[#737784]">
                {searchQuery ? 'No matching categories.' : 'Loading…'}
              </p>
            ) : (
              sidebarCategories.map((c) => (
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
            <p className="text-[10px] font-bold uppercase text-[#737784] mb-2">Origin</p>
            <div className="space-y-2">
              {MARKETPLACE_HUBS.map((h) => (
                <button
                  key={h.code}
                  type="button"
                  onClick={() => selectHub(h.code)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-xs font-bold border-2 ${
                    selectedHub === h.code
                      ? 'border-[#004aad] bg-white text-[#004aad]'
                      : 'border-transparent bg-white/60 text-[#434653] hover:bg-white'
                  }`}
                >
                  <span className="text-base leading-none shrink-0" aria-hidden>
                    {h.flag}
                  </span>
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
                {searchQuery ? 'Search results' : 'Marketplace'}
              </h1>
              <p className="text-sm text-[#737784] mt-1">{resultsLabel}</p>
            </div>
       
          </div>

          {searchQuery && matchingCategories.length > 0 ? (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#737784] mb-3">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {matchingCategories.map((cat) => {
                  const chipParams = new URLSearchParams();
                  chipParams.set('category', cat.name);
                  chipParams.set('search', searchQuery);
                  if (hubFilter) chipParams.set('hub', hubFilter);
                  return (
                  <Link
                    key={cat.id}
                    href={`/marketplace?${chipParams.toString()}`}
                    className="px-3 py-2 rounded-lg border border-[#e5eeff] bg-[#f8f9ff] text-sm font-bold text-[#004aad] hover:border-[#004aad]"
                  >
                    {cat.name}
                    <span className="font-normal text-[#737784] ml-1">
                      ({cat.product_count})
                    </span>
                  </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          <div className="lg:hidden mb-4 space-y-3">
            <p className="text-[10px] font-bold uppercase text-[#737784]">Shop by origin</p>
            <div className="flex flex-wrap gap-2">
              {MARKETPLACE_HUBS.map((h) => (
                <button
                  key={h.code}
                  type="button"
                  onClick={() => selectHub(h.code)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border-2 ${
                    selectedHub === h.code
                      ? 'border-[#004aad] bg-[#eff4ff] text-[#004aad]'
                      : 'border-[#e5eeff] bg-white text-[#434653]'
                  }`}
                >
                  <span aria-hidden>{h.flag}</span>
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {searchQuery ? (
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#737784] mb-3">
              Products
            </h2>
          ) : null}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {isLoading ? (
              <p className="col-span-full text-sm text-[#737784] py-8">Loading products…</p>
            ) : null}
            {!isLoading && products.length === 0 ? (
              <p className="col-span-full text-sm text-[#737784] py-8">
                {searchQuery
                  ? 'No products found. Try another term or browse categories.'
                  : 'No products match these filters.'}
              </p>
            ) : null}
            {products.map((p) => (
              <ProductCard
                key={p.id}
                href={marketplaceProductHref(p.productId, marketplaceFilters)}
                product={{
                  productId: p.productId,
                  name: p.name,
                  image_url: p.image_url,
                  origin: p.origin,
                  price_kes: p.price_kes,
                  stock: p.stock,
                }}
                footer={
                  <button
                    type="button"
                    onClick={() => {
                      if (p.cta === 'cart') {
                        void addToCart({
                          id: p.productId,
                          productId: p.productId,
                          name: p.name,
                          sku: `MP-${p.productId}`,
                          unitPrice: p.price_usd,
                          unitPriceKes: parseKsh(p.price_kes),
                          origin: p.origin,
                          imageUrl: p.image_url,
                        });
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold ${
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
                }
              />
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
          Loading…
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
