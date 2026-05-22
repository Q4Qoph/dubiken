'use client';

import { useCallback, useMemo } from 'react';
import type { CartItem } from '@/lib/cart-storage';
import {
  useAddCartItemMutation,
  useCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/lib/api/hooks';

function mapApiCart(
  items:
    | {
        id: string;
        product_id: string;
        name: string;
        sku: string;
        quantity: number;
        unit_price: number;
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
    origin: i.origin,
    imageUrl: i.image_url,
  }));
}

export function useCart() {
  const { data: apiCart, isLoading, isFetching } = useCartQuery();
  const addMutation = useAddCartItemMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  const items = useMemo(() => mapApiCart(apiCart?.items), [apiCart?.items]);

  const itemCount = apiCart?.item_count ?? 0;
  const ready = !isLoading;

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      const productId = item.productId ?? item.id;
      addMutation.mutate({ product_id: productId, quantity: qty });
    },
    [addMutation],
  );

  const updateQuantity = useCallback(
    (id: string, delta: number) => {
      const line = items.find((i) => i.id === id);
      if (!line) return;
      const nextQty = Math.max(1, line.quantity + delta);
      updateMutation.mutate({ lineId: id, quantity: nextQty });
    },
    [items, updateMutation],
  );

  const removeItem = useCallback(
    (id: string) => {
      removeMutation.mutate(id);
    },
    [removeMutation],
  );

  const replaceItems = useCallback(() => {
    /* server cart only */
  }, []);

  return {
    ready,
    items,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    replaceItems,
    isPending:
      isFetching ||
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending,
  };
}
