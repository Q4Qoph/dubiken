'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/lib/cart-storage';
import { getAccessToken } from '@/lib/api/client';

export type AddItemInput = Omit<CartItem, 'quantity'> & { quantity?: number };

export type AddItemOptions = {
  /** Skip success toast (e.g. Buy now flow). */
  silent?: boolean;
  /** Navigate to checkout after add — handled by usePromptedCart. */
  buyNow?: boolean;
};

function readInitialGuestLines(): GuestCartLine[] {
  if (typeof window === 'undefined') return [];
  if (getAccessToken()) return [];
  return loadGuestCart();
}
import {
  useAddCartItemMutation,
  useCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/lib/api/hooks';
import {
  addGuestCartLine,
  clearGuestCart,
  loadGuestCart,
  removeGuestCartLine,
  updateGuestCartQuantity,
  type GuestCartLine,
} from '@/lib/guest-cart';
import { useMounted } from '@/hooks/use-mounted';
import { toast } from 'sonner';

function mapApiCart(
  items:
    | {
        id: string;
        product_id: string;
        name: string;
        sku: string;
        quantity: number;
        unit_price: number;
        unit_price_kes: number;
        origin: string;
        image_url: string;
      }[]
    | undefined
    | null,
): CartItem[] {
  return (items ?? []).map((i) => ({
    id: i.id,
    productId: i.product_id,
    name: i.name,
    sku: i.sku,
    quantity: i.quantity,
    unitPrice: i.unit_price,
    unitPriceKes: i.unit_price_kes,
    origin: i.origin,
    imageUrl: i.image_url,
  }));
}

function mapGuestCart(items: GuestCartLine[]): CartItem[] {
  return items.map((i) => ({
    id: i.id,
    productId: i.productId,
    name: i.name,
    sku: i.sku,
    quantity: i.quantity,
    unitPrice: 0,
    unitPriceKes: i.unitPriceKes,
    origin: i.origin,
    imageUrl: i.imageUrl,
  }));
}

export function useIsLoggedIn(): boolean {
  const mounted = useMounted();
  return mounted && !!getAccessToken();
}

export function useCart() {
  const isLoggedIn = useIsLoggedIn();
  const { data: apiCart, isLoading, isFetching } = useCartQuery();
  const addMutation = useAddCartItemMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const [guestLines, setGuestLines] = useState<GuestCartLine[]>(readInitialGuestLines);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      setGuestLines(loadGuestCart());
    }
  }, [mounted, isLoggedIn]);

  const items = useMemo(
    () => (isLoggedIn ? mapApiCart(apiCart?.items) : mapGuestCart(guestLines)),
    [isLoggedIn, apiCart?.items, guestLines],
  );

  const itemCount = useMemo(
    () =>
      isLoggedIn
        ? (apiCart?.item_count ?? 0)
        : guestLines.reduce((s, i) => s + i.quantity, 0),
    [isLoggedIn, apiCart?.item_count, guestLines],
  );

  const ready = isLoggedIn ? !isLoading : mounted;

  const addItemAsync = useCallback(
    (item: AddItemInput, options?: AddItemOptions): Promise<void> => {
      const qty = item.quantity ?? 1;
      const productId = item.productId ?? item.id;
      const description =
        qty > 1 ? `${item.name} · qty ${qty}` : item.name;

      if (isLoggedIn) {
        return new Promise((resolve, reject) => {
          addMutation.mutate(
            { product_id: productId, quantity: qty },
            {
              onSuccess: () => {
                if (!options?.silent) {
                  toast.success('Added to cart', { description });
                }
                resolve();
              },
              onError: () => {
                toast.error('Could not add to cart', {
                  description: 'Please try again.',
                });
                reject(new Error('add_failed'));
              },
            },
          );
        });
      }

      const unitPriceKes = item.unitPriceKes ?? 0;
      setGuestLines(
        addGuestCartLine({
          productId,
          name: item.name,
          sku: item.sku,
          unitPriceKes,
          origin: item.origin,
          imageUrl: item.imageUrl,
          quantity: qty,
        }),
      );
      if (!options?.silent) {
        toast.success('Added to cart', { description });
      }
      return Promise.resolve();
    },
    [isLoggedIn, addMutation],
  );

  const addItem = useCallback(
    (item: AddItemInput) => {
      void addItemAsync(item);
    },
    [addItemAsync],
  );

  const updateQuantity = useCallback(
    (id: string, delta: number) => {
      const line = items.find((i) => i.id === id);
      if (!line) return;
      const nextQty = Math.max(1, line.quantity + delta);
      if (isLoggedIn) {
        updateMutation.mutate({ lineId: id, quantity: nextQty });
        return;
      }
      setGuestLines(updateGuestCartQuantity(id, nextQty));
    },
    [items, isLoggedIn, updateMutation],
  );

  const removeItem = useCallback(
    (id: string) => {
      if (isLoggedIn) {
        removeMutation.mutate(id);
        return;
      }
      setGuestLines(removeGuestCartLine(id));
    },
    [isLoggedIn, removeMutation],
  );

  const clearCart = useCallback(() => {
    if (!isLoggedIn) {
      clearGuestCart();
      setGuestLines([]);
    }
  }, [isLoggedIn]);

  return {
    ready,
    isLoggedIn,
    items,
    itemCount,
    addItem,
    addItemAsync,
    updateQuantity,
    removeItem,
    clearCart,
    isPending:
      isFetching ||
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending,
  };
}
