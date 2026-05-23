'use client';

import Link from 'next/link';
import { CheckoutMessageLayout } from '@/components/cart/checkout-message-layout';

const BLUE_DARK = '#00357f';

export interface OrderSuccessStateProps {
  orderNumber: string;
  email: string;
}

export function OrderSuccessState({ orderNumber, email }: OrderSuccessStateProps) {
  return (
    <CheckoutMessageLayout>
      <h1 className="text-xl font-bold text-black mb-2">Thank you for your order</h1>
      <p className="text-sm text-[#737784] mb-2">
        Order <span className="font-bold text-black">#{orderNumber}</span>
      </p>
      <p className="text-sm text-[#737784] mb-6">
        A confirmation email will be sent to <span className="font-medium text-black">{email}</span>{' '}
        shortly.
      </p>
      <Link
        href="/marketplace"
        className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold text-white"
        style={{ backgroundColor: BLUE_DARK }}
      >
        Continue shopping
      </Link>
    </CheckoutMessageLayout>
  );
}
