'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Loader2, Truck } from 'lucide-react';
import { useUserMarketplaceOrder } from '@/lib/api/hooks';
import { OrderShipmentTracker } from '@/components/orders/order-shipment-tracker';
import { formatKshLabel } from '@/lib/currency';
import type { UserMarketplaceOrder } from '@/lib/types';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1 w-full max-w-[240px]">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i <= step ? '' : 'bg-[#e5eeff]'}`}
          style={i <= step ? { backgroundColor: BLUE } : undefined}
        />
      ))}
    </div>
  );
}

function StatusIcon({ type }: { type: UserMarketplaceOrder['status_icon'] }) {
  if (type === 'delivered') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  if (type === 'processing') return <Loader2 className="w-5 h-5 text-orange-500" />;
  return <Truck className="w-5 h-5" style={{ color: BLUE }} />;
}

export default function UserMarketplaceOrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { data, isLoading } = useUserMarketplaceOrder(id);

  if (isLoading) {
    return <div className="p-8 text-sm text-[#737784] bg-[#f8f9ff] min-h-full">Loading order…</div>;
  }

  if (!data?.order) {
    return (
      <div className="p-8 bg-[#f8f9ff] min-h-full">
        <p className="text-sm text-[#737784] mb-4">Order not found.</p>
        <Link href="/dashboard/orders" className="text-sm font-bold hover:underline" style={{ color: BLUE }}>
          ← Back to orders
        </Link>
      </div>
    );
  }

  const { order, shipment } = data;
  const trackingId = order.tracking_id ?? order.order_number;

  return (
    <div className="p-6 lg:p-8 bg-[#f8f9ff] min-h-full">
      <nav className="text-xs text-[#737784] mb-4">
        <Link href="/dashboard/orders" className="hover:underline">
          My Orders
        </Link>
        {' / '}
        <span className="text-[#434653] font-medium">#{order.order_number}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="relative w-full lg:w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-white border border-[#e5eeff]">
          <img src={order.image_url} alt="" className="w-full h-full object-cover" />
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#c3c6d5] rounded">
            {order.origin_flag}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-mono text-[#737784] mb-1">#{order.order_number}</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: BLUE_DARK }}>
            {order.title}
          </h1>
          <p className="text-sm text-[#737784] mb-3">{order.vendor}</p>
          <div className="flex items-center gap-2 mb-3">
            <StatusIcon type={order.status_icon} />
            <span className="text-sm font-bold text-[#434653]">{order.status}</span>
          </div>
          <ProgressBar step={order.progress_step} />
        </div>
        <div className="lg:text-right shrink-0">
          <p className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            {formatKshLabel(order.price_kes)}
          </p>
          <p className="text-sm text-[#737784] mt-2">
            {order.date_label}: <span className="font-semibold text-black">{order.date_value}</span>
          </p>
        </div>
      </div>

      <div id="tracking" className="scroll-mt-6">
        <OrderShipmentTracker trackingId={trackingId} shipment={shipment} />
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/orders"
          className="text-sm font-bold hover:underline"
          style={{ color: BLUE }}
        >
          ← All orders
        </Link>
      </div>
    </div>
  );
}
