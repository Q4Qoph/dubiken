'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Shield, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  origin: string;
  imageUrl: string;
}

const initialItems: CartItem[] = [
  {
    id: '1',
    name: 'Industrial Grade Smartwatch Pro X',
    sku: 'DU-98234-CN',
    quantity: 12,
    unitPrice: 45,
    origin: 'CN',
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '2',
    name: 'Premium Oud Elixir 100ml',
    sku: 'DU-00122-AE',
    quantity: 2,
    unitPrice: 120,
    origin: 'AE',
    imageUrl: '',
  },
  {
    id: '3',
    name: 'Single-Origin Arabica Grade AA',
    sku: 'DU-55211-KE',
    quantity: 50,
    unitPrice: 12.5,
    origin: 'KE',
    imageUrl: '',
  },
];

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    region: 'Nairobi County',
  });

  function updateQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  }

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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-xl font-bold text-[#1a3a6b]">Dubiken</Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <span>Kenya</span>
              <span>Dubai</span>
              <span>China</span>
            </div>
            <div className="w-28" />
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-0">
            {steps.map((s, idx) => (
              <div key={s.n} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === s.n ? 'bg-[#1a3a6b] text-white' : step > s.n ? 'bg-[#1a3a6b] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s.n}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${step === s.n ? 'text-[#1a3a6b]' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-32 h-0.5 mx-2 mt-[-16px] ${step > s.n ? 'bg-[#1a3a6b]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Shopping Cart ({items.length} Items)</h2>
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={item.id} className={`flex gap-4 ${idx < items.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}>
                      <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                          </div>
                          <span className="border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-600 font-medium flex-shrink-0">
                            {item.origin}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-0">
                            <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-10 h-7 border-t border-b border-gray-300 flex items-center justify-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Unit: ${item.unitPrice.toFixed(2)}</p>
                            <p className="text-base font-bold text-gray-900">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Shipping Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. John Kamau" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]" />
                      <p className="text-xs text-gray-400 mt-1">As it appears on ID</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 700 000 000" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]" />
                      <p className="text-xs text-gray-400 mt-1">For delivery updates</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                    <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street name, Building, Apartment" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
                      <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] bg-white">
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

            <div className="space-y-5">
              <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Items Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">International Shipping</span>
                    <span className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customs & Duties (Est.)</span>
                    <span className="text-sm font-medium text-[#1a7a4a]">${customs.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Insurance</span>
                    <span className="text-sm font-medium text-gray-900">${insurance.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3 mb-4 text-xs text-gray-500">
                  <p className="font-semibold text-gray-600 uppercase tracking-wide text-xs mb-1">LOCAL CURRENCY ESTIMATES</p>
                  <p>KES {(total * 135).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  <p>AED {(total * 3.67).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-[#1a3a6b] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1a3a6b] mb-0.5">Sourcing Guarantee</p>
                      <p className="text-xs text-blue-700">Quality inspection and safe delivery guaranteed for all CN-AE-KE routes.</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep(Math.min(3, step + 1))} className="w-full bg-[#1a3a6b] text-white py-3 rounded font-bold text-sm hover:bg-[#152d54]">
                  Proceed to Payment
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <p className="text-xs text-gray-400">Secure 256-bit SSL encrypted checkout</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">LOGISTICS ESTIMATE</p>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Estimated Arrival</p>
                    <p className="text-xs text-gray-500">Oct 24 – Oct 29 (Air Freight)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#1a3a6b]">Dubiken</p>
              <p className="text-xs text-gray-500">© 2024 Dubiken Global. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-500">
              {['Sourcing Guide', 'Shipping Policy', 'Tracking', 'Contact Support'].map((l) => (
                <Link key={l} href="#" className="hover:text-[#1a3a6b]">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
