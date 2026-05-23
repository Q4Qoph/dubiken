'use client';

const BLUE = '#004aad';

export default function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className="w-12 h-12 rounded-full border-[3px] border-[#e5eeff] border-t-[#004aad] animate-spin mb-5"
        style={{ borderTopColor: BLUE }}
      />
      <p className="text-sm font-bold" style={{ color: BLUE }}>
        {label}
      </p>
    </div>
  );
}
