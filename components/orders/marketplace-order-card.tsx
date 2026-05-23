'use client';

import Link from 'next/link';
import { Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { formatKshLabel } from '@/lib/currency';
import type { UserMarketplaceOrder } from '@/lib/types';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1 w-full max-w-[200px]">
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
  if (type === 'delivered') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (type === 'processing') return <Loader2 className="w-4 h-4 text-orange-500" />;
  return <Truck className="w-4 h-4" style={{ color: BLUE }} />;
}

export function MarketplaceOrderCard({ order }: { order: UserMarketplaceOrder }) {
  const detailHref = `/dashboard/orders/${order.id}`;
  const trackHref = `${detailHref}#tracking`;

  return (
    <div className="bg-white border border-[#e5eeff] rounded-lg p-4 flex flex-col lg:flex-row gap-4">
      <Link href={detailHref} className="relative w-full lg:w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-[#f8f9ff] border border-[#e5eeff]">
        <img src={order.image_url} alt="" className="w-full h-full object-cover" />
        <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-white border border-[#c3c6d5] rounded">
          {order.origin_flag}
        </span>
      </Link>

      <div className="flex-1 min-w-0 space-y-2">
        <Link href={detailHref} className="block hover:opacity-90">
          <p className="text-xs font-mono text-[#737784]">#{order.order_number}</p>
          <p className="text-sm font-bold text-black">{order.title}</p>
        </Link>
        <div className="flex items-center gap-2">
          <StatusIcon type={order.status_icon} />
          <span className="text-xs font-bold text-[#434653]">{order.status}</span>
        </div>
        <ProgressBar step={order.progress_step} />
        {order.tracking_id ? (
          <p className="text-[10px] font-mono text-[#737784]">
            Tracking: <span className="font-semibold text-black">{order.tracking_id}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-start lg:items-end justify-between gap-3 shrink-0">
        <div className="lg:text-right">
          <p className="text-lg font-bold" style={{ color: BLUE_DARK }}>
            {formatKshLabel(order.price_kes)}
          </p>
          {order.price_secondary ? (
            <p className="text-xs text-[#737784]">{formatKshLabel(order.price_secondary)}</p>
          ) : null}
          <p className="text-[10px] text-[#737784] mt-1">
            {order.date_label}: <span className="font-semibold text-black">{order.date_value}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={detailHref}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 bg-white"
            style={{ borderColor: BLUE, color: BLUE }}
          >
            {order.secondary_action}
          </Link>
        </div>
      </div>
    </div>
  );
}
