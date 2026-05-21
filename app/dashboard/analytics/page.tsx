'use client';

import { useState } from 'react';
import { DollarSign, Package, Clock, TrendingUp, Calendar, Filter, Send, Save } from 'lucide-react';

const weeklyData = [
  { week: 'Week 1', kenya: 180, dubai: 120, china: 200 },
  { week: 'Week 2', kenya: 220, dubai: 160, china: 250 },
  { week: 'Week 3', kenya: 290, dubai: 200, china: 330 },
  { week: 'Week 4', kenya: 260, dubai: 180, china: 310 },
];

const maxVal = 400;

const categories = [
  { label: 'Industrial Machinery', value: '$840k', pct: 84 },
  { label: 'Consumer Electronics', value: '$612k', pct: 61 },
  { label: 'Textiles & Fabrics', value: '$420k', pct: 42 },
  { label: 'Construction Mat.', value: '$310k', pct: 31 },
  { label: 'Agri-Business', value: '$205k', pct: 21 },
];

const highValueShipments = [
  { id: '#DBK-9021', market: 'CN', flag: '🇨🇳', status: 'In Transit', statusColor: 'bg-blue-50 text-blue-700', value: '$124,000' },
  { id: '#DBK-8842', market: 'AE', flag: '🇦🇪', status: 'Cleared', statusColor: 'bg-emerald-50 text-emerald-700', value: '$89,200' },
  { id: '#DBK-8711', market: 'KE', flag: '🇰🇪', status: 'Delayed', statusColor: 'bg-red-50 text-red-700', value: '$56,500' },
  { id: '#DBK-8604', market: 'CN', flag: '🇨🇳', status: 'In Transit', statusColor: 'bg-blue-50 text-blue-700', value: '$11,200' },
];

export default function AnalyticsPage() {
  const [note, setNote] = useState('');

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2d5a]">Analytics Overview</h1>
          <p className="text-[#718096] mt-0.5">Monitoring cross-continental sourcing and logistics performance.</p>
        </div>
        <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-4 py-2 bg-white shadow-sm text-sm text-[#4a5568]">
          <Calendar className="w-4 h-4 text-[#1a3a7a]" />
          <span className="font-medium">Date Range</span>
          <span className="text-[#718096]">Oct 1, 2024 – Oct 31, 2024</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: '$2.4M', change: '+12.4% vs last month', icon: DollarSign, positive: true },
          { label: 'Shipment Volume', value: '18,420', change: '+8.1% vs last month', icon: Package, positive: true },
          { label: 'Avg Transit Time', value: '14.2 Days', change: '-2.1 Days (Improved)', icon: Clock, positive: true },
          { label: 'Quote Conversion', value: '24.8%', change: 'Stable performance', icon: TrendingUp, positive: null },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">{kpi.label}</p>
                <div className="p-1.5 bg-[#f0f4f9] rounded-lg">
                  <Icon className="w-4 h-4 text-[#1a3a7a]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1a2d5a]">{kpi.value}</p>
              <p className={`text-xs mt-1 ${kpi.positive === true ? 'text-emerald-600' : kpi.positive === false ? 'text-red-600' : 'text-[#718096]'}`}>
                {kpi.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[#1a2d5a]">Trade Volume by Market</h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#1a3a7a]" /> Kenya</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#f07c00]" /> Dubai</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#2d3748]" /> China</span>
            </div>
          </div>
          <div className="flex items-end gap-8 h-48 px-2">
            {weeklyData.map(w => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 h-40">
                  {[
                    { val: w.kenya, color: 'bg-[#1a3a7a]' },
                    { val: w.dubai, color: 'bg-[#f07c00]' },
                    { val: w.china, color: 'bg-[#2d3748]' },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${b.color} transition-all hover:opacity-80`}
                      style={{ height: `${(b.val / maxVal) * 100}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#a0aec0] mt-1">{w.week}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#1a2d5a] mb-5">Top Categories</h2>
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#2d3748] font-medium">{cat.label}</span>
                  <span className="font-semibold text-[#1a2d5a]">{cat.value}</span>
                </div>
                <div className="w-full bg-[#f0f4f9] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#1a3a7a]" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 text-sm text-[#1a3a7a] font-semibold hover:underline">View full report</button>
        </div>
      </div>

      {/* Bottom: High-Value Shipments + Operational Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Value Shipments */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#1a2d5a]">Recent High-Value Shipments</h2>
            <button className="p-1 rounded hover:bg-[#f0f4f9]">
              <Filter className="w-4 h-4 text-[#718096]" />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0f4f9] bg-[#f7f9fc]">
                {['ID', 'Market', 'Status', 'Value'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {highValueShipments.map(s => (
                <tr key={s.id} className="hover:bg-[#f7f9fc] transition-colors">
                  <td className="py-3.5 px-5 text-sm font-semibold text-[#1a3a7a]">{s.id}</td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm">{s.flag} {s.market}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.statusColor}`}>{s.status}</span>
                  </td>
                  <td className="py-3.5 px-5 text-sm font-semibold text-[#1a2d5a]">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operational Alert */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#1a2d5a] mb-4">Operational Alert</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
            <p className="text-sm text-[#2d3748] leading-relaxed">
              Port congestion in Mombasa is currently increasing lead times for Kenya-bound freight by 4.5 days. Consider air-freight alternatives for priority orders.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Quick Logistics Note</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add operational notes for the logistics team..."
              rows={4}
              className="w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm text-[#2d3748] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/20 focus:border-[#1a3a7a] resize-none transition-all"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
              <Send className="w-4 h-4" /> Notify Team
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-[#e2e8f0] text-[#4a5568] rounded-lg py-2.5 text-sm font-semibold hover:bg-[#f0f4f9] transition-colors">
              <Save className="w-4 h-4" /> Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
