'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  FileText,
  Store,
  Plus,
  ArrowRight,
  Truck,
  CheckCircle2,
  Loader2,
  Search,
} from 'lucide-react';
import {
  useCurrentUser,
  useShipment,
  useUserMarketplaceOrders,
  useUserSourcingDashboard,
} from '@/lib/api/hooks';
import { useCart } from '@/hooks/use-cart';
import { parseKsh } from '@/lib/currency';
import type { UserMarketplaceOrder } from '@/lib/types';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';

function StatusIcon({ type }: { type: UserMarketplaceOrder['status_icon'] }) {
  if (type === 'delivered') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (type === 'processing') return <Loader2 className="w-4 h-4 text-orange-500" />;
  return <Truck className="w-4 h-4" style={{ color: BLUE }} />;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1 w-full max-w-[140px]">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full ${i <= step ? '' : 'bg-[#e5eeff]'}`}
          style={i <= step ? { backgroundColor: BLUE } : undefined}
        />
      ))}
    </div>
  );
}

function RecentOrderRow({ order }: { order: UserMarketplaceOrder }) {
  return (
    <Link
      href="/dashboard/orders"
      className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] hover:border-[#dce9ff] transition-colors"
    >
      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white border border-[#e5eeff]">
        <img src={order.image_url} alt="" className="w-full h-full object-cover" />
        <span className="absolute bottom-0 left-0 right-0 text-[8px] font-bold text-center bg-white/90 py-0.5">
          {order.origin_flag}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-[#737784]">#{order.order_number}</p>
        <p className="text-sm font-bold text-black truncate">{order.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <StatusIcon type={order.status_icon} />
          <span className="text-xs font-bold text-[#434653]">{order.status}</span>
        </div>
        <ProgressBar step={order.progress_step} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold" style={{ color: BLUE_DARK }}>
          {order.price_kes}
        </p>
        <p className="text-[10px] text-[#737784] mt-0.5">
          {order.date_label}: {order.date_value}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-[#c3c6d5] shrink-0 hidden sm:block" />
    </Link>
  );
}

export default function DashboardPage() {
  const { displayName } = useCurrentUser();
  const { data: orders = [], isLoading: ordersLoading } = useUserMarketplaceOrders();
  const { data: sourcingData, isLoading: sourcingLoading } = useUserSourcingDashboard();
  const { itemCount } = useCart();
  const [trackingInput, setTrackingInput] = useState('');
  const [activeTracking, setActiveTracking] = useState('');
  const { data: shipment } = useShipment(activeTracking);

  const summary = sourcingData?.summary;
  const sourcingRequests = (sourcingData?.requests ?? []).slice(0, 3);

  useEffect(() => {
    if (activeTracking) return;
    const fromOrder = orders.find((o) => o.tracking_id)?.tracking_id;
    if (fromOrder) {
      setActiveTracking(fromOrder);
      setTrackingInput(fromOrder);
    }
  }, [orders, activeTracking]);

  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => {
      const s = o.status.toUpperCase();
      return (
        s.includes('PROCESS') ||
        s.includes('TRANSIT') ||
        s.includes('SHIP') ||
        s.includes('DISPATCH')
      );
    }).length;
    const delivered = orders.filter((o) =>
      o.status.toUpperCase().includes('DELIVER'),
    ).length;
    const totalSpend = orders.reduce((sum, o) => sum + parseKsh(o.price_kes), 0);
    return { total: orders.length, activeOrders, delivered, totalSpend };
  }, [orders]);

  const recentOrders = orders.slice(0, 4);
  const milestones = shipment?.milestones ?? [];
  const firstName = displayName.split(' ')[0] || 'there';

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
          Dashboard
        </h1>
        <p className="text-sm text-[#737784] mt-1">
          Welcome back, {firstName}. Here&apos;s what&apos;s happening with your orders and quotes.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#e5eeff] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              Orders
            </p>
            <ShoppingBag className="w-4 h-4" style={{ color: BLUE }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            {ordersLoading ? '…' : stats.total}
          </p>
          <p className="text-xs text-[#737784] mt-1">
            {stats.activeOrders} in progress
          </p>
        </div>

        <div className="bg-white border border-[#e5eeff] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              Delivered
            </p>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            {ordersLoading ? '…' : stats.delivered}
          </p>
          <p className="text-xs text-[#737784] mt-1">Completed purchases</p>
        </div>

        <div className="bg-white border border-[#e5eeff] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              Sourcing
            </p>
            <FileText className="w-4 h-4" style={{ color: BLUE }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            {sourcingLoading ? '…' : (summary?.active ?? 0)}
          </p>
          <p className="text-xs text-[#737784] mt-1">
            {summary?.pending_quotes ?? 0} pending quotes
          </p>
        </div>

        <div className="bg-white border border-[#e5eeff] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
              Order value
            </p>
            <Package className="w-4 h-4" style={{ color: ORANGE }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            {ordersLoading ? '…' : stats.totalSpend.toLocaleString('en-KE')}
          </p>
          <p className="text-xs text-[#737784] mt-1">All marketplace orders</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link
          href="/marketplace"
          className="flex items-center gap-3 bg-white border border-[#e5eeff] rounded-lg p-4 hover:border-[#004aad] transition-colors"
        >
          <Store className="w-5 h-5 shrink-0" style={{ color: BLUE }} />
          <span className="text-sm font-bold text-black">Marketplace</span>
        </Link>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-3 bg-white border border-[#e5eeff] rounded-lg p-4 hover:border-[#004aad] transition-colors"
        >
          <ShoppingBag className="w-5 h-5 shrink-0" style={{ color: BLUE }} />
          <span className="text-sm font-bold text-black">My orders</span>
        </Link>
        <Link
          href="/dashboard/sourcing/new"
          className="flex items-center gap-3 bg-white border border-[#e5eeff] rounded-lg p-4 hover:border-[#004aad] transition-colors"
        >
          <Plus className="w-5 h-5 shrink-0" style={{ color: BLUE }} />
          <span className="text-sm font-bold text-black">New quote</span>
        </Link>
        <Link
          href={itemCount > 0 ? '/checkout' : '/marketplace'}
          className="flex items-center gap-3 bg-white border border-[#e5eeff] rounded-lg p-4 hover:border-[#004aad] transition-colors"
        >
          <Package className="w-5 h-5 shrink-0" style={{ color: ORANGE }} />
          <span className="text-sm font-bold text-black">
            {itemCount > 0 ? `Cart (${itemCount})` : 'Browse products'}
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5eeff] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: BLUE_DARK }}>
              Recent orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold hover:underline"
              style={{ color: BLUE }}
            >
              View all →
            </Link>
          </div>

          {ordersLoading ? (
            <p className="text-sm text-[#737784] py-8 text-center">Loading orders…</p>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Package className="w-10 h-10 mx-auto mb-3 text-[#c3c6d5]" />
              <p className="text-sm text-[#737784] mb-4">No orders yet.</p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: BLUE_DARK }}
              >
                <Store className="w-4 h-4" />
                Shop marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Track shipment */}
          <div className="bg-white rounded-lg border border-[#e5eeff] p-5">
            <h2 className="text-base font-bold text-black mb-3">Track shipment</h2>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784]" />
                <input
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && trackingInput.trim()) {
                      setActiveTracking(trackingInput.trim());
                    }
                  }}
                  placeholder="Tracking ID"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#c3c6d5] rounded-lg bg-[#f8f9ff] focus:outline-none focus:border-[#004aad]"
                />
              </div>
              <button
                type="button"
                onClick={() => trackingInput.trim() && setActiveTracking(trackingInput.trim())}
                className="px-3 py-2 rounded-lg text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: BLUE_DARK }}
              >
                Track
              </button>
            </div>

            {activeTracking ? (
              <p className="text-xs font-mono font-bold mb-3" style={{ color: BLUE }}>
                {shipment?.tracking_id || activeTracking}
              </p>
            ) : null}

            <div className="space-y-4">
              {milestones.length === 0 ? (
                <p className="text-sm text-[#737784]">
                  {activeTracking
                    ? 'No tracking updates for this ID yet.'
                    : 'Enter a tracking ID from your order confirmation.'}
                </p>
              ) : (
                milestones.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        m.active ? 'bg-[#f07c00]' : m.done ? 'bg-[#004aad]' : 'bg-[#e5eeff]'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          m.active ? 'text-[#f07c00]' : m.done ? 'text-black' : 'text-[#737784]'
                        }`}
                      >
                        {m.label}
                      </p>
                      <p className="text-xs text-[#737784]">
                        {m.detail} · {m.date}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sourcing */}
          <div className="bg-white rounded-lg border border-[#e5eeff] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black">Sourcing quotes</h2>
              <Link
                href="/dashboard/sourcing"
                className="text-xs font-bold hover:underline"
                style={{ color: BLUE }}
              >
                View all →
              </Link>
            </div>
            {sourcingLoading ? (
              <p className="text-sm text-[#737784]">Loading…</p>
            ) : sourcingRequests.length === 0 ? (
              <p className="text-sm text-[#737784]">
                No sourcing requests yet.{' '}
                <Link
                  href="/dashboard/sourcing/new"
                  className="font-bold underline"
                  style={{ color: BLUE_DARK }}
                >
                  Start one
                </Link>
              </p>
            ) : (
              <ul className="space-y-3">
                {sourcingRequests.map((req) => (
                  <li key={req.id}>
                    <Link
                      href={`/dashboard/sourcing/${req.id}`}
                      className="flex items-center justify-between gap-2 group"
                    >
                      <span className="text-sm text-[#434653] truncate group-hover:text-black">
                        {req.title}
                      </span>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                        {req.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
