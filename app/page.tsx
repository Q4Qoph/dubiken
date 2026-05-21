'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Package, Truck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#e2e8f0] px-8 py-4 flex items-center justify-between">
        <span className="text-[#1a2d5a] font-bold text-xl tracking-tight">Dubiken</span>
        <nav className="flex gap-6 text-sm text-[#718096]">
          <a href="#" className="hover:text-[#1a2d5a] transition-colors">Help Center</a>
          <a href="#" className="hover:text-[#1a2d5a] transition-colors">Safety &amp; Security</a>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* Left panel */}
        <div
          className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
          style={{ background: 'linear-gradient(145deg, #0f1e45 0%, #1a3a7a 50%, #1e4b9e 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.07]">
            <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="400" cy="250" rx="380" ry="230" stroke="white" strokeWidth="0.8" fill="none"/>
              <ellipse cx="400" cy="250" rx="280" ry="230" stroke="white" strokeWidth="0.8" fill="none"/>
              <ellipse cx="400" cy="250" rx="380" ry="120" stroke="white" strokeWidth="0.8" fill="none"/>
              <line x1="20" y1="250" x2="780" y2="250" stroke="white" strokeWidth="0.8"/>
              <line x1="400" y1="20" x2="400" y2="480" stroke="white" strokeWidth="0.8"/>
              {[...Array(8)].map((_, i) => (
                <line key={i} x1="20" y1={80 + i * 45} x2="780" y2={80 + i * 45} stroke="white" strokeWidth="0.4"/>
              ))}
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 text-white/90 text-sm mb-8">
              <Globe className="w-4 h-4" />
              Direct Sourcing Ecosystem
            </div>
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              Connecting Kenya,<br />Dubai &amp; China
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              Streamline your global trade with our integrated B2B sourcing platform. From Mombasa to Guangzhou, manage logistics and payments in one place.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="border border-white/20 rounded-xl p-5 bg-white/5 backdrop-blur-sm">
              <Package className="w-6 h-6 text-white/80 mb-3" />
              <h3 className="text-white font-semibold mb-1">Direct Supply</h3>
              <p className="text-white/60 text-sm">Verified manufacturers and suppliers from key hubs.</p>
            </div>
            <div className="border border-white/20 rounded-xl p-5 bg-white/5 backdrop-blur-sm">
              <Truck className="w-6 h-6 text-white/80 mb-3" />
              <h3 className="text-white font-semibold mb-1">Live Tracking</h3>
              <p className="text-white/60 text-sm">End-to-end logistics visibility for every shipment.</p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#1a2d5a] mb-1">Welcome back</h2>
            <p className="text-[#718096] mb-8">Log in to manage your global sourcing orders.</p>

            <div className="grid grid-cols-2 border border-[#e2e8f0] rounded-lg p-1 mb-8 bg-[#f7f9fc]">
              <button
                onClick={() => setTab('login')}
                className={`py-2.5 rounded-md text-sm font-medium transition-all ${tab === 'login' ? 'bg-white text-[#1a2d5a] shadow-sm' : 'text-[#718096] hover:text-[#1a2d5a]'}`}
              >
                Login
              </button>
              <button
                onClick={() => setTab('register')}
                className={`py-2.5 rounded-md text-sm font-medium transition-all ${tab === 'register' ? 'bg-white text-[#1a2d5a] shadow-sm' : 'text-[#718096] hover:text-[#1a2d5a]'}`}
              >
                Register
              </button>
            </div>

            <form className="space-y-5">
              {tab === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Company Name</label>
                  <input type="text" placeholder="Your company name" className="w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Email Address</label>
                <input type="email" placeholder="name@company.com" className="w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Password</label>
                <div className="relative">
                  <input type="password" placeholder="••••••••" className="w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a7a]/30 focus:border-[#1a3a7a] transition-all pr-20" />
                  {tab === 'login' && (
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a3a7a] text-sm font-medium hover:underline">
                      Forgot?
                    </button>
                  )}
                </div>
              </div>

              <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-[#1a2d5a] hover:bg-[#1a3a7a] text-white rounded-lg py-3 text-sm font-semibold transition-colors mt-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <div className="relative flex justify-center">
                <span className="text-xs uppercase text-[#a0aec0] bg-white px-4">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-[#e2e8f0] rounded-lg py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f7f9fc] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-[#e2e8f0] rounded-lg py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f7f9fc] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0077B5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>

            <p className="text-center text-xs text-[#a0aec0] mt-6">
              By continuing, you agree to Dubiken's{' '}
              <a href="#" className="text-[#1a3a7a] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-[#1a3a7a] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-[#e2e8f0] py-4 px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#a0aec0]">
        <span>© 2024 Dubiken Global. All rights reserved.</span>
        <nav className="flex gap-5">
          {['Sourcing Guide', 'Shipping Policy', 'Tracking', 'Contact Support'].map(l => (
            <a key={l} href="#" className="hover:text-[#1a2d5a] transition-colors">{l}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
