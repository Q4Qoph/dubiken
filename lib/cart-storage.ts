export const CART_CHANGE_EVENT = 'dubiken-cart-change';

const STORAGE_KEY = 'dubiken_cart';

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  origin: string;
  imageUrl: string;
}

const defaultCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Industrial Grade Smartwatch Pro X',
    sku: 'DU-98234-CN',
    quantity: 12,
    unitPrice: 45,
    origin: 'CN',
    imageUrl:
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: '2',
    name: 'Premium Oud Elixir 100ml',
    sku: 'DU-00122-AE',
    quantity: 2,
    unitPrice: 120,
    origin: 'AE',
    imageUrl: '',
  },
  {
    id: '3',
    name: 'Single-Origin Arabica Grade AA',
    sku: 'DU-55211-KE',
    quantity: 50,
    unitPrice: 12.5,
    origin: 'KE',
    imageUrl: '',
  },
];

function notifyCartChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCartItems));
      return [...defaultCartItems];
    }
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notifyCartChange();
}

export function addCartItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
  const qty = item.quantity ?? 1;
  const items = getCartItems();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    setCartItems(
      items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i)),
    );
  } else {
    setCartItems([...items, { ...item, quantity: qty }]);
  }
}

export function getCartItemCount(): number {
  return getCartItems().reduce((sum, i) => sum + i.quantity, 0);
}
