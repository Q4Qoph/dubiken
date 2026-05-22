'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, ShieldCheck } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getExploreCategories } from '@/lib/data';
import type { ExploreCategory } from '@/lib/mock-data';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

export default function ExploreCategoriesPage() {
  const [categories, setCategories] = useState<ExploreCategory[]>([]);

  useEffect(() => {
    getExploreCategories().then(setCategories);
  }, []);

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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg text-xs font-bold bg-white"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                <Globe className="w-4 h-4" />
                Global Network
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg text-xs font-bold bg-white"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                <ShieldCheck className="w-4 h-4" />
                Verified Vendors
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href="/marketplace"
                className="group relative rounded-lg overflow-hidden min-h-[200px] border border-[#e5eeff]"
              >
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/35" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-white border border-[#c3c6d5] rounded">
                  {cat.origin}
                </span>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h2 className="text-lg font-bold">{cat.name}</h2>
                  <p className="text-xs opacity-90">{cat.product_count.toLocaleString()} Products</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              className="w-full max-w-md py-3.5 rounded-lg text-sm font-bold text-white mb-3"
              style={{ backgroundColor: BLUE_DARK }}
            >
              Load More Categories
            </button>
            <p className="text-xs text-[#737784] font-medium">SHOWING 8 OF 42 CATEGORIES</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
