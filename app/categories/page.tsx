'use client';

import { useEffect, useState } from 'react';
import type { ExploreCategory } from '@/lib/types';
import Link from 'next/link';
import { Globe, ShieldCheck } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useExploreCategories } from '@/lib/api/hooks';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const PAGE_SIZE = 12;

export default function ExploreCategoriesPage() {
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState<ExploreCategory[]>([]);
  const { data, isLoading, isFetching } = useExploreCategories(page, PAGE_SIZE);

  useEffect(() => {
    if (!data?.categories) return;
    setAllCategories((prev) => {
      if (page === 1) return data.categories;
      const ids = new Set(prev.map((c) => c.id));
      return [...prev, ...data.categories.filter((c) => !ids.has(c.id))];
    });
  }, [data, page]);

  const categories = allCategories;
  const meta = data?.meta;
  const total = meta?.total ?? categories.length;
  const shown = categories.length;
  const hasMore = shown < total;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader searchPlaceholder="Search categories..." />

      <main className="flex-1 bg-[#f8f9ff]">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: BLUE_DARK }}>
                Explore Categories
              </h1>
              <p className="text-sm text-[#737784] mt-2">
                Access global trade hubs through our curated sourcing network.
              </p>
            </div>
          </div>

          {isLoading && categories.length === 0 ? (
            <p className="text-sm text-[#737784]">Loading categories…</p>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-lg overflow-hidden min-h-[200px] border border-[#e5eeff]"
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#dce9ff]" />
                )}
                <div className="absolute inset-0 bg-black/35" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-white border border-[#c3c6d5] rounded">
                  {cat.origin}
                </span>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h2 className="text-lg font-bold">{cat.name}</h2>
                  <p className="text-xs opacity-90">
                    {cat.product_count.toLocaleString()} Products
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {!isLoading && categories.length === 0 ? (
            <p className="text-sm text-[#737784] text-center mb-8">
              No published categories yet.
            </p>
          ) : null}

          <div className="text-center">
            {hasMore ? (
              <button
                type="button"
                disabled={isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="w-full max-w-md py-3.5 rounded-lg text-sm font-bold text-white mb-3 disabled:opacity-60"
                style={{ backgroundColor: BLUE_DARK }}
              >
                {isFetching ? 'Loading…' : 'Load More Categories'}
              </button>
            ) : null}
            <p className="text-xs text-[#737784] font-medium">
              SHOWING {shown} OF {total} CATEGORIES
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
