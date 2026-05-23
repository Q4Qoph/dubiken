'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useAdminSourcingRequests } from '@/lib/api/hooks';
import type { SourcingRequest } from '@/lib/types';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';
const SECTION_BG = '#eff4ff';
const FOOTER_BG = '#dce9ff';

const marketDots: Record<string, string> = {
  KE: 'bg-red-500',
  AE: 'bg-green-500',
  CN: 'bg-yellow-500',
};

const statusConfig: Record<
  SourcingRequest['status'],
  { label: string; textColor: string; dot: string }
> = {
  pending: { label: 'Pending Quote', textColor: 'text-orange-600', dot: 'bg-orange-500' },
  quoted: { label: 'Quoted', textColor: 'text-[#004aad]', dot: 'bg-[#004aad]' },
  shipping: { label: 'Shipping', textColor: 'text-green-600', dot: 'bg-green-500' },
  delivered: { label: 'Delivered', textColor: 'text-[#737784]', dot: 'bg-[#737784]' },
};

const TOTAL_REQUESTS = 258;
const PAGE_SIZE = 10;

function ReferencesCell({ req }: { req: SourcingRequest }) {
  const images = req.reference_images.slice(0, 2);
  return (
    <div className="flex items-center gap-1.5">
      {images.map((src, i) => (
        <div
          key={i}
          className="w-10 h-10 rounded border border-[#c3c6d5] overflow-hidden bg-[#f8f9ff] shrink-0"
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      {req.reference_extra != null && req.reference_extra > 0 && (
        <span className="w-10 h-10 rounded border border-[#c3c6d5] bg-[#f8f9ff] flex items-center justify-center text-xs font-bold text-[#434653] shrink-0">
          +{req.reference_extra}
        </span>
      )}
      {req.has_document && (
        <span className="w-10 h-10 rounded border border-[#c3c6d5] bg-[#f8f9ff] flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#737784]" />
        </span>
      )}
    </div>
  );
}

function RequestActions({ req }: { req: SourcingRequest }) {
  return (
    <Link
      href={`/admin/sourcing/${req.id}`}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase border-2 rounded bg-white hover:bg-[#f8f9ff]"
      style={{ borderColor: BLUE, color: BLUE }}
    >
      <ExternalLink className="w-3 h-3" />
      View
    </Link>
  );
}

function DestinationCell({ req }: { req: SourcingRequest }) {
  return (
    <div className="inline-flex items-center gap-2 border border-[#c3c6d5] rounded-lg px-2.5 py-2 bg-white max-w-[200px]">
      <Globe className="w-4 h-4 text-[#737784] shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-bold text-black truncate">{req.destination}</p>
        <p className="text-[10px] text-[#737784] leading-tight">Kenya</p>
      </div>
    </div>
  );
}

export default function AdminSourcingPage() {
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data: requests = [], isLoading } = useAdminSourcingRequests({
    market: marketFilter,
    statuses: statusFilter.length > 0 ? statusFilter : undefined,
  });

  const totalPages = Math.max(1, Math.ceil(TOTAL_REQUESTS / PAGE_SIZE));
  const pageRequests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, page]);

  const showingFrom = requests.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, TOTAL_REQUESTS);

  function toggleStatusFilter(s: string) {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
    setPage(1);
  }

  const hasFilters = marketFilter !== 'all' || statusFilter.length > 0;

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <nav className="text-xs text-[#737784] mb-1">
          Sourcing / <span className="text-[#434653] font-medium">Product Requests</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              Custom Sourcing Requests
            </h1>
            <p className="text-sm text-[#737784] mt-1">
              Manage and fulfill specific procurement needs from global clients.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          className="rounded-lg border border-[#e5eeff] p-4 mb-5"
          style={{ backgroundColor: SECTION_BG }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Filter by Market
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMarketFilter('all');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    marketFilter === 'all'
                      ? 'text-white'
                      : 'bg-white border border-[#c3c6d5] text-[#434653]'
                  }`}
                  style={marketFilter === 'all' ? { backgroundColor: BLUE } : undefined}
                >
                  All Markets
                </button>
                {(['KE', 'AE', 'CN'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMarketFilter(marketFilter === m ? 'all' : m);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      marketFilter === m
                        ? 'text-white'
                        : 'bg-white border border-[#c3c6d5] text-[#434653]'
                    }`}
                    style={marketFilter === m ? { backgroundColor: BLUE } : undefined}
                  >
                    {m}
                    <span className={`w-2 h-2 rounded-full ${marketDots[m]}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:border-l lg:border-[#c3c6d5] lg:pl-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Workflow Status
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {(['pending', 'quoted', 'shipping'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStatusFilter(s)}
                    className={`px-3 py-1.5 rounded text-xs font-bold capitalize transition-colors ${
                      statusFilter.includes(s)
                        ? 'text-white'
                        : 'bg-white border border-[#c3c6d5] text-[#434653]'
                    }`}
                    style={
                      statusFilter.includes(s) ? { backgroundColor: BLUE_DARK } : undefined
                    }
                  >
                    {s === 'pending' ? 'Pending' : s === 'quoted' ? 'Quoted' : 'Shipping'}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setMarketFilter('all');
                  setStatusFilter([]);
                  setPage(1);
                }}
                className="text-xs font-bold hover:underline lg:ml-auto"
                style={{ color: BLUE }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#e5eeff] bg-[#f8f9ff]">
                  {[
                    'Client & ID',
                    'Product Details',
                    'References',
                    'Destination',
                    'Status',
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
                {pageRequests.length > 0 ? (
                  pageRequests.map((req) => {
                    const sc = statusConfig[req.status];
                    return (
                      <tr
                        key={req.id}
                        className="border-b border-[#e5eeff] last:border-0 hover:bg-[#f8f9ff]/80"
                      >
                        <td className="px-5 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                              style={{ backgroundColor: BLUE }}
                            >
                              {req.client_initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-black">{req.client_name}</p>
                              <p className="text-xs text-[#737784]">#{req.request_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-top max-w-[280px]">
                          <p className="text-sm font-bold" style={{ color: BLUE }}>
                            {req.product_title}
                          </p>
                          <p className="text-xs text-[#737784] mt-1 line-clamp-2 leading-relaxed">
                            {req.description}
                          </p>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <ReferencesCell req={req} />
                        </td>
                        <td className="px-5 py-4 align-top">
                          <DestinationCell req={req} />
                        </td>
                        <td className="px-5 py-4 align-top">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                            <span className={`text-xs font-bold ${sc.textColor}`}>
                              {sc.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <RequestActions req={req} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#737784]">
                      No requests match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#e5eeff] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#737784]">
              Showing {showingFrom}-{showingTo} of {TOTAL_REQUESTS} requests
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

      <footer style={{ backgroundColor: FOOTER_BG }} className="border-t border-[#c3c6d5]">
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-bold" style={{ color: BLUE }}>
            Dubiken
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-black">
            <Link href="#">Sourcing Guide</Link>
            <Link href="#">Shipping Policy</Link>
            <Link href="#">Tracking</Link>
            <Link href="#">Contact Support</Link>
            <Link href="#">Terms of Service</Link>
          </div>
          <p className="text-[#737784]">
            © {new Date().getFullYear()} Dubiken Global. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
