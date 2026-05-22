'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Receipt,
  FileText,
  Gauge,
  Filter,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { getSourcingOrders } from '@/lib/data';
import type { SourcingOrderRow } from '@/lib/mock-data';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';
const SECTION_HEADER_BG = '#e1efff';
const ALERT_ORANGE = '#f99b57';

type ViewMode = 'all' | 'marketplace' | 'sourcing';
type OrderTab = 'sourcing' | 'marketplace';

export default function AdminOrdersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('sourcing');
  const [activeTab, setActiveTab] = useState<OrderTab>('sourcing');
  const [sourcingOrders, setSourcingOrders] = useState<SourcingOrderRow[]>([]);

  useEffect(() => {
    getSourcingOrders().then(setSourcingOrders);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              Order Management
            </h1>
            <p className="text-sm text-[#737784] mt-1">
              Manage marketplace sales and custom sourcing requests.
            </p>
          </div>
          <div className="flex rounded-lg border border-[#c3c6d5] overflow-hidden bg-white shrink-0">
            {(
              [
                { id: 'all' as const, label: 'All View' },
                { id: 'marketplace' as const, label: 'Marketplace' },
                { id: 'sourcing' as const, label: 'Sourcing' },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setViewMode(v.id)}
                className={`px-4 py-2 text-xs font-bold ${
                  viewMode === v.id ? 'text-white' : 'text-[#434653] hover:bg-[#f8f9ff]'
                }`}
                style={viewMode === v.id ? { backgroundColor: BLUE_DARK } : undefined}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Total Volume
              </p>
              <TrendingUp className="w-5 h-5" style={{ color: BLUE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              1,284
            </p>
            <p className="text-xs text-[#737784] mt-1">824 MKT · 460 SRC</p>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Gross Revenue
              </p>
              <Receipt className="w-5 h-5" style={{ color: BLUE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              $248,500
            </p>
            <p className="text-xs font-bold mt-1" style={{ color: ORANGE }}>
              KES 32.1M Equivalent
            </p>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Pending Orders
              </p>
              <FileText className="w-5 h-5" style={{ color: ORANGE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              42
            </p>
            <p className="text-xs text-[#737784] mt-1">14 Sourcing, 28 Mkt</p>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Avg. Fulfillment
              </p>
              <Gauge className="w-5 h-5" style={{ color: BLUE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              6.2 Days
            </p>
            <p className="text-xs text-[#737784] mt-1">Global Sourcing Average</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e5eeff] mb-0">
          <button
            type="button"
            onClick={() => setActiveTab('sourcing')}
            className={`px-5 py-3 text-sm font-bold border-b-2 -mb-px ${
              activeTab === 'sourcing'
                ? 'border-[#004aad] text-[#004aad]'
                : 'border-transparent text-[#737784]'
            }`}
          >
            Sourcing Orders (Custom)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`px-5 py-3 text-sm font-bold border-b-2 -mb-px ${
              activeTab === 'marketplace'
                ? 'border-[#004aad] text-[#004aad]'
                : 'border-transparent text-[#737784]'
            }`}
          >
            Marketplace Orders (Catalog)
          </button>
        </div>

        {activeTab === 'sourcing' && (
          <div className="bg-white border border-[#e5eeff] border-t-0 rounded-b-lg overflow-hidden mb-6">
            <div
              className="flex items-center justify-between px-5 py-3 border-b border-[#dce9ff]"
              style={{ backgroundColor: SECTION_HEADER_BG }}
            >
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-black">Custom Procurement</h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: BLUE_DARK }}
                >
                  HIGH VOLUME
                </span>
              </div>
              <button type="button" className="p-1.5 hover:opacity-70" aria-label="Filter">
                <Filter className="w-4 h-4 text-[#434653]" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#e5eeff] bg-[#f8f9ff]">
                    {['Order', 'Customer', 'Market', 'Est. Value', 'Status', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#737784]"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sourcingOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#e5eeff] last:border-0 hover:bg-[#f8f9ff]/60"
                    >
                      <td className="px-5 py-4 text-sm font-bold font-mono" style={{ color: BLUE }}>
                        #{order.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-black">{order.customer_name}</p>
                        <p className="text-xs text-[#737784]">{order.customer_detail}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#434653]">
                        {order.route}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-black">
                        $
                        {order.estimated_value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                            order.status_variant === 'blue'
                              ? 'bg-[#eff4ff] text-[#004aad] border-[#dce9ff]'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 text-xs font-bold rounded border-2 bg-white"
                            style={{ borderColor: BLUE, color: BLUE }}
                          >
                            {order.primary_action}
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 text-xs font-bold rounded text-white"
                            style={{ backgroundColor: BLUE_DARK }}
                          >
                            {order.secondary_action}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-dashed border-[#c3c6d5] bg-[#f8f9ff] text-center">
              <p className="text-sm text-[#737784]">
                Catalog Marketplace (Hidden) —{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('marketplace')}
                  className="font-bold hover:underline"
                  style={{ color: BLUE }}
                >
                  Switch to Marketplace View
                </button>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="bg-white border border-[#e5eeff] rounded-lg p-12 text-center mb-6">
            <p className="text-sm text-[#737784]">
              Marketplace catalog orders — switch view or use the Marketplace tab above.
            </p>
          </div>
        )}

        {/* Bottom cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-1 border border-[#dce9ff] rounded-lg p-5"
            style={{ backgroundColor: '#eff4ff' }}
          >
            <h3 className="text-sm font-bold text-black mb-4">Sourcing Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#434653]">Guangzhou Hub (Sourcing)</span>
                  <span className="font-bold" style={{ color: BLUE }}>
                    65%
                  </span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: BLUE }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#434653]">Dubai Jebel Ali (Logistics)</span>
                  <span className="font-bold text-orange-600">25%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5 flex flex-col items-center justify-center text-center">
            <Globe className="w-10 h-10 mb-2" style={{ color: BLUE }} />
            <p className="text-sm font-bold text-black">Market Coverage</p>
            <p className="text-xs text-[#737784]">Global</p>
          </div>

          <div
            className="rounded-lg p-5 text-white"
            style={{ backgroundColor: ALERT_ORANGE }}
          >
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold">Consolidation Alert</h3>
            </div>
            <p className="text-xs leading-relaxed mb-4 opacity-95">
              14 orders from China (Guangzhou) are ready for bulk container consolidation.
            </p>
            <button
              type="button"
              className="w-full py-2.5 rounded text-xs font-bold bg-[#5c3d1e] text-white hover:opacity-90"
            >
              Manage Bulk Shipment
            </button>
          </div>
        </div>
      </div>

      <AdminPageFooter />
    </div>
  );
}
