'use client';

import Link from 'next/link';
import { Plus, Filter, Pencil, Copy, Eye, EyeOff } from 'lucide-react';
import { useAdminCategories } from '@/lib/api/hooks';
import type { AdminCategoryCard } from '@/lib/types';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const trendClass: Record<AdminCategoryCard['trend_variant'], string> = {
  up: 'text-green-600 bg-green-50',
  stable: 'text-[#737784] bg-[#f0f4f9]',
  down: 'text-red-600 bg-red-50',
};

export default function CategoryManagementPage() {
  const { data: cards = [], isLoading } = useAdminCategories();

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <nav className="text-xs text-[#737784] mb-1">
          Categories / <span className="text-[#434653] font-medium">Category Management</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              Category Management
            </h1>
            <p className="text-sm text-[#737784] mt-1">
              Optimize and oversee global product classifications.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white"
              style={{ backgroundColor: BLUE }}
            >
              <Plus className="w-4 h-4" />
              Create Category
            </Link>
          </div>
        </div>

        <p className="text-xs mb-4">
          <Link href="/admin/inventory" className="font-bold hover:underline" style={{ color: BLUE }}>
            ← Marketplace inventory (SKUs)
          </Link>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden"
            >
              <div className="relative h-44">
                <img src={cat.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex gap-1">
                  {cat.origins.map((o) => (
                    <span
                      key={o}
                      className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#c3c6d5] rounded"
                    >
                      {o}
                    </span>
                  ))}
                </div>
                {cat.status === 'draft' && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                    Draft
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-black mb-1">{cat.name}</h2>
                <p className="text-xs text-[#737784] line-clamp-2 mb-3">{cat.description}</p>
             
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="grid grid-cols-2 gap-4 text-sm flex-1">
                    <div>
                      <p className="text-[10px] text-[#737784] uppercase">Total SKUs</p>
                      <p className="font-bold" style={{ color: BLUE_DARK }}>
                        {cat.total_skus.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${trendClass[cat.trend_variant]}`}
                  >
                    {cat.trend}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-t border-[#e5eeff] pt-3">
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    className="p-2 border border-[#c3c6d5] rounded hover:bg-[#f8f9ff]"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Pencil className="w-4 h-4 text-[#434653]" />
                  </Link>
                  <button type="button" className="p-2 border border-[#c3c6d5] rounded hover:bg-[#f8f9ff]">
                    <Copy className="w-4 h-4 text-[#434653]" />
                  </button>
                  <button type="button" className="p-2 border border-[#c3c6d5] rounded hover:bg-[#f8f9ff] ml-auto">
                    <EyeOff className="w-4 h-4 text-[#737784]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AdminPageFooter />
    </div>
  );
}
