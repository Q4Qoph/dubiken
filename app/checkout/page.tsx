'use client';

import { useState } from 'react';
import { Minus, Plus, Shield, Truck } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/hooks/use-cart';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const SECTION_BG = '#eff4ff';

export default function CheckoutPage() {
  const { items, updateQuantity } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    region: 'Nairobi County',
  });

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = 85.2;
  const customs = parseFloat((subtotal * 0.08).toFixed(2));
  const insurance = parseFloat((subtotal * 0.01).toFixed(2));
  const total = subtotal + shipping + customs + insurance;

  const steps = [
    { n: 1, label: 'Shipping Info' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader searchPlaceholder="Search orders..." />

      <main className="flex-1 bg-[#f8f9ff]">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-0 mb-6 pb-4 border-b border-[#e5eeff]">
            {steps.map((s, idx) => {
              const isCompleted = s.n < step;
              const isActive = s.n === step;
              const isFilled = isCompleted || isActive;

              return (
                <div key={s.n} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isFilled
                          ? 'text-white'
                          : 'bg-transparent border-2 border-[#c3c6d5] text-[#737784]'
                      }`}
                      style={isFilled ? { backgroundColor: BLUE_DARK } : undefined}
                    >
                      {s.n}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        isActive
                          ? 'font-bold border-b-2 pb-0.5'
                          : isCompleted
                            ? 'font-semibold text-[#434653]'
                            : 'text-[#737784]'
                      }`}
                      style={
                        isActive
                          ? { color: BLUE_DARK, borderColor: BLUE_DARK }
                          : undefined
                      }
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-20 h-0.5 mx-2 mt-[-14px] ${
                        isCompleted ? '' : 'bg-[#e5eeff]'
                      }`}
                      style={isCompleted ? { backgroundColor: BLUE_DARK } : undefined}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-[#e5eeff] p-4">
              <h2 className="text-base font-bold text-black mb-4">
                Shopping Cart ({items.length} Items)
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 ${idx < items.length - 1 ? 'pb-4 border-b border-[#e5eeff]' : ''}`}
                  >
                    <div className="w-14 h-14 bg-[#f8f9ff] rounded flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#737784] text-xs">
                          img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-black">{item.name}</p>
                          <p className="text-xs text-[#737784] mt-0.5">SKU: {item.sku}</p>
                        </div>
                        <span className="border border-[#c3c6d5] rounded px-1.5 py-0.5 text-xs text-[#434653] font-medium flex-shrink-0">
                          {item.origin}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 border border-[#c3c6d5] rounded-l flex items-center justify-center hover:bg-[#f8f9ff]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 h-7 border-t border-b border-[#c3c6d5] flex items-center justify-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 border border-[#c3c6d5] rounded-r flex items-center justify-center hover:bg-[#f8f9ff]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#737784]">Unit: ${item.unitPrice.toFixed(2)}</p>
                          <p className="text-sm font-bold" style={{ color: BLUE }}>
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#e5eeff] p-4">
              <h2 className="text-base font-bold text-black mb-4">Shipping Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#434653] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. John Kamau"
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                    />
                    <p className="text-xs text-[#737784] mt-1">As it appears on ID</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#434653] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                    />
                    <p className="text-xs text-[#737784] mt-1">For delivery updates</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#434653] mb-1">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street name, Building, Apartment"
                    className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#434653] mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#434653] mb-1">
                      Region/State
                    </label>
                    <select
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad] bg-white"
                    >
                      <option>Nairobi County</option>
                      <option>Mombasa County</option>
                      <option>Kisumu County</option>
                      <option>Nakuru County</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div className="space-y-4">
            <div
              className="rounded-lg border border-[#e5eeff] p-4 lg:sticky lg:top-20"
              style={{ backgroundColor: SECTION_BG }}
            >
              <h2 className="text-base font-bold text-black mb-3">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737784]">Items Subtotal</span>
                  <span className="text-sm font-medium text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737784]">International Shipping</span>
                  <span className="text-sm font-medium text-black">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737784]">Customs & Duties (Est.)</span>
                  <span className="text-sm font-medium text-[#1a7a4a]">${customs.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737784]">Insurance</span>
                  <span className="text-sm font-medium text-black">${insurance.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#c3c6d5] pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-black">Total</span>
                  <span className="text-lg font-bold" style={{ color: BLUE }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-white/80 rounded p-2.5 mb-3 text-xs text-[#737784]">
                <p className="font-semibold text-[#434653] uppercase tracking-wide text-xs mb-1">
                  LOCAL CURRENCY ESTIMATES
                </p>
                <p>KES {(total * 135).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                <p>AED {(total * 3.67).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>

              <div className="rounded-lg p-2.5 mb-3 border border-[#b0c6ff] bg-white/80">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BLUE }} />
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: BLUE }}>
                      Sourcing Guarantee
                    </p>
                    <p className="text-xs text-[#434653]">
                      Quality inspection and safe delivery guaranteed for all CN-AE-KE routes.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(Math.min(3, step + 1))}
                className="w-full text-white py-2.5 rounded font-bold text-xs hover:opacity-90"
                style={{ backgroundColor: BLUE_DARK }}
              >
                Proceed to Payment
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <svg
                  className="w-3.5 h-3.5 text-[#737784]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-xs text-[#737784]">Secure 256-bit SSL encrypted checkout</p>
              </div>
              
            </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
