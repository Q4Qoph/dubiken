'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  ClipboardList,
  FileText,
  Wallet,
  ChevronDown,
} from 'lucide-react';
import { getUserSourcingDashboard } from '@/lib/data';
import type { UserSourcingRequestItem } from '@/lib/mock-data';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

const statusDot: Record<UserSourcingRequestItem['status_variant'], string> = {
  orange: 'bg-orange-500',
  blue: 'bg-[#004aad]',
  gray: 'bg-[#737784]',
};

export default function UserSourcingPage() {
  const [summary, setSummary] = useState({ active: 0, pending_quotes: 0, procured_total: '$0' });
  const [requests, setRequests] = useState<UserSourcingRequestItem[]>([]);

  useEffect(() => {
    getUserSourcingDashboard().then((data) => {
      setSummary(data.summary);
      setRequests(data.requests);
    });
  }, []);

  return (
    <div className="p-6 lg:p-8 bg-white min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BLUE_DARK }}>
            Custom Sourcing Requests
          </h1>
          <p className="text-sm text-[#737784] mt-1 max-w-xl">
            Track and manage your global procurement inquiries across Kenya, Dubai, and China.
          </p>
        </div>
        <Link
          href="/dashboard/sourcing/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: BLUE_DARK }}
        >
          <Plus className="w-4 h-4" />
          New Sourcing Request
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold uppercase text-[#737784]">Active Requests</p>
            <ClipboardList className="w-5 h-5" style={{ color: BLUE }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: BLUE_DARK }}>
            {summary.active}
          </p>
        </div>
        <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold uppercase text-[#737784]">Pending Quotes</p>
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold" style={{ color: BLUE_DARK }}>
            {String(summary.pending_quotes).padStart(2, '0')}
          </p>
        </div>
        <div className="bg-white border border-[#e5eeff] rounded-lg p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold uppercase text-[#737784]">Procured Total</p>
            <Wallet className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold" style={{ color: BLUE_DARK }}>
            {summary.procured_total}
          </p>
        </div>
        <div
          className="rounded-lg p-5 text-white"
          style={{ backgroundColor: BLUE_DARK }}
        >
          <p className="text-[10px] font-bold uppercase opacity-90 mb-2">Market Insight</p>
          <p className="text-xs leading-relaxed opacity-95">
            Dubai-to-Nairobi lane volume up 18% this quarter.
          </p>
          <button type="button" className="text-xs font-bold mt-3 underline hover:opacity-80">
            View Trends →
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5 rounded-lg border border-[#e5eeff] bg-[#f8f9ff] p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737784]" />
          <input
            type="text"
            placeholder="Search Request ID or product..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#c3c6d5] rounded-lg bg-white focus:outline-none focus:border-[#004aad]"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border border-[#c3c6d5] rounded-lg bg-white text-[#434653]"
        >
          All Statuses <ChevronDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border border-[#c3c6d5] rounded-lg bg-white text-[#434653]"
        >
          All Origins <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-[#e5eeff] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-bold px-2 py-1 border border-[#c3c6d5] rounded bg-[#f8f9ff]">
                {req.origin}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-mono text-[#737784]">#{req.request_number}</p>
                <p className="text-sm font-bold text-black truncate">{req.title}</p>
              </div>
            </div>
            <p className="text-sm font-bold shrink-0" style={{ color: BLUE }}>
              {req.price}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2 h-2 rounded-full ${statusDot[req.status_variant]}`} />
              <span className="text-xs font-bold text-[#434653]">{req.status}</span>
            </div>
            <Link
              href={`/dashboard/sourcing/${req.id}`}
              className="px-4 py-2 text-xs font-bold rounded-lg border-2 shrink-0 text-center hover:bg-[#f8f9ff]"
              style={{ borderColor: BLUE, color: BLUE }}
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
