'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import {
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Check,
} from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import { getProductById, getRelatedProducts } from '@/lib/data';
import { useCart } from '@/hooks/use-cart';

const BLUE = '#004aad';
const SECTION_BG = '#eff4ff';
const ORANGE_SAVE = '#ff924d';

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

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#e5eeff] last:border-0">
      <span className="text-sm font-normal text-[#434653]">{label}</span>
      <span className="text-sm font-bold text-right" style={{ color: BLUE }}>
        {value}
      </span>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<
    Awaited<ReturnType<typeof getRelatedProducts>>
  >([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'logistics' | 'reviews'>('specs');
  const [shippingDest, setShippingDest] = useState<'mombasa' | 'jebel'>('mombasa');
  const { addItem } = useCart();

  useEffect(() => {
    getProductById(params.id).then((data) => {
      if (data) setProduct(data);
    });
    getRelatedProducts(params.id, 4).then(setRelatedProducts);
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center text-[#737784]">
          Loading product...
        </div>
      </div>
    );
  }

  const savePct = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;
  const images =
    product.images?.length > 0 ? product.images : [product.image_url].filter(Boolean);

  const techSpecs = [
    { label: 'Nominal AC Power', value: product.specs.nominalACPower },
    { label: 'Max Input Voltage', value: product.specs.maxInputVoltage },
    { label: 'Efficiency', value: product.specs.efficiency },
    { label: 'Cooling System', value: product.specs.coolingSystem },
  ].filter((s) => s.value);

  const buildSpecs = [
    { label: 'Protection Class', value: product.specs.protectionClass },
    { label: 'Weight', value: product.specs.weight },
    { label: 'Certification', value: product.specs.certification },
    { label: 'Warranty', value: product.specs.warranty },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-[#e5eeff] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-[#737784]">
            <Link href="/" className="hover:underline">
              Industrial Sourcing
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/" className="hover:underline">
              Energy Systems
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#434653]">Solar Inverters</span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <section className="bg-white py-8 lg:py-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <div>
              <div className="bg-[#f8f9ff] border border-[#e5eeff] rounded-lg h-[380px] lg:h-[420px] flex items-center justify-center mb-3 overflow-hidden">
                <img
                  src={images[activeImage] || product.image_url}
                  alt={product.name}
                  className="max-h-[90%] max-w-[90%] object-contain"
                />
              </div>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`w-[72px] h-[72px] rounded border-2 overflow-hidden bg-[#f8f9ff] flex-shrink-0 ${
                      activeImage === i ? 'border-[#004aad]' : 'border-[#c3c6d5]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-[#737784]">
                <span className="border border-[#c3c6d5] rounded px-2 py-0.5 font-medium text-[#434653]">
                  {product.origin} - Origin
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl lg:text-[1.75rem] font-bold leading-tight mb-5" style={{ color: BLUE }}>
                {product.name}
              </h1>

              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold" style={{ color: BLUE }}>
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-[#737784] line-through font-normal">
                      ${product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    {savePct && (
                      <span
                        className="text-xs font-bold text-white px-2 py-0.5 rounded"
                        style={{ backgroundColor: ORANGE_SAVE }}
                      >
                        SAVE {savePct}%
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-sm text-[#737784] mb-6">
                Approx. {product.currency_ke} / {product.currency_ae}
              </p>

              {/* Shipping — light blue box */}
              <div className="rounded-lg p-4 mb-5 border border-[#dce9ff]" style={{ backgroundColor: SECTION_BG }}>
                <p className="text-sm font-bold text-black mb-3">Shipping Destination</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingDest('mombasa')}
                    className={`relative flex items-start gap-2 border rounded p-3 text-left bg-white ${
                      shippingDest === 'mombasa' ? 'border-[#004aad] border-2' : 'border-[#c3c6d5]'
                    }`}
                  >
                    {shippingDest === 'mombasa' && (
                      <Check className="w-4 h-4 absolute top-2 right-2" style={{ color: BLUE }} />
                    )}
                    <div>
                      <p className="text-xs font-bold text-black">Mombasa, KE</p>
                      <p className="text-xs text-[#737784]">14-21 Days</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingDest('jebel')}
                    className={`relative flex items-start gap-2 border rounded p-3 text-left bg-white ${
                      shippingDest === 'jebel' ? 'border-[#004aad] border-2' : 'border-[#c3c6d5]'
                    }`}
                  >
                    {shippingDest === 'jebel' && (
                      <Check className="w-4 h-4 absolute top-2 right-2" style={{ color: BLUE }} />
                    )}
                    <div>
                      <p className="text-xs font-bold text-black">Jebel Ali, AE</p>
                      <p className="text-xs text-[#737784]">5-7 Days</p>
                    </div>
                  </button>
                </div>
              </div>

              <p className="text-sm font-medium text-black mb-2">Quantity</p>
              <div className="flex items-center mb-6 w-fit border border-[#c3c6d5] rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#f8f9ff] border-r border-[#c3c6d5]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-bold border-r border-[#c3c6d5]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#f8f9ff]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <Link
                  href="/checkout"
                  className="block w-full text-center py-3.5 rounded text-sm font-bold text-white uppercase tracking-wide hover:opacity-90"
                  style={{ backgroundColor: BLUE }}
                >
                  BUY NOW
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      sku: product.sku,
                      unitPrice: product.price,
                      origin: product.origin,
                      imageUrl: product.image_url,
                      quantity,
                    })
                  }
                  className="w-full py-3.5 rounded text-sm font-bold uppercase tracking-wide border-2 bg-white hover:bg-[#f8f9ff]"
                  style={{ borderColor: BLUE, color: BLUE }}
                >
                  ADD TO CART
                </button>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#e5eeff]">
                <div className="flex items-center gap-2 text-xs text-[#434653]">
                  <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: BLUE }} />
                  <span>Verified Manufacturer: Suzhou Solar-Tech Ltd.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#434653]">
                  <Truck className="w-4 h-4 shrink-0" style={{ color: BLUE }} />
                  <span>Full logistics &amp; customs clearing included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-t border-[#e5eeff] bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex border-b border-[#e5eeff]">
            {(
              [
                { id: 'specs' as const, label: 'Specifications' },
                { id: 'logistics' as const, label: 'Logistics Details' },
                { id: 'reviews' as const, label: 'Reviews (12)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-[#737784]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <h3 className="text-base font-bold text-black mb-4">Technical Performance</h3>
                  {techSpecs.map((s) => (
                    <SpecRow key={s.label} label={s.label} value={s.value!} />
                  ))}
                </div>
                <div>
                  <h3 className="text-base font-bold text-black mb-4">Build &amp; Compliance</h3>
                  {buildSpecs.map((s) => (
                    <SpecRow key={s.label} label={s.label} value={s.value!} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="py-10 text-sm text-[#434653]">
              <p>Lead time 14–21 days to Mombasa via sea freight. Customs clearance and last-mile delivery available.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="py-10 text-sm text-[#434653]">
              <p>12 verified buyer reviews for this SKU.</p>
            </div>
          )}
        </div>
      </section>

      {/* Commonly sourced together */}
      <section className="bg-white py-10 border-t border-[#e5eeff]">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-xl font-bold mb-6" style={{ color: BLUE }}>
            Commonly Sourced Together
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="border border-[#c3c6d5] rounded-lg overflow-hidden bg-white hover:border-[#004aad]"
              >
                <div className="bg-[#eff4ff] h-36 flex items-center justify-center p-2">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#dce9ff]" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-[#737784] mb-1">{item.origin} | Origin</p>
                  <p className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold" style={{ color: BLUE }}>
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner — light blue */}
      <section className="py-10" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold mb-3" style={{ color: BLUE }}>
            Don&apos;t see what you need?
          </h2>
          <p className="text-sm text-[#434653] leading-relaxed mb-6 max-w-xl">
            We source industrial components from verified manufacturers in China and the UAE at
            wholesale prices. Request a custom quote for your project.
          </p>
          <Link
            href="/admin/sourcing"
            className="inline-block px-5 py-2.5 rounded text-xs font-bold text-white uppercase tracking-wide bg-black hover:opacity-90"
          >
            REQUEST CUSTOM QUOTE
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
