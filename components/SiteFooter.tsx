import Link from 'next/link';
import { Globe, Share2 } from 'lucide-react';

const BLUE_BOLD = '#004aad';
const FOOTER_BG = '#dce9ff';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: FOOTER_BG }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="font-bold text-lg mb-4" style={{ color: BLUE_BOLD }}>
              Dubiken
            </p>
            <p className="text-sm font-normal text-black leading-relaxed">
              Certified electronics, perfumes, and spare parts imported through Dubai and China.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold mb-4" style={{ color: BLUE_BOLD }}>
              Company
            </h4>
            <ul className="space-y-2 text-sm font-normal text-black">
              <li>
                <Link href="#" className="hover:opacity-70">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-70">
                  Shopping help
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold mb-4" style={{ color: BLUE_BOLD }}>
              Logistics
            </h4>
            <ul className="space-y-2 text-sm font-normal text-black">
              <li>
                <Link href="#" className="hover:opacity-70">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-70">
                  Tracking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold mb-4" style={{ color: BLUE_BOLD }}>
              Support
            </h4>
            <ul className="space-y-2 text-sm font-normal text-black">
              <li>
                <Link href="#" className="hover:opacity-70">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-70">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#b0c6ff] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-normal text-black">
          <p>© {year} Dubiken Global. All rights reserved.</p>
          <div className="flex items-center gap-4 text-black">
            <button type="button" className="p-1.5 hover:opacity-70" aria-label="Language">
              <Globe className="w-5 h-5" />
            </button>
            <button type="button" className="p-1.5 hover:opacity-70" aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
