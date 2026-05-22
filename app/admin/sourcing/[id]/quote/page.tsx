'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSourcingRequestById } from '@/lib/data';
import type { SourcingRequestDetail } from '@/lib/mock-data';
import AdminOfficialQuoteForm from '@/components/sourcing/AdminOfficialQuoteForm';
import AdminPageFooter from '@/components/admin/AdminPageFooter';

const BLUE = '#004aad';

export default function AdminGenerateQuotePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [detail, setDetail] = useState<SourcingRequestDetail | null | undefined>(undefined);

  const loadDetail = useCallback(() => {
    if (id) getSourcingRequestById(id).then(setDetail);
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (detail === undefined) {
    return <div className="p-8 text-sm text-[#737784] bg-[#f8f9ff] min-h-full">Loading…</div>;
  }

  if (!detail) {
    return (
      <div className="p-8 bg-[#f8f9ff] min-h-full">
        <p className="text-sm text-[#737784] mb-4">Request not found.</p>
        <Link href="/admin/sourcing" className="text-sm font-bold hover:underline" style={{ color: BLUE }}>
          ← Back to sourcing
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9ff]">
      <div className="flex-1 p-6 lg:p-8">
        <nav className="text-xs text-[#737784] mb-4">
          <Link href="/admin/sourcing" className="hover:underline">
            Sourcing Requests
          </Link>
          {' / '}
          <Link href={`/admin/sourcing/${id}`} className="hover:underline">
            Request Detail
          </Link>
          {' / '}
          <span className="text-[#434653] font-medium">Official Quote</span>
        </nav>

        <AdminOfficialQuoteForm
          requestId={detail.id}
          clientName={detail.client_name}
          initialQuote={detail.quotes[0] ?? null}
          onSaved={loadDetail}
        />

        <p className="text-xs text-[#737784] mt-4 text-center">
          <Link href={`/admin/sourcing/${id}`} className="font-bold hover:underline" style={{ color: BLUE }}>
            ← Back to full request detail
          </Link>
        </p>
      </div>
      <AdminPageFooter />
    </div>
  );
}
