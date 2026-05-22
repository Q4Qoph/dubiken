'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Truck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useUserMarketplaceOrders, useUserSourcingDashboard } from '@/lib/api/hooks';
import type { UserMarketplaceOrder, UserSourcingRequestItem } from '@/lib/types';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const SECTION_BG = '#eff4ff';

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1 w-full max-w-[200px]">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i <= step ? '' : 'bg-[#e5eeff]'}`}
          style={i <= step ? { backgroundColor: BLUE } : undefined}
        />
      ))}
    </div>
  );
}

function StatusIcon({ type }: { type: UserMarketplaceOrder['status_icon'] }) {
  if (type === 'delivered') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (type === 'processing') return <Loader2 className="w-4 h-4 text-orange-500" />;
  return <Truck className="w-4 h-4" style={{ color: BLUE }} />;
}

function OrderCard({ order }: { order: UserMarketplaceOrder }) {
  return (
    <div className="bg-white border border-[#e5eeff] rounded-lg p-4 flex flex-col lg:flex-row gap-4">
      <div className="relative w-full lg:w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-[#f8f9ff] border border-[#e5eeff]">
        <img src={order.image_url} alt="" className="w-full h-full object-cover" />
        <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#c3c6d5] rounded">
          {order.origin_flag}
        </span>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <p className="text-xs font-mono text-[#737784]">#{order.order_number}</p>
          <p className="text-sm font-bold text-black">{order.title}</p>
          <p className="text-xs text-[#737784]">{order.vendor}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon type={order.status_icon} />
          <span className="text-xs font-bold text-[#434653]">{order.status}</span>
        </div>
        <ProgressBar step={order.progress_step} />
      </div>

      <div className="flex flex-col items-start lg:items-end justify-between gap-3 shrink-0">
        <div className="lg:text-right">
          <p className="text-lg font-bold" style={{ color: BLUE_DARK }}>
            {order.price_kes}
          </p>
          {order.price_secondary ? (
            <p className="text-xs text-[#737784]">{order.price_secondary}</p>
          ) : null}
          <p className="text-[10px] text-[#737784] mt-1">
            {order.date_label}: <span className="font-semibold text-black">{order.date_value}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white ${
              order.primary_style === 'red' ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
            style={
              order.primary_style === 'navy' ? { backgroundColor: BLUE_DARK } : undefined
            }
          >
            {order.primary_action}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 bg-white"
            style={{ borderColor: BLUE, color: BLUE }}
          >
            {order.secondary_action}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserOrdersPage() {
  const [tab, setTab] = useState<'marketplace' | 'sourcing'>('marketplace');
  const [page, setPage] = useState(1);
  const { data: orders = [] } = useUserMarketplaceOrders();
  const { data: sourcingData } = useUserSourcingDashboard();
  const sourcing = sourcingData?.requests ?? [];

  return (
    <div className="p-6 lg:p-8 bg-[#f8f9ff] min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            My Orders
          </h1>
          <p className="text-sm text-[#737784] mt-1">
            View and manage your purchase history and tracking.
          </p>
        </div>
        <div className="flex rounded-lg border border-[#c3c6d5] overflow-hidden bg-white shrink-0">
          <button
            type="button"
            onClick={() => setTab('marketplace')}
            className={`px-4 py-2 text-xs font-bold ${
              tab === 'marketplace' ? 'bg-white text-black' : 'text-[#737784]'
            }`}
            style={tab === 'marketplace' ? { boxShadow: 'inset 0 -2px 0 #004aad' } : { backgroundColor: SECTION_BG }}
          >
            Marketplace Orders
          </button>
          <button
            type="button"
            onClick={() => setTab('sourcing')}
            className={`px-4 py-2 text-xs font-bold ${
              tab === 'sourcing' ? 'bg-white text-black' : 'text-[#737784]'
            }`}
            style={tab === 'sourcing' ? { boxShadow: 'inset 0 -2px 0 #004aad' } : { backgroundColor: SECTION_BG }}
          >
            Sourcing Requests
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-xs font-bold text-[#737784]">FILTER BY:</span>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold border border-[#c3c6d5] rounded-lg bg-white"
        >
          All Statuses <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold border border-[#c3c6d5] rounded-lg bg-white"
        >
          Last 30 Days <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {tab === 'marketplace' ? (
        <>
          <div className="space-y-4 mb-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          <div className="flex justify-center gap-1">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-[#c3c6d5] rounded bg-white"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs font-bold rounded border ${
                  page === p ? 'text-white border-transparent' : 'border-[#c3c6d5] bg-white'
                }`}
                style={page === p ? { backgroundColor: BLUE } : undefined}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-[#c3c6d5] rounded bg-white"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {sourcing.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-[#e5eeff] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs text-[#737784]">#{req.request_number}</p>
                <p className="text-sm font-bold text-black">{req.title}</p>
                <p className="text-sm font-bold mt-1" style={{ color: BLUE }}>
                  {req.price}
                </p>
              </div>
              <Link
                href={`/dashboard/sourcing/${req.id}`}
                className="text-xs font-bold px-4 py-2 border-2 rounded-lg"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                View
              </Link>
            </div>
          ))}
          <Link
            href="/dashboard/sourcing/new"
            className="inline-flex items-center gap-2 text-sm font-bold mt-2"
            style={{ color: BLUE }}
          >
            + New Sourcing Request
          </Link>
        </div>
      )}
    </div>
  );
}
