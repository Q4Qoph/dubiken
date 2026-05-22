'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import * as api from './services';
import {
  createUserSourcingRequest,
  getAdminCategoryById,
  getAdminCategoryCards,
  getAdminDashboard,
  getAdminInventoryItems,
  getAdminInventoryKpis,
  getAdminInventoryProduct,
  getAdminAnalytics,
  getExploreCategories,
  getHomeFeed,
  listMyShipments,
  getMarketplaceProducts,
  getProductById,
  getRecentOrders,
  getRelatedProducts,
  getShipmentByTrackingId,
  getAdminMarketplaceOrders,
  getSourcingRequestById,
  getSourcingRequests,
  listShipments,
  getUserMarketplaceOrders,
  getUserSourcingDashboard,
  getUserSourcingRequestById,
  saveAdminCategory,
  saveAdminOfficialQuote,
  type AdminCategoryFormInput,
  type AdminOfficialQuoteInput,
  type CreateSourcingRequestInput,
  type SourcingRequestFilters,
} from '@/lib/data';
import type {
  CheckoutCompleteRequest,
  CheckoutShippingRequest,
  CreateInventoryProductRequest,
  LoginRequest,
  RegisterRequest,
} from '@/lib/contracts';
import { getAccessToken } from './client';
import { getAuthSession } from '@/lib/auth-session';

function requiresAuth(extra?: boolean): boolean {
  if (extra === false) return false;
  return !!getAccessToken();
}

// ——— Auth ———

export function useAuthMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => api.apiAuthMe(),
    enabled: requiresAuth(),
  });
}

export function useLoginMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => api.apiLogin(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['admin'] });
      qc.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useRegisterMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterRequest) => api.apiRegister(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.apiLogout(),
    onSuccess: () => qc.clear(),
  });
}

// ——— Catalog (public) ———

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useRelatedProducts(id: string, limit = 4) {
  return useQuery({
    queryKey: queryKeys.products.related(id, limit),
    queryFn: () => getRelatedProducts(id, limit),
    enabled: !!id,
  });
}

export function useMarketplaceProducts(hub?: string, category?: string) {
  const query: Record<string, string | number> = { page_size: 48 };
  if (hub && hub !== 'all') query.hub = hub;
  if (category) query.category = category;
  return useQuery({
    queryKey: queryKeys.marketplace.products(query),
    queryFn: () => getMarketplaceProducts(hub, category),
  });
}

export function useExploreCategories(page = 1, pageSize = 12) {
  return useQuery({
    queryKey: queryKeys.categories.explore(page, pageSize),
    queryFn: () => getExploreCategories(page, pageSize),
  });
}

/** Home page: public feed from API */
export function useHomePageData() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: getHomeFeed,
    staleTime: 60_000,
  });
}

/** Logged-in user from session + optional refresh from /auth/me */
export function useCurrentUser() {
  const sessionQuery = useQuery({
    queryKey: ['auth', 'session-user'],
    queryFn: async () => {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('dubiken_session');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { loggedIn?: boolean; user?: import('@/lib/contracts').AuthUser };
      return parsed.loggedIn ? parsed.user ?? null : null;
    },
  });

  const meQuery = useAuthMe();

  const session = typeof window !== 'undefined' ? getAuthSession() : null;
  const user = meQuery.data ?? sessionQuery.data ?? session?.user ?? null;
  const isLoggedIn = !!(session?.loggedIn && (session.access_token || user));

  return {
    user,
    isLoggedIn,
    isLoading: meQuery.isLoading,
    displayName: user?.name ?? 'Account',
    company: user?.company ?? '',
    role: user?.role,
    dashboardHref: user?.role === 'admin' ? '/admin' : '/dashboard',
    initials: (user?.name ?? 'U')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  };
}

// ——— Cart & checkout ———

const emptyCart = { items: [] as import('@/lib/contracts').CartItemDto[], item_count: 0, subtotal: 0 };

export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => api.apiGetCart(),
    enabled: requiresAuth(),
    placeholderData: emptyCart,
  });
}

export function useAddCartItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ product_id, quantity }: { product_id: string; quantity: number }) =>
      api.apiAddCartItem(product_id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export function useUpdateCartItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      api.apiUpdateCartItem(lineId, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export function useRemoveCartItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lineId: string) => api.apiRemoveCartItem(lineId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export function useCheckoutShippingMutation() {
  return useMutation({
    mutationFn: (body: CheckoutShippingRequest) => api.apiCheckoutShipping(body),
  });
}

export function useCheckoutCompleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CheckoutCompleteRequest) => api.apiCheckoutComplete(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      qc.invalidateQueries({ queryKey: queryKeys.me.marketplaceOrders });
      qc.invalidateQueries({ queryKey: queryKeys.admin.orders });
    },
  });
}

// ——— User sourcing & orders ———

export function useUserSourcingDashboard() {
  return useQuery({
    queryKey: queryKeys.me.sourcing,
    queryFn: getUserSourcingDashboard,
    enabled: requiresAuth(),
  });
}

