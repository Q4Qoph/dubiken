import { Globe, Package, Truck } from 'lucide-react';

export default function AuthMarketingPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
      style={{ background: 'linear-gradient(145deg, #0f1e45 0%, #1a3a7a 50%, #1e4b9e 100%)' }}
    >
      <div className="absolute inset-0 opacity-[0.07]">
        <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="400" cy="250" rx="380" ry="230" stroke="white" strokeWidth="0.8" fill="none" />
          <ellipse cx="400" cy="250" rx="280" ry="230" stroke="white" strokeWidth="0.8" fill="none" />
          <ellipse cx="400" cy="250" rx="380" ry="120" stroke="white" strokeWidth="0.8" fill="none" />
          <line x1="20" y1="250" x2="780" y2="250" stroke="white" strokeWidth="0.8" />
          <line x1="400" y1="20" x2="400" y2="480" stroke="white" strokeWidth="0.8" />
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="20"
              y1={80 + i * 45}
              x2="780"
              y2={80 + i * 45}
              stroke="white"
              strokeWidth="0.4"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 text-white/90 text-sm mb-8">
          <Globe className="w-4 h-4" />
          Shop with Dubiken
        </div>
        <h1 className="text-white text-4xl font-bold leading-tight mb-4">
          Products from Dubai
          <br />
          and China
        </h1>
        <p className="text-white/70 text-lg leading-relaxed max-w-md">
          Browse the catalog, pay in KSh, and track your order to Kenya. One checkout, one team.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4">
        <div className="border border-white/20 rounded-xl p-5 bg-white/5 backdrop-blur-sm">
          <Package className="w-6 h-6 text-white/80 mb-3" />
          <h3 className="text-white font-semibold mb-1">Wide catalog</h3>
          <p className="text-white/60 text-sm">Electronics, fashion, and more from Dubai and China.</p>
        </div>
        <div className="border border-white/20 rounded-xl p-5 bg-white/5 backdrop-blur-sm">
          <Truck className="w-6 h-6 text-white/80 mb-3" />
          <h3 className="text-white font-semibold mb-1">Live Tracking</h3>
          <p className="text-white/60 text-sm">End-to-end logistics visibility for every shipment.</p>
        </div>
      </div>
    </div>
  );
}
