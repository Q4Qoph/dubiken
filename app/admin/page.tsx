'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, AlertTriangle, Ship, Plane, Truck } from 'lucide-react';
import { getAdminDashboard } from '@/lib/data';
import type {
  AdminDashboardKpis,
  DashboardSourcingRow,
  LogisticsPipelineCard,
  DashboardTagVariant,
} from '@/lib/mock-data';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';
const SECTION_BG = '#eff4ff';
const FOOTER_BG = '#dce9ff';

const tagStyles: Record<DashboardTagVariant, string> = {
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue: 'bg-[#eff4ff] text-[#004aad] border-[#dce9ff]',
  red: 'bg-red-50 text-red-700 border-red-200',
};

const pipelineStatusStyles: Record<
  LogisticsPipelineCard['status_variant'],
  string
> = {
  orange: 'bg-orange-100 text-orange-700',
  blue: 'bg-[#eff4ff] text-[#004aad]',
  gray: 'bg-[#f0f4f9] text-[#737784]',
};

const modeIcons = {
  Sea: Ship,
  Air: Plane,
  Land: Truck,
} as const;

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

function ActionButton({
  label,
  style,
}: {
  label: string;
  style: 'solid' | 'outline';
}) {
  if (style === 'solid') {
    return (
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-bold rounded text-white hover:opacity-90 whitespace-nowrap"
        style={{ backgroundColor: BLUE_DARK }}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      className="px-3 py-1.5 text-xs font-bold rounded border-2 bg-white hover:bg-[#f8f9ff] whitespace-nowrap"
      style={{ borderColor: BLUE, color: BLUE }}
    >
      {label}
    </button>
  );
}

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<AdminDashboardKpis | null>(null);
  const [sourcingRows, setSourcingRows] = useState<DashboardSourcingRow[]>([]);
  const [logistics, setLogistics] = useState<LogisticsPipelineCard[]>([]);

  useEffect(() => {
    getAdminDashboard().then((data) => {
      setKpis(data.kpis);
      setSourcingRows(data.sourcingRows);
      setLogistics(data.logistics);
    });
  }, []);

  if (!kpis) {
    return (
      <div className="p-8 text-sm text-[#737784] bg-[#f8f9ff] min-h-full">Loading dashboard...</div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8 space-y-8">
        {/* Operations overview */}
        <section>
          <h1 className="text-xl font-bold mb-4" style={{ color: BLUE_DARK }}>
            Operations Overview
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Global Sales (USD)
              </p>
              <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
                ${kpis.global_sales_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {kpis.global_sales_change}
              </p>
            </div>

            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Active Requests
              </p>
              <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
                {kpis.active_requests}
              </p>
              <p className="text-xs text-[#737784] mt-2">
                <span className="font-semibold text-[#434653]">{kpis.pending_quotes}</span> Pending
                Quotes
              </p>
            </div>

            <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784] mb-2">
                Logistics Status
              </p>
              <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
                {kpis.otd_percent}% OTD
              </p>
              <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {kpis.delayed_shipments} Delayed Shipments
              </p>
            </div>
          </div>
        </section>

        {/* Recent sourcing requests */}
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

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <ActionButton
                      label={row.primary_action.label}
                      style={row.primary_action.style}
                    />
                    {row.secondary_action && (
                      <ActionButton
                        label={row.secondary_action.label}
                        style={row.secondary_action.style}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logistics pipeline */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: BLUE_DARK }}>
              Logistics Pipeline
            </h2>
            <Link
              href="/admin/logistics"
              className="text-xs font-bold hover:underline"
              style={{ color: BLUE }}
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {logistics.map((card) => {
              const ModeIcon = modeIcons[card.mode];
              return (
                <div
                  key={card.tracking_id}
                  className="border border-[#dce9ff] rounded-lg p-4"
                  style={{ backgroundColor: SECTION_BG }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold font-mono" style={{ color: BLUE }}>
                        {card.tracking_id}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-[#737784] mt-0.5 flex items-center gap-1">
                        <ModeIcon className="w-3 h-3" />
                        {card.mode}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${pipelineStatusStyles[card.status_variant]}`}
                    >
                      {card.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#434653] font-medium">
                    {card.route_from} → {card.route_to}
                  </p>
                  <p className="text-xs text-[#737784] mt-2">
                    ETA: <span className="font-semibold text-black">{card.eta}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
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
          </div>
          <p className="text-[#737784]">
            © {new Date().getFullYear()} Dubiken Global. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
