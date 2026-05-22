'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Shield, ShoppingBag } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/hooks/use-cart';
import { useCheckoutCompleteMutation, useCheckoutShippingMutation } from '@/lib/api/hooks';
import type { CheckoutSummary } from '@/lib/contracts';
import { formatPrice } from '@/lib/currency';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const SECTION_BG = '#eff4ff';

export default function CheckoutPage() {
  const { items, updateQuantity, ready, isPending } = useCart();
  const shippingMutation = useCheckoutShippingMutation();
  const completeMutation = useCheckoutCompleteMutation();
  const [step, setStep] = useState(1);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    region: 'Nairobi County',
  });

  const hasItems = items.length > 0;
  const subtotal = summary?.subtotal ?? items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = summary?.shipping ?? 0;
  const customs = summary?.customs ?? 0;
  const insurance = summary?.insurance ?? 0;
  const total = summary?.total ?? subtotal + shipping + customs + insurance;

  const steps = [
    { n: 1, label: 'Shipping Info' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Review' },
  ];

  if (ready && !hasItems) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader searchPlaceholder="Search orders..." />
        <main className="flex-1 bg-[#f8f9ff] flex items-center justify-center px-6 py-16">
          <div className="max-w-md text-center bg-white border border-[#e5eeff] rounded-lg p-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#737784]" />
            <h1 className="text-xl font-bold text-black mb-2">Your cart is empty</h1>
            <p className="text-sm text-[#737784] mb-6">
              Add products from the marketplace before checkout. Sign in to save items to your
              account cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/marketplace"
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: BLUE_DARK }}
              >
                Browse marketplace
              </Link>
              <Link
                href="/auth/login"
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

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
                            —
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">{item.name}</p>
                        <p className="text-xs text-[#737784]">
                          SKU: {item.sku} · Origin: {item.origin}
                        </p>
                        <p className="text-sm font-bold mt-1" style={{ color: BLUE }}>
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 border border-[#c3c6d5] rounded flex items-center justify-center"
                          disabled={isPending}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 border border-[#c3c6d5] rounded flex items-center justify-center"
                          disabled={isPending}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {step >= 1 && (
                <div className="bg-white rounded-lg border border-[#e5eeff] p-4">
                  <h2 className="text-base font-bold text-black mb-4">Shipping Information</h2>
                  <div className="space-y-4">
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
              )}

              {step >= 2 && (
                <div className="bg-white rounded-lg border border-[#e5eeff] p-4">
                  <h2 className="text-base font-bold text-black mb-2">Payment</h2>
                  <p className="text-sm text-[#737784]">
                    Payment method selection will be completed in the next step. Totals are from
                    your cart on the server.
                  </p>
                </div>
              )}
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
                    <span className="text-sm font-medium text-black">{formatPrice(subtotal)}</span>
                  </div>
                  {summary ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#737784]">International Shipping</span>
                        <span className="text-sm font-medium text-black">
                          {formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#737784]">Customs & Duties (Est.)</span>
                        <span className="text-sm font-medium text-[#1a7a4a]">
                          {formatPrice(customs)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#737784]">Insurance</span>
                        <span className="text-sm font-medium text-black">
                          {formatPrice(insurance)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-[#737784]">
                      Shipping fees calculated after you enter shipping details.
                    </p>
                  )}
                  <div className="border-t border-[#c3c6d5] pt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-black">Total</span>
                    <span className="text-lg font-bold" style={{ color: BLUE }}>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg p-2.5 mb-3 border border-[#b0c6ff] bg-white/80">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BLUE }} />
                    <div>
                      <p className="text-xs font-bold mb-0.5" style={{ color: BLUE }}>
                        Sourcing Guarantee
                      </p>
                      <p className="text-xs text-[#434653]">
                        Quality inspection and safe delivery guaranteed for CN-AE-KE routes.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!ready || shippingMutation.isPending || completeMutation.isPending}
                  onClick={async () => {
                    if (step === 1) {
                      if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
                        return;
                      }
                      try {
                        const res = await shippingMutation.mutateAsync({
                          full_name: form.fullName,
                          phone: form.phone,
                          address: form.address,
                          city: form.city,
                          region: form.region,
                        });
                        setCheckoutId(res.checkout_id);
                        setSummary(res.summary);
                        setStep(2);
                      } catch {
                        return;
                      }
                      return;
                    }
                    if (step === 2) {
                      setStep(3);
                      return;
                    }
                    if (step === 3 && checkoutId) {
                      try {
                        await completeMutation.mutateAsync({
                          checkout_id: checkoutId,
                          payment_method: 'card',
                        });
                      } catch {
                        return;
                      }
                    }
                  }}
                  className="w-full text-white py-2.5 rounded font-bold text-xs hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: BLUE_DARK }}
                >
                  {step === 3
                    ? completeMutation.isPending
                      ? 'Placing order…'
                      : 'Place Order'
                    : step === 1 && shippingMutation.isPending
                      ? 'Calculating…'
                      : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
