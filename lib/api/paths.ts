/** REST path templates — prefix with `API_BASE_URL` from config */

export const API_PATHS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  products: {
    byId: (id: string) => `/products/${id}`,
    related: (id: string) => `/products/${id}/related`,
  },
  home: '/home',
  marketplace: {
    products: '/marketplace/products',
  },
  categories: '/categories',
  cart: {
    root: '/cart',
    item: (lineId: string) => `/cart/items/${lineId}`,
    items: '/cart/items',
  },
  checkout: {
    shipping: '/checkout/shipping',
    complete: '/checkout/complete',
  },
  me: {
    sourcing: '/me/sourcing',
    sourcingRequest: (id: string) => `/me/sourcing/requests/${id}`,
    sourcingRequests: '/me/sourcing/requests',
    marketplaceOrders: '/me/orders/marketplace',
    shipments: '/me/shipments',
  },
  admin: {
    dashboard: '/admin/dashboard',
    analytics: '/admin/analytics',
    categories: '/admin/categories',
    category: (id: string) => `/admin/categories/${id}`,
    inventoryKpis: '/admin/inventory/kpis',
    inventory: '/admin/inventory',
    inventoryProduct: (id: string) => `/admin/inventory/products/${id}`,
    inventoryProducts: '/admin/inventory/products',
    sourcingRequests: '/admin/sourcing/requests',
    sourcingRequest: (id: string) => `/admin/sourcing/requests/${id}`,
    sourcingQuote: (id: string) => `/admin/sourcing/requests/${id}/quote`,
    orders: '/admin/orders',
  },
  shipments: {
    root: '/shipments',
    byTracking: (trackingId: string) => `/shipments/${trackingId}`,
  },
  uploads: {
    image: '/uploads/image',
    images: '/uploads/images',
  },
} as const;
