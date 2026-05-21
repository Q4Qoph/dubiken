import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  activeMarket?: string;
}

export default function Navbar({ cartCount = 0, activeMarket }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-[#1a3a6b] tracking-tight">
              Dubiken
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/?market=KE" className="text-sm font-medium text-gray-600 hover:text-[#1a3a6b]">Kenya</Link>
              <Link href="/?market=AE" className="text-sm font-medium text-gray-600 hover:text-[#1a3a6b]">Dubai</Link>
              <Link href="/?market=CN" className="text-sm font-medium text-gray-600 hover:text-[#1a3a6b]">China</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for products..."
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
              />
            </div>
            <Link href="/checkout" className="relative p-1.5 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/dashboard" className="p-1.5 hover:bg-gray-100 rounded-md">
              <User className="w-5 h-5 text-gray-700" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
