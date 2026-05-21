import { Package, Plus, Filter, Download, TrendingDown } from 'lucide-react';

const inventory = [
  { sku: 'INV-CN-4421', name: 'Solar Panel 400W Monocrystalline', category: 'Electronics', origin: 'CN', stock: 342, low: false, value: '$89,200' },
  { sku: 'INV-AE-2201', name: 'Aluminum Framing Profile 6m', category: 'Construction', origin: 'AE', stock: 18, low: true, value: '$12,400' },
  { sku: 'INV-CN-5512', name: 'Silk Fabric Roll (Grade A)', category: 'Textiles', origin: 'CN', stock: 204, low: false, value: '$34,600' },
  { sku: 'INV-KE-1103', name: 'Macadamia Nuts (50kg bags)', category: 'Agri-Business', origin: 'KE', stock: 9, low: true, value: '$8,100' },
  { sku: 'INV-CN-8834', name: 'Industrial Inverter 5kVA', category: 'Electronics', origin: 'CN', stock: 77, low: false, value: '$62,300' },
  { sku: 'INV-AE-3302', name: 'Automotive Spare Parts Kit', category: 'Automotive', origin: 'AE', stock: 145, low: false, value: '$41,750' },
];

const originFlags: Record<string, string> = { CN: '🇨🇳', KE: '🇰🇪', AE: '🇦🇪' };

export default function InventoryPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2d5a]">Inventory</h1>
          <p className="text-[#718096] mt-0.5">Stock levels across regional warehouses.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg text-[#4a5568] bg-white hover:bg-[#f0f4f9] shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg text-[#4a5568] bg-white hover:bg-[#f0f4f9] shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1a2d5a] text-white rounded-lg hover:bg-[#1a3a7a] shadow-sm font-semibold">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg"><Package className="w-5 h-5 text-[#1a3a7a]" /></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Total SKUs</p>
          </div>
          <p className="text-3xl font-bold text-[#1a2d5a]">1,847</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg"><TrendingDown className="w-5 h-5 text-amber-600" /></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Low Stock Items</p>
          </div>
          <p className="text-3xl font-bold text-amber-600">23</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg"><Package className="w-5 h-5 text-emerald-600" /></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">Total Value</p>
          </div>
          <p className="text-3xl font-bold text-[#1a2d5a]">$2.1M</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
        <div className="p-5 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#1a2d5a]">Stock Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f7f9fc]">
                {['SKU', 'Product Name', 'Category', 'Origin', 'Stock', 'Est. Value', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-[#a0aec0]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {inventory.map(item => (
                <tr key={item.sku} className="hover:bg-[#f7f9fc] transition-colors">
                  <td className="py-4 px-5 text-sm font-mono text-[#1a3a7a]">{item.sku}</td>
                  <td className="py-4 px-5">
                    <p className="text-sm font-medium text-[#2d3748]">{item.name}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-medium text-[#4a5568] bg-[#f0f4f9] px-2.5 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm">{originFlags[item.origin]} {item.origin}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`text-sm font-semibold ${item.low ? 'text-red-600' : 'text-[#1a2d5a]'}`}>
                      {item.stock} {item.low && <span className="ml-1 text-xs text-red-500 font-normal">(Low)</span>}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm font-semibold text-[#1a2d5a]">{item.value}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-medium text-[#4a5568] hover:bg-[#f0f4f9]">Edit</button>
                      <button className="px-3 py-1.5 bg-[#1a2d5a] text-white rounded-lg text-xs font-medium hover:bg-[#1a3a7a]">Reorder</button>
                    </div>
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