export function useUserSourcingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.me.sourcingDetail(id),
    queryFn: () => getUserSourcingRequestById(id),
    enabled: requiresAuth(!!id),
  });
}

export function useCreateSourcingRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSourcingRequestInput) => createUserSourcingRequest(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me.sourcing }),
  });
}

export function useUserMarketplaceOrders() {
  return useQuery({
    queryKey: queryKeys.me.marketplaceOrders,
    queryFn: getUserMarketplaceOrders,
    enabled: requiresAuth(),
  });
}

// ——— Admin ———

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: getAdminDashboard,
    enabled: requiresAuth(),
  });
}

export function useAdminSourcingRequests(filters: SourcingRequestFilters = {}) {
  return useQuery({
    queryKey: queryKeys.admin.sourcing(filters),
    queryFn: () => getSourcingRequests(filters),
    enabled: requiresAuth(),
  });
}

export function useAdminSourcingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.sourcingDetail(id),
    queryFn: () => getSourcingRequestById(id),
    enabled: requiresAuth(!!id),
  });
}

export function useSaveOfficialQuoteMutation(requestId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminOfficialQuoteInput) => saveAdminOfficialQuote(requestId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.sourcingDetail(requestId) });
      qc.invalidateQueries({ queryKey: ['admin', 'sourcing'] });
      qc.invalidateQueries({ queryKey: queryKeys.me.sourcing });
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: getAdminCategoryCards,
    enabled: requiresAuth(),
  });
}

export function useAdminCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.category(id),
    queryFn: () => getAdminCategoryById(id),
    enabled: requiresAuth(!!id),
  });
}

export function useSaveAdminCategoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminCategoryFormInput) => saveAdminCategory(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.categories });
      qc.invalidateQueries({ queryKey: queryKeys.categories.explore });
    },
  });
}

export function useAdminInventory(search?: string) {
  const query = search ? { search, page_size: 100 } : { page_size: 100 };
  return useQuery({
    queryKey: queryKeys.admin.inventory(query),
    queryFn: () => getAdminInventoryItems(search),
    enabled: requiresAuth(),
  });
}

export function useAdminInventoryProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.inventoryProduct(id),
    queryFn: () => getAdminInventoryProduct(id),
    enabled: requiresAuth(!!id),
  });
}

export function useAdminInventoryKpis() {
  return useQuery({
    queryKey: queryKeys.admin.inventoryKpis,
    queryFn: getAdminInventoryKpis,
    enabled: requiresAuth(),
  });
}

export function useCreateInventoryProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInventoryProductRequest) => api.apiCreateInventoryProduct(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      qc.invalidateQueries({ queryKey: queryKeys.admin.inventoryKpis });
      qc.invalidateQueries({ queryKey: queryKeys.marketplace.products() });
      qc.invalidateQueries({ queryKey: queryKeys.categories.explore });
    },
  });
}

export function useUpdateInventoryProductMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<CreateInventoryProductRequest>) =>
      api.apiUpdateInventoryProduct(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      qc.invalidateQueries({ queryKey: queryKeys.admin.inventoryKpis });
      qc.invalidateQueries({ queryKey: queryKeys.admin.inventoryProduct(id) });
      qc.invalidateQueries({ queryKey: queryKeys.marketplace.products() });
      qc.invalidateQueries({ queryKey: queryKeys.home });
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    },
  });
}

export function useAdminMarketplaceOrders() {
  return useQuery({
    queryKey: queryKeys.admin.orders,
    queryFn: getAdminMarketplaceOrders,
    enabled: requiresAuth(),
  });
}

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: (file: File) => api.apiUploadImage(file),
  });
}

// ——— Shipments & dashboard ———

export function useShipment(trackingId: string) {
  return useQuery({
    queryKey: queryKeys.shipments.byTracking(trackingId),
    queryFn: () => getShipmentByTrackingId(trackingId),
    enabled: !!trackingId.trim(),
  });
}

export function useShipments() {
  return useQuery({
    queryKey: ['shipments', 'list'] as const,
    queryFn: listShipments,
    enabled: requiresAuth(),
  });
}

export function useMyShipments() {
  return useQuery({
    queryKey: queryKeys.me.shipments,
    queryFn: listMyShipments,
    enabled: requiresAuth(),
  });
}

export function useAdminAnalyticsDetail() {
  return useQuery({
    queryKey: queryKeys.admin.analytics,
    queryFn: getAdminAnalytics,
    enabled: requiresAuth(),
  });
}

export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentOrders(limit),
    queryFn: () => getRecentOrders(limit),
    enabled: requiresAuth(),
  });
}

/** Admin analytics: dashboard KPIs + inventory KPIs + charts */
export function useAdminAnalytics() {
  const dashboard = useAdminDashboard();
  const inventoryKpis = useAdminInventoryKpis();
  const charts = useAdminAnalyticsDetail();
  return {
    dashboard: dashboard.data,
    inventoryKpis: inventoryKpis.data,
    charts: charts.data,
    isLoading: dashboard.isLoading || inventoryKpis.isLoading || charts.isLoading,
  };
}
