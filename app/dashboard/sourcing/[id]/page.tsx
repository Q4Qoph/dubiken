'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';
import { useUserSourcingDetail } from '@/lib/api/hooks';
import type { UserSourcingRequestDetail } from '@/lib/types';
import SourcingQuotesList from '@/components/sourcing/SourcingQuotesList';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const statusDot: Record<UserSourcingRequestDetail['status_variant'], string> = {
  orange: 'bg-orange-500',
  blue: 'bg-[#004aad]',
  gray: 'bg-[#737784]',
};

export default function UserSourcingDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { data: detail, isLoading } = useUserSourcingDetail(id);

  if (isLoading) {
    return <div className="p-8 text-sm text-[#737784] bg-white min-h-full">Loading request…</div>;
  }

  if (!detail) {
    return (
      <div className="p-8 bg-white min-h-full">
        <p className="text-sm text-[#737784] mb-4">Request not found.</p>
        <Link href="/dashboard/sourcing" className="text-sm font-bold hover:underline" style={{ color: BLUE }}>
          ← Back to sourcing requests
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-white min-h-full">
      <nav className="text-xs text-[#737784] mb-4">
        <Link href="/dashboard/sourcing" className="hover:underline">
          Sourcing Requests
        </Link>
        {' / '}
        <span className="text-[#434653] font-medium">Request Detail</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${statusDot[detail.status_variant]}`} />
            <span className="text-[10px] font-bold uppercase text-[#434653]">{detail.status}</span>
          </div>
          <p className="text-sm font-mono text-[#737784] mb-1">#{detail.request_number}</p>
          <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            {detail.title}
          </h1>
          <p className="text-sm text-[#737784] mt-1">
            Origin: <span className="font-bold">{detail.origin}</span>
          </p>
        </div>
        <Link
          href="/dashboard/sourcing"
          className="px-4 py-2 text-xs font-bold rounded-lg border-2 shrink-0"
          style={{ borderColor: BLUE, color: BLUE }}
        >
          ← All Requests
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <section className="lg:col-span-2 border border-[#e5eeff] rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-3">Product Description</h2>
          <p className="text-sm text-[#434653] leading-relaxed mb-4">{detail.description}</p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e5eeff]">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#737784]">Quantity</p>
              <p className="text-sm font-bold text-black">{detail.quantity}</p>
            </div>
            {detail.voltage_range && (
              <div>
                <p className="text-[10px] font-bold uppercase text-[#737784]">Voltage Range</p>
                <p className="text-sm font-bold text-black">{detail.voltage_range}</p>
              </div>
            )}
          </div>
        </section>

        <section className="border border-[#e5eeff] rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-3">Budget</h2>
          <p className="text-3xl font-bold" style={{ color: BLUE_DARK }}>
            {detail.budget_total}
          </p>
          <p className="text-xs text-[#737784] mt-1">{detail.budget_subtitle}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {detail.regional_targets.map((t) => (
              <span
                key={t.code}
                className="text-xs font-bold px-2.5 py-1.5 border border-[#c3c6d5] rounded bg-[#f8f9ff]"
              >
                {t.label}
              </span>
            ))}
          </div>
        </section>
      </div>

      {detail.attachments.length > 0 && (
        <section className="border border-[#e5eeff] rounded-lg p-5 mb-5">
          <h2 className="text-sm font-bold text-black mb-4">Your Attachments</h2>
          <div className="flex flex-wrap gap-3">
            {detail.attachments.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-3 border border-[#e5eeff] rounded-lg px-4 py-3"
              >
                <FileText className="w-8 h-8 text-[#737784]" />
                <div>
                  <p className="text-xs font-bold text-black">{f.name}</p>
                  <p className="text-[10px] text-[#737784]">{f.size}</p>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center justify-center gap-2 border-2 border-dashed border-[#c3c6d5] rounded-lg px-6 py-3 text-xs font-bold text-[#737784]"
            >
              <Plus className="w-4 h-4" />
              Add Attachment
            </button>
          </div>
        </section>
      )}

      <SourcingQuotesList
        quotes={detail.quotes.slice(0, 1)}
        title="Official Quote"
        showFilter={false}
      />
    </div>
  );
}
