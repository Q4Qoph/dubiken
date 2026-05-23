'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useUserMarketplaceOrders, useUserSourcingDashboard } from '@/lib/api/hooks';
import { MarketplaceOrderCard } from '@/components/orders/marketplace-order-card';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const PAGE_SIZE = 10;

export default function UserOrdersPage() {
  const [tab, setTab] = useState<'marketplace' | 'sourcing'>('marketplace');
  const [page, setPage] = useState(1);
  const { data: orders = [], isLoading } = useUserMarketplaceOrders();
  const { data: sourcingData } = useUserSourcingDashboard();
  const sourcing = sourcingData?.requests ?? [];

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageOrders = orders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('marketplace')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border-2 ${
            tab === 'marketplace' ? 'text-white border-transparent' : 'bg-white border-[#c3c6d5]'
          }`}
          style={tab === 'marketplace' ? { backgroundColor: BLUE } : { color: BLUE, borderColor: BLUE }}
        >
          Purchases
        </button>
        <button
          type="button"
          onClick={() => setTab('sourcing')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border-2 ${
            tab === 'sourcing' ? 'text-white border-transparent' : 'bg-white border-[#c3c6d5]'
          }`}
          style={tab === 'sourcing' ? { backgroundColor: BLUE } : { color: BLUE, borderColor: BLUE }}
        >
          Requests
        </button>
      </div>

      {tab === 'marketplace' ? (
        <>
          {isLoading ? (
            <p className="text-sm text-[#737784] py-12 text-center">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white border border-[#e5eeff] rounded-lg">
              <Package className="w-10 h-10 mx-auto mb-3 text-[#c3c6d5]" />
              <p className="text-sm text-[#737784] mb-4">No purchases yet.</p>
              <Link
                href="/marketplace"
                className="inline-flex px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: BLUE_DARK }}
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {pageOrders.map((order) => (
                  <MarketplaceOrderCard key={order.id} order={order} />
                ))}
              </div>
              {totalPages > 1 ? (
                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center border border-[#c3c6d5] rounded bg-white"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-bold rounded border ${
                        safePage === p ? 'text-white border-transparent' : 'border-[#c3c6d5] bg-white'
                      }`}
                      style={safePage === p ? { backgroundColor: BLUE } : undefined}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center border border-[#c3c6d5] rounded bg-white"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </>
          )}
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
            + Request a product
          </Link>
        </div>
      )}
    </div>
  );
}
