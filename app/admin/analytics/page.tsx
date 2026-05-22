'use client';

import { useState } from 'react';
import {
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  Calendar,
  Send,
  Save,
} from 'lucide-react';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';

const weeklyData = [
  { week: 'Week 1', kenya: 180, dubai: 120, china: 200 },
  { week: 'Week 2', kenya: 220, dubai: 160, china: 250 },
  { week: 'Week 3', kenya: 290, dubai: 200, china: 330 },
  { week: 'Week 4', kenya: 260, dubai: 180, china: 310 },
];

const maxVal = 400;

const topCategories = [
  { name: 'Industrial Machinery', value: 840000, pct: 100 },
  { name: 'Consumer Electronics', value: 620000, pct: 74 },
  { name: 'Textiles & Fabrics', value: 410000, pct: 49 },
  { name: 'Construction Mat.', value: 285000, pct: 34 },
  { name: 'Agri-Business', value: 190000, pct: 23 },
];

const highValueShipments = [
  { id: 'DBK-8829', market: 'CN', flag: '🇨🇳', status: 'In Transit', statusVariant: 'orange' as const, value: '$124,500' },
  { id: 'DBK-7712', market: 'AE', flag: '🇦🇪', status: 'Cleared', statusVariant: 'blue' as const, value: '$89,200' },
  { id: 'DBK-6654', market: 'KE', flag: '🇰🇪', status: 'In Transit', statusVariant: 'orange' as const, value: '$67,800' },
  { id: 'DBK-5591', market: 'CN', flag: '🇨🇳', status: 'Delayed', statusVariant: 'red' as const, value: '$52,400' },
];

const statusPill: Record<string, string> = {
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  blue: 'bg-[#eff4ff] text-[#004aad] border-[#dce9ff]',
  red: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminAnalyticsPage() {
  const [note, setNote] = useState('');

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              Analytics Overview
            </h1>
            <p className="text-sm text-[#737784] mt-1">
              Monitoring cross-continental sourcing and logistics performance.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-[#c3c6d5] rounded-lg px-4 py-2.5 bg-white text-sm text-[#434653] shrink-0">
            <Calendar className="w-4 h-4" style={{ color: BLUE }} />
            <span className="font-bold">Oct 1 – Oct 31, 2024</span>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total Revenue',
              value: '$2.4M',
              change: '+12.4% vs last month',
              changeColor: 'text-green-600',
              icon: DollarSign,
            },
            {
              label: 'Shipment Volume',
              value: '18,420',
              change: '+8.1% vs last month',
              changeColor: 'text-green-600',
              icon: Package,
            },
            {
              label: 'Avg Transit Time',
              value: '14.2 Days',
              change: '-2.1 Days (Improved)',
              changeColor: 'text-[#004aad]',
              icon: Clock,
            },
            {
              label: 'Quote Conversion',
              value: '24.8%',
              change: 'Stable performance',
              changeColor: 'text-[#737784]',
              icon: TrendingUp,
            },
          ].map((kpi) => {
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
                <p className={`text-xs font-semibold mt-2 ${kpi.changeColor}`}>{kpi.change}</p>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white border border-[#e5eeff] rounded-lg p-5">
            <h2 className="text-sm font-bold text-black mb-1">Trade Volume by Market</h2>
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
            <h2 className="text-sm font-bold text-black mb-4">Top Categories</h2>
            <div className="space-y-4">
              {topCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-[#434653]">{cat.name}</span>
                    <span className="font-bold" style={{ color: BLUE }}>
                      ${(cat.value / 1000).toFixed(0)}k
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
            <button
              type="button"
              className="mt-4 text-xs font-bold hover:underline"
              style={{ color: BLUE }}
            >
              View full report →
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5eeff]">
              <h2 className="text-sm font-bold text-black">Recent High-Value Shipments</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9ff] border-b border-[#e5eeff]">
                  {['ID', 'Market', 'Status', 'Value'].map((h) => (
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
                {highValueShipments.map((row) => (
                  <tr key={row.id} className="border-b border-[#e5eeff] last:border-0">
                    <td className="px-5 py-3 text-sm font-bold font-mono" style={{ color: BLUE }}>
                      {row.id}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm">
                        {row.flag} {row.market}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusPill[row.statusVariant]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-black">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <h2 className="text-sm font-bold text-black mb-4">Operational Alert</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-[#434653] leading-relaxed">
              Port congestion in Mombasa is increasing lead times for Kenya-bound freight by an
              average of 4.5 days.
            </div>
            <p className="text-xs font-bold text-[#434653] mb-2">Quick Logistics Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add operational notes..."
              rows={4}
              className="w-full border border-[#c3c6d5] rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#004aad] bg-[#f8f9ff]"
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 text-white rounded-lg py-2.5 text-xs font-bold uppercase"
                style={{ backgroundColor: BLUE_DARK }}
              >
                <Send className="w-4 h-4" />
                Notify Team
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 border-2 rounded-lg py-2.5 text-xs font-bold uppercase bg-white"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminPageFooter />
    </div>
  );
}
