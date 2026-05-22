'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Package } from 'lucide-react';
import { getRecentOrders, getShipmentByTrackingId } from '@/lib/data';

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

const BLUE_DARK = '#00357f';
const GREEN = '#1a7a4a';
const ORANGE = '#f07c00';
const TRACK_BTN = '#c47a2f';

const statusLabels: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-[#434653]' },
  processing: { label: 'Processing', color: 'text-[#004aad]' },
  dispatched: { label: 'Dispatched', color: 'text-[#f07c00]' },
  in_port: { label: 'In Port', color: 'text-[#004aad]' },
  delivered: { label: 'Delivered', color: 'text-green-600' },
};

const orderTitles: Record<string, string> = {
  in_port: 'Industrial Valves (50 Units)',
  processing: 'Office Tech Bundle',
  dispatched: 'Office Tech Bundle',
  confirmed: 'Warehouse Supplies',
  delivered: 'Delivered Goods',
};

const originLabels: Record<string, string> = {
  China: 'Origin: China',
  Dubai: 'Origin: Dubai',
  Kenya: 'Origin: Kenya',
};

const defaultMilestones = [
  { label: 'Order Confirmed', detail: 'Warehouse: Guangzhou, CN', date: 'Sep 24', done: true },
  { label: 'Customs Clearance', detail: 'Port of Nansha', date: 'Sep 28', done: true },
  { label: 'In Transit (Sea)', detail: 'Vessel: MV Enterprise', date: 'Oct 01', done: false, active: true },
  { label: 'Arrival at Mombasa', detail: 'Expected: Oct 10', date: 'Oct 10', done: false },
];

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [activeShipmentTab, setActiveShipmentTab] = useState<'CN TO KE' | 'AE TO KE'>('CN TO KE');

  useEffect(() => {
    async function fetchData() {
      const [ordersData, shipmentData] = await Promise.all([
        getRecentOrders(5),
        getShipmentByTrackingId('DBK-99281'),
      ]);
      setOrders(ordersData);
      if (shipmentData) setShipment(shipmentData);
    }
    fetchData();
  }, []);

  const milestones = shipment?.milestones ?? defaultMilestones;

  const recentDisplay = [
    orders.find((o) => o.status === 'in_port'),
    orders.find((o) => o.status === 'dispatched'),
  ].filter((o): o is Order => Boolean(o));

  const recentOrders =
    recentDisplay.length >= 2 ? recentDisplay : orders.slice(0, 2);

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            Overview
          </h1>
          <p className="text-sm text-[#737784] mt-1">
            Welcome back, John. You have 3 active shipments.
          </p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <p className="text-xs font-bold text-[#434653]">Track Shipment</p>
          <div className="flex items-center gap-2">
            <input
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter Tracking ID (e.g. DBK-88291)"
              className="w-full sm:w-52 px-3 py-2 text-sm border border-[#c3c6d5] rounded-lg bg-white focus:outline-none focus:border-[#004aad]"
            />
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity shrink-0"
              style={{ backgroundColor: TRACK_BTN }}
            >
              Track
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5eeff] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#e5eeff]">
            <h2 className="text-base font-bold" style={{ color: GREEN }}>
              Live Logistics Map
            </h2>
            <div className="flex items-center gap-2">
              {(['CN TO KE', 'AE TO KE'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveShipmentTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    activeShipmentTab === tab
                      ? 'text-white'
                      : 'bg-[#f8f9ff] text-[#737784] hover:text-[#434653]'
                  }`}
                  style={
                    activeShipmentTab === tab ? { backgroundColor: BLUE_DARK } : undefined
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="relative bg-[#e8eaed]" style={{ height: '320px' }}>
            <img
              src="https://images.pexels.com/photos/711428/pexels-photo-711428.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="World map"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 320"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M 600 140 Q 500 120 400 160 Q 320 190 280 200"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 4"
                opacity="0.85"
              />
              <circle cx="600" cy="140" r="5" fill={ORANGE} />
              <circle cx="280" cy="200" r="4" fill="white" stroke="white" strokeWidth="2" />
              <circle cx="480" cy="155" r="7" fill={ORANGE} />
              <circle cx="480" cy="155" r="14" fill={ORANGE} opacity="0.25" />
            </svg>
            <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1.5 shadow-sm flex items-center gap-2 border border-[#e5eeff]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ORANGE }} />
              <span className="text-xs font-medium text-[#434653]">
                Package DBK-99281 (Transit: South China Sea)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5eeff] p-5">
          <h2 className="text-base font-bold text-black mb-4">Active Quotes</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#434653]">Solar Panels (CN)</span>
              <span className="text-xs font-bold text-[#f07c00] bg-orange-50 px-2 py-0.5 rounded shrink-0">
                Awaiting Approval
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#434653]">Leather Goods (AE)</span>
              <span className="text-xs font-bold text-[#004aad] bg-[#eff4ff] px-2 py-0.5 rounded shrink-0">
                Negotiating
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#e5eeff] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: GREEN }}>
              Recent Orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-sm font-bold hover:underline"
              style={{ color: BLUE_DARK }}
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const sc = statusLabels[order.status] || {
                  label: order.status,
                  color: 'text-[#434653]',
                };
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff]"
                  >
                    <div className="w-10 h-10 bg-white border border-[#e5eeff] rounded-lg flex items-center justify-center shrink-0">
                      {order.status === 'in_port' ? (
                        <Package className="w-5 h-5 text-[#737784]" />
                      ) : (
                        <FileText className="w-5 h-5 text-[#737784]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">
                        {orderTitles[order.status] || `Order #${order.order_number}`}
                      </p>
                      <p className="text-xs text-[#737784]">
                        Order #{order.order_number} •{' '}
                        {originLabels[order.origin] || `Origin: ${order.origin}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold ${sc.color}`}>{sc.label}</p>
                      <p className="text-xs text-[#737784]">
                        ETA:{' '}
                        {order.eta
                          ? new Date(order.eta).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[#737784] text-center py-6">No recent orders</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5eeff] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-black">Shipment Tracker</h2>
            <span
              className="text-white text-xs font-bold px-2.5 py-1 rounded-md"
              style={{ backgroundColor: BLUE_DARK }}
            >
              {shipment?.tracking_id || 'DBK-99281'}
            </span>
          </div>
          <div className="relative pl-1">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#e5eeff]" />
            <div className="space-y-5">
              {milestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 mt-0.5 border-2 ${
                      milestone.active
                        ? 'bg-white border-[#f07c00]'
                        : milestone.done
                          ? 'border-transparent'
                          : 'bg-[#f8f9ff] border-[#e5eeff]'
                    }`}
                    style={
                      milestone.done && !milestone.active
                        ? { backgroundColor: BLUE_DARK, borderColor: BLUE_DARK }
                        : undefined
                    }
                  >
                    {milestone.done && !milestone.active && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                    {milestone.active && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f07c00]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold ${
                        milestone.active
                          ? 'text-[#f07c00]'
                          : milestone.done
                            ? 'text-black'
                            : 'text-[#737784]'
                      }`}
                    >
                      {milestone.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        milestone.done || milestone.active ? 'text-[#737784]' : 'text-[#c3c6d5]'
                      }`}
                    >
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
  );
}
