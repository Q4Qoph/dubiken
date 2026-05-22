'use client';

import { useMemo } from 'react';
import { TrendingUp, Receipt, FileText, Gauge, Filter } from 'lucide-react';
import { useAdminMarketplaceOrders } from '@/lib/api/hooks';
import { parseKsh } from '@/lib/currency';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const ORANGE = '#ff924d';
const SECTION_HEADER_BG = '#e1efff';

function statusClass(status: string) {
  const s = status.toUpperCase();
  if (s.includes('DELIVER')) return 'bg-green-50 text-green-800 border-green-200';
  if (s.includes('TRANSIT') || s.includes('SHIP')) return 'bg-[#eff4ff] text-[#004aad] border-[#dce9ff]';
  return 'bg-orange-50 text-orange-700 border-orange-200';
}

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useAdminMarketplaceOrders();

  const kpis = useMemo(() => {
    const total = orders.length;
    const revenueKes = orders.reduce((sum, o) => sum + parseKsh(o.price_kes), 0);
    const pending = orders.filter((o) => {
      const s = o.status.toUpperCase();
      return s.includes('PROCESS') || s.includes('PENDING');
    }).length;
    const delivered = orders.filter((o) => o.status.toUpperCase().includes('DELIVER')).length;
    const fulfillmentPct = total > 0 ? Math.round((delivered / total) * 100) : 0;
    return { total, revenueKes, pending, fulfillmentPct };
  }, [orders]);

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            Marketplace Orders
          </h1>
          <p className="text-sm text-[#737784] mt-1">Catalog sales from the marketplace.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Total Orders
              </p>
              <TrendingUp className="w-5 h-5" style={{ color: BLUE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              {isLoading ? '…' : kpis.total.toLocaleString('en-KE')}
            </p>
            <p className="text-xs text-[#737784] mt-1">Marketplace catalog</p>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Gross Revenue
              </p>
              <Receipt className="w-5 h-5" style={{ color: BLUE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              {isLoading ? '…' : kpis.revenueKes.toLocaleString('en-KE')}
            </p>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                In Progress
              </p>
              <FileText className="w-5 h-5" style={{ color: ORANGE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              {isLoading ? '…' : kpis.pending}
            </p>
            <p className="text-xs text-[#737784] mt-1">Processing or pending</p>
          </div>

          <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                Delivered Rate
              </p>
              <Gauge className="w-5 h-5" style={{ color: BLUE }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
              {isLoading ? '…' : `${kpis.fulfillmentPct}%`}
            </p>
            <p className="text-xs text-[#737784] mt-1">Of all marketplace orders</p>
          </div>
        </div>

        <div className="bg-white border border-[#e5eeff] rounded-lg overflow-hidden mb-6">
          <div
            className="flex items-center justify-between px-5 py-3 border-b border-[#dce9ff]"
            style={{ backgroundColor: SECTION_HEADER_BG }}
          >
            <h2 className="text-sm font-bold text-black">Marketplace Orders</h2>
            <button type="button" className="p-1.5 hover:opacity-70" aria-label="Filter">
              <Filter className="w-4 h-4 text-[#434653]" />
            </button>
          </div>

          {isLoading ? (
            <p className="p-8 text-center text-sm text-[#737784]">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#737784]">
              No marketplace orders yet. Orders appear here when buyers complete checkout.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#e5eeff] bg-[#f8f9ff]">
                    {['Order', 'Customer', 'Product', 'Amount', 'Status', 'ETA', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#737784]"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#e5eeff] last:border-0 hover:bg-[#f8f9ff]/60"
                    >
                      <td className="px-5 py-4 text-sm font-bold font-mono" style={{ color: BLUE }}>
                        #{order.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-black">{order.customer_name}</p>
                        {order.customer_detail ? (
                          <p className="text-xs text-[#737784]">{order.customer_detail}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-black line-clamp-1">{order.title}</p>
                        <p className="text-xs text-[#737784]">{order.vendor}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-black">{order.price_kes}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded border ${statusClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#434653]">{order.date_value}</td>
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
          )}
        </div>
      </div>

      <AdminPageFooter />
    </div>
  );
}
