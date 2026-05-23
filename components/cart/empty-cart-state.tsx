'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { CheckoutMessageLayout } from '@/components/cart/checkout-message-layout';
import { useIsLoggedIn } from '@/hooks/use-cart';

const BLUE = '#004aad';
const BLUE_DARK = '#00357f';

export function EmptyCartState() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <CheckoutMessageLayout>
      <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#737784]" />
      <h1 className="text-xl font-bold text-black mb-2">Your cart is empty</h1>
      <p className="text-sm text-[#737784] mb-6">
        Looks like you haven&apos;t added anything yet.
      </p>
      <Link
        href="/marketplace"
        className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold text-white"
        style={{ backgroundColor: BLUE_DARK }}
      >
        Continue shopping
      </Link>
      {!isLoggedIn ? (
        <p className="text-sm text-[#737784] mt-6">
          Have an account?{' '}
          <Link href="/auth/login?redirect=/checkout" className="font-semibold hover:underline" style={{ color: BLUE }}>
            Sign in
          </Link>
        </p>
      ) : null}
    </CheckoutMessageLayout>
  );
}
