'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Wallet,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  origin: string;
  eta: string;
}

interface Shipment {
  id: string;
  tracking_id: string;
  current_status: string;
  origin_city: string;
  destination_city: string;
  vessel: string;
  milestones: {
    label: string;
    detail: string;
    date: string;
    done: boolean;
    active?: boolean;
  }[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-gray-600' },
  processing: { label: 'Processing', color: 'text-blue-600' },
  dispatched: { label: 'Dispatched', color: 'text-orange-500' },
  in_port: { label: 'In Port', color: 'text-blue-600' },
  delivered: { label: 'Delivered', color: 'text-green-600' },
};

const originLabels: Record<string, string> = {
  China: 'Origin: China',
  Dubai: 'Origin: Dubai',
  Kenya: 'Origin: Kenya',
};

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [activeShipmentTab, setActiveShipmentTab] = useState<'CN TO KE' | 'AE TO KE'>('CN TO KE');

  useEffect(() => {
    async function fetchData() {
      const [ordersResult, shipmentResult] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('shipments').select('*').eq('tracking_id', 'DBK-99281').maybeSingle(),
      ]);
      if (ordersResult.data) setOrders(ordersResult.data);
      if (shipmentResult.data) setShipment(shipmentResult.data);
    }
    fetchData();
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'sourcing', label: 'Sourcing Requests', icon: FileText },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#eef5fb] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-[#1a3a6b] tracking-tight">Dubiken</Link>
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <span className="cursor-pointer hover:text-[#1a3a6b]">Kenya</span>
                <span className="cursor-pointer hover:text-[#1a3a6b]">Dubai</span>
                <span className="cursor-pointer hover:text-[#1a3a6b]">China</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input placeholder="Search orders..." className="pl-4 pr-4 py-1.5 text-sm border border-gray-300 rounded-md w-52 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]" />
              </div>
              <Link href="/checkout" className="p-1.5 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </Link>
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 sticky top-14 h-[calc(100vh-56px)]">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                img
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Premium Sourcing</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeNav === id ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="p-3">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1a3a6b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#152d54] transition-colors">
              <Plus className="w-4 h-4" /> New Quote
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Overview + Map + Orders */}
            <div className="lg:col-span-2 space-y-5">
              {/* Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                  <p className="text-sm text-gray-500 mt-1">Welcome back, John. You have 3 active shipments.</p>
                </div>
                {/* Track Shipment */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-gray-600">Track Shipment</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Enter Tracking ID (e.g. DBK-88291)"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded w-52 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
                      />
                      <button className="bg-[#1a3a6b] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#152d54] transition-colors">
                        Track
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Logistics Map */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-[#1a7a4a]">Live Logistics Map</h2>
                  <div className="flex items-center gap-2">
                    {(['CN TO KE', 'AE TO KE'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveShipmentTab(tab)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          activeShipmentTab === tab ? 'bg-[#1a3a6b] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative bg-gray-200" style={{ height: '320px' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/711428/pexels-photo-711428.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt="World map"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0">
                      <svg width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
                        <path d="M 600 140 Q 500 120 400 160 Q 320 190 280 200" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.7" />
                        <path d="M 600 140 Q 650 120 680 130 Q 720 140 750 150" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
                        <circle cx="600" cy="140" r="4" fill="#f97316" />
                        <circle cx="280" cy="200" r="4" fill="white" />
                        <circle cx="480" cy="155" r="6" fill="#f97316" opacity="0.9" />
                        <circle cx="480" cy="155" r="12" fill="#f97316" opacity="0.3" />
                      </svg>
                    </div>
                    <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-xs font-medium text-gray-700">Package DBK-992 (Transit: South China Sea)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#1a7a4a]">Recent Orders</h2>
                  <Link href="#" className="text-sm text-[#1a3a6b] font-semibold hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                  {orders.length > 0 ? orders.slice(0, 2).map((order) => {
                    const sc = statusLabels[order.status] || { label: order.status, color: 'text-gray-600' };
                    return (
                      <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {order.status === 'in_port' ? 'Industrial Valves (50 Units)' : 'Office Tech Bundle'}
                          </p>
                          <p className="text-xs text-gray-500">Order #{order.order_number} • {originLabels[order.origin] || `Origin: ${order.origin}`}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold ${sc.color}`}>{sc.label}</p>
                          <p className="text-xs text-gray-500">
                            ETA: {order.eta ? new Date(order.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                          </p>
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-gray-400 text-center py-4">No recent orders</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Active Quotes */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">Active Quotes</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Solar Panels (CN)</span>
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Awaiting Approval</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Leather Goods (AE)</span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Negotiating</span>
                  </div>
                </div>
              </div>

              {/* Shipment Tracker */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-900">Shipment Tracker</h2>
                  <span className="bg-[#1a3a6b] text-white text-xs font-bold px-2.5 py-1 rounded">
                    {shipment?.tracking_id || 'DBK-99281'}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-5">
                    {(shipment?.milestones || [
                      { label: 'Order Confirmed', detail: 'Warehouse: Guangzhou, CN', date: 'Sep 24', done: true },
                      { label: 'Customs Clearance', detail: 'Port of Nansha', date: 'Sep 28', done: true },
                      { label: 'In Transit (Sea)', detail: 'Vessel: MV Enterprise', date: 'Oct 01', done: true, active: true },
                      { label: 'Arrival at Mombasa', detail: 'Expected: Oct 10', date: 'Oct 10', done: false },
                    ]).map((milestone, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5 ${
                          milestone.active
                            ? 'bg-[#1a3a6b] ring-4 ring-blue-100'
                            : milestone.done
                            ? 'bg-[#1a3a6b]'
                            : 'bg-gray-200'
                        }`}>
                          {milestone.done && (
                            <div className={`w-2 h-2 rounded-full ${milestone.active ? 'bg-white' : 'bg-white'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${milestone.active ? 'text-[#1a3a6b]' : milestone.done ? 'text-gray-900' : 'text-gray-400'}`}>
                            {milestone.label}
                          </p>
                          <p className={`text-xs mt-0.5 ${milestone.done ? 'text-gray-500' : 'text-gray-400'}`}>
                            {milestone.detail} • {milestone.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#1a3a6b]">Dubiken</p>
              <p className="text-xs text-gray-500">© 2024 Dubiken Global. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-500">
              {['Sourcing Guide', 'Shipping Policy', 'Tracking', 'Contact Support', 'Terms of Service'].map((l) => (
                <Link key={l} href="#" className="hover:text-[#1a3a6b] transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
