'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CART_CHANGE_EVENT,
  addCartItem,
  getCartItems,
  setCartItems,
  type CartItem,
} from '@/lib/cart-storage';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(getCartItems());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(CART_CHANGE_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [refresh]);

  const itemCount = ready ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  const updateQuantity = useCallback((id: string, delta: number) => {
    const next = getCartItems().map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
    );
    setCartItems(next);
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems(getCartItems().filter((i) => i.id !== id));
  }, []);

  const replaceItems = useCallback((next: CartItem[]) => {
    setCartItems(next);
  }, []);

  return {
    ready,
    items,
    itemCount,
    addItem: addCartItem,
    updateQuantity,
    removeItem,
    replaceItems,
  };
}
