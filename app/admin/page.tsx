'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Truck, BarChart2, Settings, HelpCircle, Plus, Download, Upload, ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SourcingRequest {
  id: string;
  request_number: string;
  client_name: string;
  client_initials: string;
  product_title: string;
  description: string;
  destination: string;
  destination_label: string;
  status: 'pending' | 'quoted' | 'shipping' | 'delivered';
  market: 'KE' | 'AE' | 'CN';
}

const marketColors: Record<string, string> = { KE: 'bg-red-500', AE: 'bg-green-500', CN: 'bg-yellow-500' };
const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending Quote', color: 'text-orange-600', dot: 'bg-orange-500' },
  quoted: { label: 'Quoted', color: 'text-blue-600', dot: 'bg-blue-500' },
  shipping: { label: 'Shipping', color: 'text-green-600', dot: 'bg-green-500' },
  delivered: { label: 'Delivered', color: 'text-gray-600', dot: 'bg-gray-400' },
};

export default function AdminPage() {
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [activeNav, setActiveNav] = useState('inventory');

  useEffect(() => {
    async function fetchRequests() {
      let query = supabase.from('sourcing_requests').select('*').order('created_at', { ascending: false });
      if (marketFilter !== 'all') query = query.eq('market', marketFilter);
      if (statusFilter.length > 0) query = query.in('status', statusFilter);
      const { data } = await query;
      if (data) setRequests(data);
    }
    fetchRequests();
  }, [marketFilter, statusFilter]);

  function toggleStatusFilter(s: string) {
    setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-[#1a3a6b]">Dubiken</Link>
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <span>Kenya</span>
                <span>Dubai</span>
                <span>China</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input placeholder="Search orders..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded w-56 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]" />
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded"><ShoppingCart className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded"><User className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col sticky top-14 h-[calc(100vh-56px)]">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1a3a6b] flex items-center justify-center"><LayoutDashboard className="w-5 h-5 text-white" /></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Admin Panel</p>
                <p className="text-xs text-gray-500">Global Operations</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveNav(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeNav === id ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="p-3">
            <Link href="#" className="w-full flex items-center justify-center gap-2 bg-[#1a3a6b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#152d54] transition-colors mb-3">
              <Plus className="w-4 h-4" /> New Quote
            </Link>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                <HelpCircle className="w-4 h-4" /> Support
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-1">Sourcing / <span className="text-[#1a3a6b] font-medium">Product Requests</span></div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Custom Sourcing Requests</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and fulfill specific procurement needs from global clients.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600">
                  <Plus className="w-4 h-4" /> Bulk Upload
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5">
            <div className="flex flex-col sm:flex-row gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Filter by Market</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => setMarketFilter('all')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${marketFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>All Markets</button>
                  {(['KE', 'AE', 'CN'] as const).map((m) => (
                    <button key={m} onClick={() => setMarketFilter(marketFilter === m ? 'all' : m)} className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${marketFilter === m ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'}`}>
                      {m} <span className={`w-2 h-2 rounded-full ${marketColors[m]}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Workflow Status</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['pending', 'quoted', 'shipping'] as const).map((s) => (
                    <button key={s} onClick={() => toggleStatusFilter(s)} className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${statusFilter.includes(s) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {s === 'pending' ? 'Pending' : s === 'quoted' ? 'Quoted' : 'Shipping'}
                    </button>
                  ))}
                </div>
              </div>
              {(marketFilter !== 'all' || statusFilter.length > 0) && (
                <button onClick={() => { setMarketFilter('all'); setStatusFilter([]); }} className="text-xs text-[#1a3a6b] font-semibold hover:underline self-end sm:ml-auto">
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Client & ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Product Details</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Destination</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map((req) => {
                  const sc = statusConfig[req.status];
                  return (
                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center">
                            {req.client_initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{req.client_name}</p>
                            <p className="text-xs text-gray-500">{req.request_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell max-w-[220px]">
                        <p className="text-sm font-semibold text-[#1a3a6b]">{req.product_title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{req.description}</p>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 border border-gray-300 rounded px-2.5 py-1.5 w-fit">
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />
                          <span className="text-xs font-medium text-gray-700">{req.destination}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                          <span className={`text-xs font-semibold ${sc.color}`}>{sc.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-xs text-[#1a3a6b] font-medium hover:underline">View</button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">No requests found</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="border-t border-gray-200 px-5 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">Showing 1-10 of 258 requests</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                {[1, 2, 3].map((p) => (
                  <button key={p} className={`w-7 h-7 flex items-center justify-center border rounded text-xs font-medium ${p === 1 ? 'border-[#1a3a6b] bg-[#1a3a6b] text-white' : 'border-gray-300 text-gray-600'}`}>
                    {p}
                  </button>
                ))}
                <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-gray-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#1a3a6b]">Dubiken Global</p>
              <p className="text-xs text-gray-500">© 2024 Dubiken Global. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-500">
              {['Sourcing Guide', 'Shipping Policy', 'Tracking', 'Contact Support', 'Terms of Service'].map((l) => (
                <Link key={l} href="#" className="hover:text-[#1a3a6b]">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
