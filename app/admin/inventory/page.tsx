'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  AlertTriangle,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getAdminInventoryItems, getAdminInventoryKpis } from '@/lib/data';
import type { AdminInventoryItem, AdminInventoryKpis } from '@/lib/mock-data';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const TOTAL_PRODUCTS = 1248;
const PAGE_SIZE = 10;

export default function AdminInventoryPage() {
  const [items, setItems] = useState<AdminInventoryItem[]>([]);
  const [kpis, setKpis] = useState<AdminInventoryKpis | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([getAdminInventoryItems(), getAdminInventoryKpis()]).then(([list, k]) => {
      setItems(list);
      setKpis(k);
    });
  }, []);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, search, categoryFilter]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(TOTAL_PRODUCTS / PAGE_SIZE));
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, TOTAL_PRODUCTS);

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              Marketplace Inventory
            </h1>
            <p className="text-sm text-[#737784] mt-1 max-w-xl">
              Manage active SKUs, stock levels, and pricing across Kenya, Dubai, and China hubs.
            </p>
          </div>
          <Link
            href="/admin/inventory/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white shrink-0 hover:opacity-90"
            style={{ backgroundColor: BLUE }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {kpis && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Total Active Products
              </p>
              <p className="text-3xl font-bold" style={{ color: BLUE }}>
                {kpis.total_active_products.toLocaleString()}
              </p>
              <p className="text-xs font-semibold text-green-600 mt-1">
                +{kpis.new_this_week} New this week
              </p>
            </div>
            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Total Inventory Value
              </p>
              <p className="text-3xl font-bold" style={{ color: BLUE }}>
                {kpis.total_inventory_value}
              </p>
              <p className="text-xs text-[#737784] mt-1">{kpis.hubs_label}</p>
            </div>
            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Low Stock Alerts
              </p>
              <p className="text-3xl font-bold text-red-600">{kpis.low_stock_count} SKUs</p>
              <p className="text-xs font-semibold text-red-600 mt-1">Requires Attention</p>
            </div>
          </div>
        )}

        <p className="text-xs mb-4">
          Classifications:{' '}
          <Link href="/admin/categories" className="font-bold hover:underline" style={{ color: BLUE }}>
            Category Management →
          </Link>
        </p>

        <div className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#e5eeff] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784]" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, SKU, or category..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#c3c6d5] rounded-lg bg-[#f8f9ff] focus:outline-none focus:border-[#004aad]"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-bold border border-[#c3c6d5] rounded-lg bg-white text-[#434653] focus:outline-none focus:border-[#004aad]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'Category' : c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784] pointer-events-none" />
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 text-xs font-bold border border-[#c3c6d5] rounded-lg bg-white text-[#434653] focus:outline-none focus:border-[#004aad]">
                  <option>Sort</option>
                  <option>Name A–Z</option>
                  <option>Stock Low–High</option>
                  <option>Price High–Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr className="border-b border-[#e5eeff] bg-[#f8f9ff]">
                  {[
                    'Product Info',
                    'Category',
                    'Stock',
                    'Marketplace Price',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#737784]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.length > 0 ? (
                  pageItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#e5eeff] last:border-0 hover:bg-[#f8f9ff]/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded border border-[#e5eeff] overflow-hidden bg-[#f8f9ff] shrink-0">
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-black leading-snug">{item.name}</p>
                            <p className="text-xs text-[#737784] mt-0.5">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full border border-[#c3c6d5] bg-[#f8f9ff] text-[#434653]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-black">
                            {item.stock.toLocaleString()} units
                          </span>
                          {item.low_stock && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="text-sm font-bold" style={{ color: BLUE_DARK }}>
                          {item.marketplace_price}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/inventory/new?sku=${encodeURIComponent(item.sku)}`}
                            className="p-2 border border-[#c3c6d5] rounded hover:bg-[#f8f9ff]"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Pencil className="w-4 h-4 text-[#434653]" />
                          </Link>
                          <button
                            type="button"
                            className="p-2 border border-[#c3c6d5] rounded hover:bg-red-50 text-red-600"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#737784]">
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#e5eeff] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#737784]">
              Showing {showingFrom}-{showingTo} of {TOTAL_PRODUCTS.toLocaleString()} products
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center border border-[#c3c6d5] rounded bg-white hover:bg-[#f8f9ff] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center border rounded text-xs font-bold ${
                    page === p
                      ? 'text-white border-transparent'
                      : 'border-[#c3c6d5] text-[#434653] bg-white hover:bg-[#f8f9ff]'
                  }`}
                  style={page === p ? { backgroundColor: BLUE } : undefined}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 flex items-center justify-center border border-[#c3c6d5] rounded bg-white hover:bg-[#f8f9ff] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
      <AdminPageFooter />
    </div>
  );
}
