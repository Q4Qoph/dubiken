'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Shield } from 'lucide-react';
import { EmptyCartState } from '@/components/cart/empty-cart-state';
import { OrderSuccessState } from '@/components/cart/order-success-state';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/hooks/use-cart';
import {
  useCheckoutCompleteMutation,
  useCheckoutShippingMutation,
  useGuestCheckoutMutation,
} from '@/lib/api/hooks';
import type { CheckoutSummary } from '@/lib/contracts';
import { buildCheckoutSummaryKes } from '@/lib/checkout-summary';
import { clearGuestCart } from '@/lib/guest-cart';
import { KENYA_REGIONS } from '@/lib/contracts';
import { formatAmount, formatKshLabel } from '@/lib/currency';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const SECTION_BG = '#eff4ff';

function lineTotalKes(item: { unitPriceKes: number; quantity: number }) {
  return item.unitPriceKes * item.quantity;
}

export default function CheckoutPage() {
  const { items, updateQuantity, ready, isPending, isLoggedIn, clearCart } = useCart();
  const shippingMutation = useCheckoutShippingMutation();
  const completeMutation = useCheckoutCompleteMutation();
  const guestCheckoutMutation = useGuestCheckoutMutation();
  const [step, setStep] = useState(1);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nairobi',
    region: 'Nairobi County',
  });

  const hasItems = items.length > 0;
  const subtotalKes = useMemo(
    () => items.reduce((sum, i) => sum + lineTotalKes(i), 0),
    [items],
  );
  const displaySummary = summary ?? (subtotalKes > 0 ? buildCheckoutSummaryKes(subtotalKes) : null);
  const total = displaySummary?.total ?? subtotalKes;

  const steps = [
    { n: 1, label: 'Contact & shipping' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Review' },
  ];

  const contactValid =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    form.address.trim();

  if (ready && !hasItems && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader searchPlaceholder="Search orders..." />
        <EmptyCartState />
        <SiteFooter />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader />
        <OrderSuccessState orderNumber={orderPlaced} email={form.email} />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader searchPlaceholder="Search orders..." />

      <main className="flex-1 bg-[#f8f9ff]">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <p className="text-sm text-[#737784] mb-4">
            {isLoggedIn
              ? 'Signed in — your cart is saved to your account.'
              : 'Guest checkout — enter your contact details so we can reach you about your order.'}
          </p>

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
                        isActive ? { color: BLUE_DARK, borderColor: BLUE_DARK } : undefined
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
                          {formatKshLabel(lineTotalKes(item))}
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
                  <h2 className="text-base font-bold text-black mb-1">Your contact details</h2>
                  <p className="text-xs text-[#737784] mb-4">
                    Required so our team can confirm your order and arrange delivery.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#434653] mb-1">
                          Full name *
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
                          Phone *
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
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.co.ke"
                        className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#434653] mb-1">
                        Shipping address *
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Street, building, apartment"
                        className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#434653] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#434653] mb-1">
                          Region
                        </label>
                        <select
                          value={form.region}
                          onChange={(e) => setForm({ ...form, region: e.target.value })}
                          className="w-full px-3 py-2 border border-[#c3c6d5] rounded text-sm focus:outline-none focus:border-[#004aad] bg-white"
                        >
                          {KENYA_REGIONS.map((county) => (
                            <option key={county} value={county}>
                              {county}
                            </option>
                          ))}
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
                    Pay on invoice — our team will contact you at {form.phone} to arrange M-Pesa,
                    bank transfer, or card payment.
                  </p>
                </div>
              )}

              {step >= 3 && (
                <div className="bg-white rounded-lg border border-[#e5eeff] p-4">
                  <h2 className="text-base font-bold text-black mb-3">Review contact</h2>
                  <dl className="text-sm space-y-1 text-[#434653]">
                    <div>
                      <span className="text-[#737784]">Name: </span>
                      {form.fullName}
                    </div>
                    <div>
                      <span className="text-[#737784]">Phone: </span>
                      {form.phone}
                    </div>
                    <div>
                      <span className="text-[#737784]">Email: </span>
                      {form.email}
                    </div>
                    <div>
                      <span className="text-[#737784]">Address: </span>
                      {form.address}, {form.city}, {form.region}
                    </div>
                  </dl>
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
                    <span className="text-sm text-[#737784]">Product total</span>
                    <span className="text-lg font-bold" style={{ color: BLUE }}>
                      KSh {formatAmount(total)}
                    </span>
                  </div>
                  <p className="text-xs text-[#737784]">
                    Price is for products only. Our team will confirm any delivery costs when they
                    contact you.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    !ready ||
                    shippingMutation.isPending ||
                    completeMutation.isPending ||
                    guestCheckoutMutation.isPending
                  }
                  onClick={async () => {
                    if (step === 1) {
                      if (!contactValid) return;
                      const shippingPayload = {
                        full_name: form.fullName.trim(),
                        phone: form.phone.trim(),
                        email: form.email.trim(),
                        address: form.address.trim(),
                        city: form.city.trim(),
                        region: form.region,
                      };
                      if (isLoggedIn) {
                        try {
                          const res = await shippingMutation.mutateAsync(shippingPayload);
                          setCheckoutId(res.checkout_id);
                          setSummary(res.summary);
                        } catch {
                          return;
                        }
                      } else {
                        setSummary(buildCheckoutSummaryKes(subtotalKes));
                      }
                      setStep(2);
                      return;
                    }
                    if (step === 2) {
                      setStep(3);
                      return;
                    }
                    if (step === 3) {
                      const shippingPayload = {
                        full_name: form.fullName.trim(),
                        phone: form.phone.trim(),
                        email: form.email.trim(),
                        address: form.address.trim(),
                        city: form.city.trim(),
                        region: form.region,
                      };
                      try {
                        if (isLoggedIn && checkoutId) {
                          const res = await completeMutation.mutateAsync({
                            checkout_id: checkoutId,
                            payment_method: 'card',
                          });
                          setOrderPlaced(res.order_number);
                        } else {
                          const res = await guestCheckoutMutation.mutateAsync({
                            items: items.map((i) => ({
                              product_id: i.productId ?? i.id,
                              quantity: i.quantity,
                            })),
                            shipping: shippingPayload,
                            payment_method: 'card',
                          });
                          clearGuestCart();
                          clearCart();
                          setOrderPlaced(res.order_number);
                        }
                      } catch {
                        return;
                      }
                    }
                  }}
                  className="w-full text-white py-2.5 rounded font-bold text-xs hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: BLUE_DARK }}
                >
                  {step === 3
                    ? completeMutation.isPending || guestCheckoutMutation.isPending
                      ? 'Placing order…'
                      : 'Place order'
                    : step === 1 && shippingMutation.isPending
                      ? 'Saving…'
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
