import { Filter, Plus, TrendingUp, ArrowRight } from 'lucide-react';

const shipments = [
  {
    id: 'DBK-CN-8842',
    commodity: 'Electronics (Solar Panels)',
    origin: 'CN',
    dest: 'KE',
    status: 'IN TRANSIT',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    eta: 'Oct 24, 2024',
    action: 'Manage',
    actionStyle: 'text-[#1a3a7a] font-semibold hover:underline',
  },
  {
    id: 'DBK-AE-1102',
    commodity: 'Spare Parts (Automotive)',
    origin: 'AE',
    dest: 'KE',
    status: 'AT PORT',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    eta: 'Oct 18, 2024',
    action: 'Manage',
    actionStyle: 'text-[#1a3a7a] font-semibold hover:underline',
  },
  {
    id: 'DBK-CN-4459',
    commodity: 'Textiles (Rolls)',
    origin: 'CN',
    dest: 'AE',
    status: 'CUSTOMS',
    statusColor: 'bg-red-50 text-red-700 border-red-200',
    eta: 'Oct 29, 2024',
    action: 'Alert Team',
    actionStyle: 'text-red-600 font-semibold hover:underline',
  },
];

export default function LogisticsPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2d5a]">Logistics Management</h1>
          <p className="text-[#718096] mt-0.5">Real-time oversight of global trade lanes and active freight.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg text-[#4a5568] bg-white hover:bg-[#f0f4f9] shadow-sm transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1a2d5a] text-white rounded-lg hover:bg-[#1a3a7a] shadow-sm transition-colors font-semibold">
            <Plus className="w-4 h-4" /> Track New Shipment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Map Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#1a2d5a] mb-4">Global Trade Lanes</h2>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1a3a7a]" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#f07c00]" /> Delay</span>
          </div>
          {/* SVG Map */}
          <div className="bg-[#e8ecf4] rounded-xl overflow-hidden relative" style={{ height: 280 }}>
            <svg viewBox="0 0 800 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified world map outlines */}
              <rect width="800" height="400" fill="#d0d8e8"/>
              {/* Africa */}
              <path d="M320,140 L340,130 L360,135 L375,150 L380,170 L375,200 L365,230 L355,250 L345,260 L330,255 L320,240 L310,220 L305,195 L308,170 L315,155 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>
              {/* Middle East */}
              <path d="M400,130 L430,120 L450,130 L460,145 L455,165 L440,170 L420,165 L405,155 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>
              {/* Europe */}
              <path d="M300,80 L340,70 L375,75 L395,90 L390,110 L370,115 L345,110 L320,105 L305,95 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>
              {/* China/East Asia */}
              <path d="M560,90 L610,80 L650,90 L670,110 L665,135 L645,145 L615,140 L590,130 L565,115 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>
              {/* South/SE Asia */}
              <path d="M540,140 L575,135 L600,150 L610,170 L595,185 L570,180 L545,165 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>
              {/* Americas */}
              <path d="M80,80 L140,75 L170,90 L175,120 L160,150 L135,165 L110,160 L85,145 L70,120 L72,98 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>
              <path d="M100,175 L130,170 L155,180 L160,210 L150,240 L130,265 L105,270 L85,255 L75,230 L78,200 Z" fill="#b8c4d8" stroke="#9aacca" strokeWidth="1"/>

              {/* Trade lanes */}
              <line x1="340" y1="190" x2="430" y2="148" stroke="#1a3a7a" strokeWidth="1.5" strokeDasharray="6,4"/>
              <line x1="430" y1="148" x2="590" y2="120" stroke="#1a3a7a" strokeWidth="1.5" strokeDasharray="6,4"/>
              <line x1="340" y1="190" x2="590" y2="120" stroke="#f07c00" strokeWidth="1" strokeDasharray="4,4" opacity="0.7"/>

              {/* Hub dots */}
              <circle cx="340" cy="190" r="8" fill="#f07c00" stroke="white" strokeWidth="2"/>
              <circle cx="430" cy="148" r="8" fill="#1a3a7a" stroke="white" strokeWidth="2"/>
              <circle cx="590" cy="120" r="8" fill="#1a3a7a" stroke="white" strokeWidth="2"/>

              {/* Labels */}
              <text x="340" y="215" textAnchor="middle" fill="#1a2d5a" fontSize="10" fontWeight="bold">Nairobi</text>
              <text x="430" y="173" textAnchor="middle" fill="#1a2d5a" fontSize="10" fontWeight="bold">Dubai</text>
              <text x="590" y="108" textAnchor="middle" fill="#1a2d5a" fontSize="10" fontWeight="bold">Guangzhou</text>
            </svg>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
            <p className="text-sm text-[#718096] mb-1">In Transit Value</p>
            <p className="text-3xl font-bold text-[#1a2d5a]">$1.4M</p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
            <p className="text-sm text-[#718096] mb-1">Active Shipments</p>
            <p className="text-3xl font-bold text-[#f07c00]">48</p>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#f0f4f9]">
              {[
                { label: 'At Port', value: 12 },
                { label: 'Transit', value: 28 },
                { label: 'Customs', value: 8 },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-sm text-[#a0aec0]">{s.label}</p>
                  <p className="text-lg font-bold text-[#1a3a7a]">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Shipments Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#1a2d5a]">Active Shipments</h2>
          <div className="flex items-center gap-2">
            <select className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/20 bg-white">
              <option>All Origins</option>
              <option>China (CN)</option>
              <option>Dubai (AE)</option>
              <option>Kenya (KE)</option>
            </select>
            <select className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/20 bg-white">
              <option>All Statuses</option>
              <option>In Transit</option>
              <option>At Port</option>
              <option>Customs</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f7f9fc]">
                {['Tracking ID', 'Commodity', 'Route', 'Status', 'ETA', 'Action'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-[#f7f9fc] transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-sm font-bold text-[#1a3a7a]">{s.id}</span>
                  </td>
                  <td className="py-4 px-5 text-sm text-[#2d3748]">{s.commodity}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#e8eef8] text-[#1a3a7a] text-xs font-bold rounded">{s.origin}</span>
                      <ArrowRight className="w-3 h-3 text-[#a0aec0]" />
                      <span className="px-2 py-0.5 bg-[#e8eef8] text-[#1a3a7a] text-xs font-bold rounded">{s.dest}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm text-[#718096]">{s.eta}</td>
                  <td className="py-4 px-5">
                    <button className={`text-sm ${s.actionStyle}`}>{s.action}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
