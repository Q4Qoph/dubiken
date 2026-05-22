'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, ImageIcon } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

/** Screenshot: red accent for labels (Sourcing Expertise, trend icon) */
const RED_ACCENT = '#c41e3a';
const BLUE = '#004aad';
const BLUE_DARK = '#00357f';
const SECTION_BG = '#eff4ff';
const categories = [
  {
    name: 'Electronics & Tech',
    description: 'Direct from Shenzhen & Dubai Tech Hubs',
    href: '/categories',
    image:
      'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
    className: 'md:row-span-2 md:col-start-1 md:row-start-1 min-h-[280px] md:min-h-[360px]',
  },
  {
    name: 'Fashion',
    description: 'Textiles & Finished Goods',
    href: '#',
    placeholder: true,
    className: 'md:col-start-2 md:row-start-1 min-h-[170px]',
  },
  {
    name: 'Machinery',
    description: 'Construction & Industrial',
    href: '#',
    image:
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
    className: 'md:col-start-3 md:row-start-1 min-h-[170px]',
  },
  {
    name: 'Home & Living',
    description: 'Furniture & Smart Home',
    href: '#',
    image:
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=900',
    className: 'md:col-span-2 md:col-start-2 md:row-start-2 min-h-[170px]',
  },
];

const trendingProducts = [
  {
    name: 'Elite Pro Wireless Headphones',
    price: '$129.00',
    localPrice: 'Ksh 18,500',
    minUnits: 'Min: 5 Units',
    market: 'CN',
    flag: '🇨🇳',
    href: '/marketplace',
    image:
      'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Modernist Chronograph',
    price: '$85.00',
    localPrice: 'AED 312.00',
    minUnits: 'Min: 10 Units',
    market: 'AE',
    flag: '🇦🇪',
    href: '/marketplace',
    image:
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'UV400 Tech Sunglasses',
    price: '$24.50',
    localPrice: 'Ksh 3,200',
    minUnits: 'Min: 50 Units',
    market: 'CN',
    flag: '🇨🇳',
    href: '/marketplace',
    image:
      'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'X-Series Health Smartwatch',
    price: '$195.00',
    localPrice: 'AED 716.00',
    minUnits: 'Min: 2 Units',
    market: 'AE',
    flag: '🇦🇪',
    href: '/marketplace',
    image:
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

function CategoryCard({
  name,
  description,
  href,
  image,
  placeholder,
  className,
}: (typeof categories)[0]) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-lg border border-[#c3c6d5] ${className}`}
    >
      {placeholder ? (
        <div className="absolute inset-0 bg-[#d1d5db] flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-[#737784]" strokeWidth={1.5} />
        </div>
      ) : (
        <>
          <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className="absolute bottom-0 left-0 p-4 z-10">
        <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
        <p className="text-sm font-normal text-white mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

function MarketTag({ market, flag }: { market: string; flag: string }) {
  return (
    <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white border border-black text-[10px] font-semibold text-[#0b1c30] px-2 py-0.5">
      <span>{flag}</span>
      {market}
    </span>
  );
}

/** Subtle grid pattern on CTA — not a color gradient */
function CtaPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.12] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
      }}
      aria-hidden
    />
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero — white bg | heading BOLD dark blue | button white text on blue */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#004aad] leading-[1.1] mb-6">
                Global Sourcing,
                <br />
                Simplified.
              </h1>
              <p className="text-lg font-normal text-[#434653] leading-relaxed mb-8 max-w-lg">
                Connect directly with vetted suppliers across Kenya, Dubai, and China.
                Transparent pricing, reliable logistics, one platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-bold text-white bg-[#004aad] hover:bg-[#00357f]"
                >
                  EXPLORE ALL MARKETS
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <button
                  type="button"
                  className="px-6 py-3 rounded text-sm font-bold border-2 border-[#004aad] bg-white text-[#004aad] hover:bg-[#f8f9ff]"
                >
                  HOW IT WORKS
                </button>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden h-[280px] sm:h-[340px] lg:h-[380px] border border-[#c3c6d5]">
              <img
                src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Shipping containers at port"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
                <svg viewBox="0 0 320 200" className="w-[70%] max-w-sm" aria-hidden>
                  {[40, 65, 50, 90, 70, 110, 85].map((h, i) => (
                    <rect key={i} x={30 + i * 38} y={160 - h} width={24} height={h} fill="#b0c6ff" rx="2" />
                  ))}
                  <polyline
                    points="30,120 68,95 106,110 144,70 182,85 220,55 258,65"
                    fill="none"
                    stroke="#004aad"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Expertise — tinted bg | label RED | title BOLD dark blue */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] mb-2"
                style={{ color: RED_ACCENT }}
              >
                SOURCING EXPERTISE
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#004aad]">Top Categories</h2>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#004aad] hover:underline shrink-0"
            >
              VIEW ALL
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending — white bg | title BOLD dark blue | product name+price BOLD dark blue */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#004aad] flex items-center gap-2.5 mb-10">
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" style={{ color: RED_ACCENT }} strokeWidth={2.5} />
            Trending Imports
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {trendingProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="flex flex-col rounded-lg overflow-hidden bg-white border border-[#c3c6d5] hover:border-[#004aad]"
              >
                <div className="relative bg-[#eff4ff] h-36 sm:h-[168px] flex items-center justify-center border-b border-[#c3c6d5]">
                  <MarketTag market={product.market} flag={product.flag} />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[78%] max-w-[78%] object-contain"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <h3 className="text-sm font-bold text-[#004aad] leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold text-[#004aad] mt-2">{product.price}</p>
                  <p className="text-sm font-normal text-[#434653]">{product.localPrice}</p>
                  <p className="text-xs font-normal text-[#737784] text-right mt-auto pt-3">
                    {product.minUnits}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — white wrapper | solid blue card | WHITE text | orange btn BOLD dark blue text */}
      <section className="bg-white py-10 sm:py-12 lg:py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <div
            className="relative rounded-lg overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-8 sm:px-12 py-10 sm:py-12 min-h-[220px]"
            style={{ backgroundColor: BLUE }}
          >
            <CtaPattern />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-base font-normal text-white leading-relaxed">
                Our expert sourcing team can find any product, machine, or component across
                our global network of verified vendors.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link
                href="/admin/sourcing"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 rounded text-sm font-bold bg-[#ff924d] text-[#004aad] hover:opacity-90 w-full sm:w-auto min-w-[220px]"
              >
                REQUEST SOURCING
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
