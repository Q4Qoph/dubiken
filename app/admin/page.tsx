'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Package,
  Clock,
  Calendar,
  Send,
  Save,
} from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';
import { useAdminAnalytics, useShipments } from '@/lib/api/hooks';
import { formatKshLabelFromKes, formatCompactKes } from '@/lib/currency';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';

const tagStyles: Record<'orange' | 'blue' | 'red', string> = {
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue: 'bg-[#eff4ff] text-[#004aad] border-[#dce9ff]',
  red: 'bg-red-50 text-red-700 border-red-200',
};

const statusPill: Record<string, string> = {
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  blue: 'bg-[#eff4ff] text-[#004aad] border-[#dce9ff]',
  red: 'bg-red-50 text-red-700 border-red-200',
};

function RouteBadge({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-xs font-bold px-2 py-1 rounded border border-[#c3c6d5] bg-white">
        {from}
      </span>
      <ArrowRight className="w-3.5 h-3.5 text-[#737784]" />
      <span className="text-xs font-bold px-2 py-1 rounded border border-[#c3c6d5] bg-white">
        {to}
      </span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [note, setNote] = useState('');
  const mounted = useMounted();
  const { dashboard, inventoryKpis, charts, isLoading } = useAdminAnalytics();
  const kpis = dashboard?.kpis;
  const kpiPending = !mounted || (isLoading && !kpis);
  const sourcingRows = dashboard?.sourcingRows ?? [];
  const weeklyData = charts?.weekly_volume ?? [];
  const topCategories = charts?.top_categories ?? [];
  const maxVal = Math.max(
    1,
    ...weeklyData.flatMap((w) => [w.kenya, w.dubai, w.china]),
  );
  const { data: shipments = [] } = useShipments();

  const highValueShipments = useMemo(
    () =>
      shipments.slice(0, 4).map((s) => ({
        id: s.tracking_id,
        market: 'CN',
        flag: '🇨🇳',
        status: s.current_status,
        statusVariant: (s.current_status.toLowerCase().includes('delay')
          ? 'red'
          : 'orange') as 'orange' | 'blue' | 'red',
        value: '—',
      })),
    [shipments],
  );

  const revenueChange = kpis?.global_sales_change ?? '';
  const revenueChangeColor = revenueChange.startsWith('+')
    ? 'text-green-600'
    : revenueChange.startsWith('-')
      ? 'text-red-600'
      : 'text-[#737784]';

  const kpiCards = [
    {
      label: 'Marketplace revenue',
      value: kpis
        ? formatKshLabelFromKes(kpis.global_sales_usd)
        : kpiPending
          ? '…'
          : 'KSh 0',
      change: mounted && kpis ? `${revenueChange} · last 28 days` : '',
      changeColor: revenueChangeColor,
      icon: DollarSign,
      iconBefore: TrendingUp,
    },
    {
      label: 'Active Requests',
      value: kpis ? String(kpis.active_requests) : kpiPending ? '…' : '0',
      change: kpis ? `${kpis.pending_quotes} pending quotes` : '',
      changeColor: 'text-[#737784]',
      icon: Package,
    },
    {
      label: 'On-Time Delivery',
      value: kpis ? `${kpis.otd_percent}%` : kpiPending ? '…' : '0%',
      change: kpis ? `${kpis.delayed_shipments} need attention` : '',
      changeColor: 'text-orange-600',
      icon: Clock,
      iconBefore: AlertTriangle,
    },
    {
      label: 'Inventory Value',
      value:
        inventoryKpis?.total_inventory_value ?? (kpiPending ? '…' : '0'),
      change: mounted ? (inventoryKpis?.hubs_label ?? '') : '',
      changeColor: 'text-[#737784]',
      icon: TrendingUp,
    },
  ] as const;

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              Dashboard
            </h1>
            <p className="text-sm text-[#737784] mt-1">
              Operations, sourcing, and marketplace performance.
            </p>
          </div>
        </div>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white border border-[#e5eeff] rounded-lg p-5">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                      {kpi.label}
                    </p>
                    <Icon className="w-5 h-5" style={{ color: BLUE }} />
                  </div>
                  <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
                    {kpi.value}
                  </p>
                  {kpi.change ? (
                    <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${kpi.changeColor}`}>
                      {'iconBefore' in kpi && kpi.iconBefore ? (
                        <kpi.iconBefore className="w-3.5 h-3.5 shrink-0" />
                      ) : null}
                      {kpi.change}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white border border-[#e5eeff] rounded-lg p-5">
              <h2 className="text-sm font-bold text-black mb-1">Order revenue by hub (KES)</h2>
              <p className="text-[10px] text-[#737784] mb-3">Weekly totals from marketplace orders</p>
              <div className="flex items-center gap-4 mb-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: BLUE }} />
                  Kenya
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ORANGE }} />
                  Dubai
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#434653]" />
                  China
                </span>
              </div>
              <div className="flex items-end gap-6 h-52 px-2">
                {weeklyData.length === 0 && mounted && !isLoading ? (
                  <p className="text-sm text-[#737784] py-8">No order volume in this period yet.</p>
                ) : null}
                {weeklyData.map((w) => (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {[
                        { val: w.kenya, color: BLUE },
                        { val: w.dubai, color: ORANGE },
                        { val: w.china, color: '#434653' },
                      ].map((b, i) => (
                        <div
                          key={i}
                          className="w-5 rounded-t-sm"
                          style={{
                            height: `${(b.val / maxVal) * 100}%`,
                            backgroundColor: b.color,
                            minHeight: 4,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-[#737784]">{w.week}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <h2 className="text-sm font-bold text-black mb-1">Top categories by sales</h2>
              <p className="text-[10px] text-[#737784] mb-4">All-time order revenue by product category</p>
              <div className="space-y-4">
                {topCategories.length === 0 && mounted && !isLoading ? (
                  <p className="text-xs text-[#737784]">No order revenue yet.</p>
                ) : null}
                {topCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-[#434653]">{cat.name}</span>
                      <span className="font-bold" style={{ color: BLUE }}>
                        {formatCompactKes(cat.value_usd)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cat.pct}%`, backgroundColor: BLUE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: BLUE_DARK }}>
              Recent Sourcing Requests
            </h2>
            <Link
              href="/admin/sourcing"
              className="text-xs font-bold hover:underline"
              style={{ color: BLUE }}
            >
              View all →
            </Link>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden">
            {sourcingRows.length === 0 ? (
              <p className="p-6 text-sm text-[#737784] text-center">No recent sourcing requests.</p>
            ) : (
              <div className="divide-y divide-[#e5eeff]">
                {sourcingRows.map((row) => (
                  <div
                    key={row.id}
                    className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-[#f8f9ff]/60"
                  >
                    <RouteBadge from={row.origin} to={row.destination} />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">
                        {row.product_title}{' '}
                        <span className="font-normal text-[#737784]">({row.quantity})</span>
                      </p>
                      <p className="text-xs text-[#737784] mt-0.5">Vendor: {row.vendor}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {row.status_tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tagStyles[tag.variant]}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#737784] shrink-0 lg:w-24">{row.time_ago}</p>

                    <Link
                      href={`/admin/sourcing/${row.id}`}
                      className="shrink-0 px-3 py-1.5 text-xs font-bold rounded border-2 bg-white hover:bg-[#f8f9ff] whitespace-nowrap"
                      style={{ borderColor: BLUE, color: BLUE }}
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <AdminPageFooter />
    </div>
  );
}
