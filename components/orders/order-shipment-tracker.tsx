'use client';

import type { Shipment, ShipmentMilestone } from '@/lib/types';

const BLUE = '#004aad';

export function OrderShipmentTracker({
  trackingId,
  shipment,
  compact,
}: {
  trackingId: string;
  shipment: Shipment | null;
  compact?: boolean;
}) {
  const milestones: ShipmentMilestone[] = shipment?.milestones ?? [];

  return (
    <div className={compact ? '' : 'border border-[#e5eeff] rounded-lg p-5 bg-[#f8f9ff]'}>
      {!compact ? (
        <h2 className="text-sm font-bold text-black mb-1">Shipment tracking</h2>
      ) : null}
      <p className="text-xs font-mono font-bold mb-3" style={{ color: BLUE }}>
        {shipment?.tracking_id ?? trackingId}
      </p>
      {shipment ? (
        <p className="text-xs text-[#737784] mb-4">
          {shipment.origin_city} → {shipment.destination_city}
          {shipment.vessel ? ` · ${shipment.vessel}` : ''}
          {shipment.current_status ? ` · ${shipment.current_status}` : ''}
        </p>
      ) : null}

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <p className="text-sm text-[#737784]">
            Tracking is being set up. Check back shortly for milestone updates.
          </p>
        ) : (
          milestones.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  m.active ? 'bg-[#f07c00]' : m.done ? 'bg-[#004aad]' : 'bg-[#e5eeff]'
                }`}
              />
              <div>
                <p
                  className={`text-sm font-bold ${
                    m.active ? 'text-[#f07c00]' : m.done ? 'text-black' : 'text-[#737784]'
                  }`}
                >
                  {m.label}
                </p>
                <p className="text-xs text-[#737784]">
                  {m.detail}
                  {m.date ? ` · ${m.date}` : ''}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
