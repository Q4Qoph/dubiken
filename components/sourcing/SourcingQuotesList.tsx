'use client';

import { ShieldCheck } from 'lucide-react';
import type { SourcingQuoteReceived } from '@/lib/types';

const BLUE = '#004aad';

export default function SourcingQuotesList({
  quotes,
  title = 'Quotes Received',
  showFilter = true,
}: {
  quotes: SourcingQuoteReceived[];
  title?: string;
  showFilter?: boolean;
}) {
  if (quotes.length === 0) {
    return (
      <section className="bg-white border border-[#e5eeff] rounded-lg p-6">
        <h2 className="text-sm font-bold text-black mb-2">{title}</h2>
        <p className="text-sm text-[#737784]">No quotes yet. Check back after admin review.</p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-[#e5eeff] rounded-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-sm font-bold text-black">
          {title}
          {showFilter && quotes.length > 0 ? ` (${quotes.length})` : ''}
        </h2>
        {showFilter && (
          <button type="button" className="text-xs font-bold text-[#737784] hover:underline">
            Filter by Rating
          </button>
        )}
      </div>
      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="border border-[#e5eeff] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" style={{ color: BLUE }} />
              <span className="text-xs font-bold text-black">
                {q.official ? 'Dubiken quote' : 'Quote'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#737784] mb-0.5">Unit Price</p>
                <p className="font-bold text-black">{q.unit_price}</p>
              </div>
              {q.shipping_cost && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#737784] mb-0.5">Shipping</p>
                  <p className="font-bold text-black">{q.shipping_cost}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold uppercase text-[#737784] mb-0.5">Lead Time</p>
                <p className="font-bold text-black">{q.lead_time}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-[#737784] mb-0.5">Shipment</p>
                <p className="font-bold text-black">{q.shipment}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold uppercase text-[#737784] mb-0.5">Notes from Admin</p>
                <p className="text-xs text-[#434653] leading-relaxed">{q.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
