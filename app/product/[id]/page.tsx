'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Truck, ChevronRight, Minus, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  original_price: number | null;
  origin: string;
  image_url: string;
  images: string[];
  specs: Record<string, string>;
  currency_ke: string;
  currency_ae: string;
  description: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  origin: string;
  image_url: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [shippingDest, setShippingDest] = useState<'mombasa' | 'jebel'>('mombasa');

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', params.id).maybeSingle();
      if (data) setProduct(data);
    }
    async function fetchRelated() {
      const { data } = await supabase.from('products').select('id, name, price, origin, image_url').neq('id', params.id).limit(4);
      if (data) setRelatedProducts(data);
    }
    fetchProduct();
    fetchRelated();
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading product...</div>
        </div>
      </div>
    );
  }

  const savePct = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null;
  const allImages = product.images?.length > 0 ? product.images : [product.image_url];

  const relatedFallback = [
    { id: '1', name: 'Tier-1 Monocrystalline Panel 550W', price: 165, origin: 'CN', image_url: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', name: 'LiFePO4 Storage Rack 10kWh', price: 2800, origin: 'CN', image_url: '' },
    { id: '3', name: 'Solar DC Cable 6mm² (100m Roll)', price: 85, origin: 'CN', image_url: 'https://images.pexels.com/photos/2881229/pexels-photo-2881229.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '4', name: 'Smart DC Power Optimizer 650W', price: 45, origin: 'CN', image_url: 'https://images.pexels.com/photos/3921320/pexels-photo-3921320.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const displayRelated = relatedProducts.length >= 4 ? relatedProducts : relatedFallback;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="#" className="hover:text-[#1a3a6b]">Industrial Sourcing</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="#" className="hover:text-[#1a3a6b]">Energy Systems</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700">Solar Inverters</span>
          </nav>
        </div>
      </div>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center mb-3">
                <img src={allImages[activeImage] || product.image_url} alt={product.name} className="max-h-full max-w-full object-contain p-4" />
              </div>
              <div className="flex gap-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded border-2 overflow-hidden transition-all ${activeImage === i ? 'border-[#1a3a6b]' : 'border-gray-200'}`}>
                    {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-600 font-medium">CN - Origin</span>
                <span className="text-xs text-gray-500">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-bold text-[#1a7a4a]">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">${product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    {savePct && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">SAVE {savePct}%</span>}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-5">Approx. {product.currency_ke} / {product.currency_ae}</p>

              <div className="border border-gray-200 rounded-lg p-4 mb-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Shipping Destination</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setShippingDest('mombasa')} className={`flex items-center gap-2 border rounded-md p-3 text-left transition-all ${shippingDest === 'mombasa' ? 'border-[#1a3a6b] bg-blue-50' : 'border-gray-200'}`}>
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Mombasa, KE</p>
                      <p className="text-xs text-gray-500">14-21 Days</p>
                    </div>
                  </button>
                  <button onClick={() => setShippingDest('jebel')} className={`flex items-center gap-2 border rounded-md p-3 text-left transition-all ${shippingDest === 'jebel' ? 'border-[#1a3a6b] bg-blue-50' : 'border-gray-200'}`}>
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Jebel Ali, AE</p>
                      <p className="text-xs text-gray-500">5-7 Days</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100">
                    <Minus className="w-3 h-3" />
                  </button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 h-9 border-t border-b border-gray-300 text-center text-sm font-medium focus:outline-none" />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <Link href="/checkout" className="w-full block text-center bg-[#1a3a6b] text-white py-3 rounded font-bold text-sm uppercase tracking-wide hover:bg-[#152d54]">
                  BUY NOW
                </Link>
                <button className="w-full border-2 border-gray-300 text-gray-800 py-3 rounded font-bold text-sm uppercase tracking-wide hover:border-gray-400">
                  ADD TO CART
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <span>Verified Manufacturer: Suzhou Solar-Tech Ltd.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>Full logistics & customs clearing included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border-b border-gray-200">
            {['specs', 'logistics', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab ? 'text-[#1a3a6b] border-[#1a3a6b]' : 'text-gray-500 border-transparent'}`}>
                {tab === 'specs' ? 'Specifications' : tab === 'logistics' ? 'Logistics Details' : 'Reviews (12)'}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && product.specs && (
            <div className="py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Technical Performance</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Nominal AC Power', value: product.specs.nominalACPower },
                      { label: 'Max Input Voltage', value: product.specs.maxInputVoltage },
                      { label: 'Efficiency', value: product.specs.efficiency },
                      { label: 'Cooling System', value: product.specs.coolingSystem },
                    ].map(({ label, value }) => value && (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Build & Compliance</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Protection Class', value: product.specs.protectionClass },
                      { label: 'Weight', value: product.specs.weight },
                      { label: 'Certification', value: product.specs.certification },
                      { label: 'Warranty', value: product.specs.warranty },
                    ].map(({ label, value }) => value && (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Commonly Sourced Together</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayRelated.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm group">
                <div className="bg-gray-100 h-32 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">CN | Origin</p>
                  <p className="text-xs font-medium text-gray-900 leading-tight mb-2">{item.name}</p>
                  <p className="text-sm font-bold text-[#1a3a6b]">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef2f7] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a6b] mb-3">Don&apos;t see what you need?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Our sourcing agents in Shenzhen and Dubai can find any industrial component at manufacturer prices. Request a custom quote today.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin" className="bg-gray-900 text-white px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wide">
                  REQUEST CUSTOM QUOTE
                </Link>
                <button className="border border-gray-400 text-gray-700 px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wide">
                  TALK TO AN AGENT
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center text-sm font-bold">JD</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Agent: James Ding</p>
                  <p className="text-xs text-gray-500">Shenzhen Sourcing Center</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                &quot;We recently helped a Nairobi energy firm source 200 custom inverters in under 14 days. Let us handle the complexity for you.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="simple" />
    </div>
  );
}
