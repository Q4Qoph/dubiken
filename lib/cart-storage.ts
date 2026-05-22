/** Cart line shape used by checkout UI (data lives on the API). */
export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  origin: string;
  imageUrl: string;
}
