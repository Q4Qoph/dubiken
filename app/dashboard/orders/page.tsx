import { TrendingUp, DollarSign, Clock, Zap, Filter, Download, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const orders = [
  { id: '#DBK-88219', customer: 'Jamal Abdulla', type: 'B2B Sourcing', market: 'AE', value: '$12,450.00', payment: 'Pending', paymentColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: '#DBK-88220', customer: 'Mary Wanjiku', type: 'Retail Consumables', market: 'KE', value: '$2,800.00', payment: 'Paid', paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: '#DBK-88221', customer: 'Shen Wei', type: 'Machinery Export', market: 'CN', value: '$45,000.00', payment: 'Deposited', paymentColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: '#DBK-88222', customer: 'David Mutua', type: 'Electronics Bulk', market: 'KE', value: '$8,920.00', payment: 'Overdue', paymentColor: 'bg-red-50 text-red-700 border-red-200' },
  { id: '#DBK-88223', customer: 'Ali Al-Sayed', type: 'Automotive Parts', market: 'AE', value: '$15,700.00', payment: 'Paid', paymentColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const marketFlags: Record<string, string> = { AE: '🇦🇪', KE: '🇰🇪', CN: '🇨🇳' };

export default function OrdersPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2d5a]">Order Management</h1>
          <p className="text-[#718096] mt-0.5">Real-time tracking of global sourcing and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg text-[#4a5568] hover:bg-white transition-colors bg-white shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg text-[#4a5568] hover:bg-white transition-colors bg-white shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Total Volume</p>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-[#1a2d5a]">1,284</p>
          <p className="text-xs text-emerald-600 mt-1">+12.5% from last month</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Gross Revenue</p>
            <DollarSign className="w-4 h-4 text-[#1a3a7a]" />
          </div>
          <p className="text-2xl font-bold text-[#1a2d5a]">$248,500</p>
          <p className="text-xs text-[#718096] mt-1">KES 32.1M Equivalent</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Pending Orders</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#1a2d5a]">42</p>
          <p className="text-xs text-amber-600 mt-1">8 urgent China shipments</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Avg. Fulfillment</p>
            <Zap className="w-4 h-4 text-[#f07c00]" />
          </div>
          <p className="text-2xl font-bold text-[#1a2d5a]">6.2 Days</p>
          <p className="text-xs text-[#718096] mt-1">Across all regions</p>
        </div>
      </div>

      {/* Regional Performance + Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1a2d5a] mb-5">Regional Performance</h3>
          <div className="space-y-4">
            {[
              { label: 'Kenya (KE)', pct: 45, color: 'bg-[#1a3a7a]' },
              { label: 'Dubai (AE)', pct: 30, color: 'bg-[#f07c00]' },
              { label: 'China (CN)', pct: 25, color: 'bg-[#2d3748]' },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#2d3748]">{r.label}</span>
                  <span className="font-semibold text-[#1a2d5a]">{r.pct}%</span>
                </div>
                <div className="w-full bg-[#f0f4f9] rounded-full h-2">
                  <div className={`h-2 rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[#f0f4f9]">
            <div className="flex items-center gap-3">
              <img
                src="https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop"
                alt="Warehouse"
                className="w-20 h-14 object-cover rounded-lg"
              />
              <div>
                <p className="text-xs font-semibold text-[#2d3748]">Global Logistics Efficiency Index</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f07c00] rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <h3 className="font-semibold">Consolidation Alert</h3>
          </div>
          <p className="text-sm text-white/90 leading-relaxed mb-5">
            14 orders from China (Guangzhou) are ready for bulk container consolidation. Action required to optimize shipping costs.
          </p>
          <button className="w-full bg-white text-[#f07c00] font-semibold text-sm py-2.5 rounded-lg hover:bg-white/90 transition-colors">
            Review Shipments
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#1a2d5a]">Customer Orders</h2>
          <span className="text-sm text-[#718096]">Showing 5 of 1,284 results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f7f9fc]">
                {['Order ID', 'Customer', 'Market', 'Value', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-[#f7f9fc] transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-sm font-semibold text-[#1a3a7a] hover:underline cursor-pointer">{order.id}</span>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-sm font-medium text-[#2d3748]">{order.customer}</p>
                    <p className="text-xs text-[#718096]">{order.type}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f4f9] rounded text-xs font-semibold text-[#2d3748]">
                      <span>{marketFlags[order.market]}</span>
                      {order.market}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm font-semibold text-[#1a2d5a]">{order.value}</td>
                  <td className="py-4 px-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${order.paymentColor}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-medium text-[#4a5568] hover:bg-[#f0f4f9] transition-colors">
                        Generate Invoice
                      </button>
                      <button className="px-3 py-1.5 bg-[#1a2d5a] text-white rounded-lg text-xs font-medium hover:bg-[#1a3a7a] transition-colors">
                        Update Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-5 border-t border-[#e2e8f0]">
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#718096] hover:text-[#1a2d5a] border border-[#e2e8f0] rounded-lg bg-white">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${p === 1 ? 'bg-[#1a2d5a] text-white' : 'text-[#718096] hover:bg-[#f0f4f9]'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#718096] hover:text-[#1a2d5a] border border-[#e2e8f0] rounded-lg bg-white">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
