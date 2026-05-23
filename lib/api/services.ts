import { clearAuthSessionOnUnauthorized } from '@/lib/auth-session';
import { apiRequest, buildApiUrl, getAccessToken } from './client';
import { API_PATHS } from './paths';
import type {
  AdminCategoryDto,
  AdminInventoryKpisDto,
  AdminInventoryListItem,
  AdminSourcingRequestDetailDto,
  AdminSourcingRequestListItem,
  AuthTokensResponse,
  AuthUser,
  CartResponse,
  CheckoutCompleteRequest,
  CheckoutCompleteResponse,
  CheckoutShippingRequest,
  CheckoutShippingResponse,
  GuestCheckoutRequest,
  GuestCheckoutResponse,
  AdminInventoryProductDetail,
  CreateInventoryProductRequest,
  CreateSourcingRequestBody,
  ExploreCategoryDto,
  LoginRequest,
  MarketplaceProductDto,
  PaginatedResponse,
  ProductDetailDto,
  RelatedProductDto,
  RegisterRequest,
  UpdateCartItemRequest,
  UpsertCategoryRequest,
  UpsertOfficialQuoteRequest,
  UpsertOfficialQuoteResponse,
  AdminAnalyticsDto,
  UserSourcingDashboardResponse,
  UserSourcingRequestDetailDto,
  UserSourcingRequestListItem,
} from '@/lib/contracts';
import { normalizeTrackingId } from '@/lib/tracking-id';
import type {
  AdminDashboardKpis,
  DashboardSourcingRow,
  LogisticsPipelineCard,
  Shipment,
  AdminMarketplaceOrderRow,
  SourcingOrderRow,
  UserMarketplaceOrder,
  UserMarketplaceOrderDetail,
} from '@/lib/types';

function token() {
  return getAccessToken();
}

// ——— Auth ———

export async function apiLogin(body: LoginRequest): Promise<AuthTokensResponse> {
  return apiRequest<AuthTokensResponse>(API_PATHS.auth.login, {
    method: 'POST',
    body,
  });
}

export async function apiRegister(body: RegisterRequest): Promise<AuthTokensResponse> {
  return apiRequest<AuthTokensResponse>(API_PATHS.auth.register, {
    method: 'POST',
    body,
  });
}

export async function apiLogout(): Promise<void> {
  await apiRequest<void>(API_PATHS.auth.logout, {
    method: 'POST',
    token: token(),
  });
}

export async function apiAuthMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>(API_PATHS.auth.me, { token: token() });
}

// ——— Products & storefront ———

export async function apiGetProduct(id: string): Promise<ProductDetailDto | null> {
  try {
    return await apiRequest<ProductDetailDto>(API_PATHS.products.byId(id));
  } catch {
    return null;
  }
}

export async function apiGetRelatedProducts(id: string, limit = 4) {
  const res = await apiRequest<{ data: RelatedProductDto[] }>(
    API_PATHS.products.related(id),
    { query: { limit } },
  );
  return res.data;
}

export async function apiGetMarketplaceProducts(query?: Record<string, string | number>) {
  return apiRequest<PaginatedResponse<MarketplaceProductDto>>(
    API_PATHS.marketplace.products,
    { query },
  );
}

export async function apiGetCategories(query?: { page?: number; page_size?: number }) {
  return apiRequest<PaginatedResponse<ExploreCategoryDto>>(API_PATHS.categories, { query });
}

export async function apiGetAdminAnalytics(): Promise<AdminAnalyticsDto> {
  return apiRequest<AdminAnalyticsDto>(API_PATHS.admin.analytics, { token: token() });
}

export async function apiGetMyShipments(): Promise<Shipment[]> {
  const res = await apiRequest<{ data: Shipment[] }>(API_PATHS.me.shipments, {
    token: token(),
  });
  return res.data;
}

export async function apiGetHomeFeed() {
  return apiRequest<{
    categories: ExploreCategoryDto[];
    products: MarketplaceProductDto[];
    meta: { page: number; page_size: number; total: number };
  }>(API_PATHS.home);
}

// ——— Cart & checkout ———

export async function apiGetCart(): Promise<CartResponse> {
  return apiRequest<CartResponse>(API_PATHS.cart.root, { token: token() });
}

export async function apiAddCartItem(product_id: string, quantity: number) {
  return apiRequest<CartResponse>(API_PATHS.cart.items, {
    method: 'POST',
    body: { product_id, quantity },
    token: token(),
  });
}

export async function apiUpdateCartItem(lineId: string, body: UpdateCartItemRequest) {
  return apiRequest<CartResponse>(API_PATHS.cart.item(lineId), {
    method: 'PATCH',
    body,
    token: token(),
  });
}

export async function apiRemoveCartItem(lineId: string) {
  return apiRequest<CartResponse>(API_PATHS.cart.item(lineId), {
    method: 'DELETE',
    token: token(),
  });
}

export async function apiCheckoutShipping(body: CheckoutShippingRequest) {
  return apiRequest<CheckoutShippingResponse>(API_PATHS.checkout.shipping, {
    method: 'POST',
    body,
    token: token(),
  });
}

export async function apiCheckoutComplete(body: CheckoutCompleteRequest) {
  return apiRequest<CheckoutCompleteResponse>(API_PATHS.checkout.complete, {
    method: 'POST',
    body,
    token: token(),
  });
}

export async function apiGuestCheckout(body: GuestCheckoutRequest) {
  return apiRequest<GuestCheckoutResponse>(API_PATHS.checkout.guest, {
    method: 'POST',
    body,
  });
}

// ——— User sourcing & orders ———

export async function apiGetUserSourcingDashboard(): Promise<UserSourcingDashboardResponse> {
  return apiRequest<UserSourcingDashboardResponse>(API_PATHS.me.sourcing, {
    token: token(),
  });
}

export async function apiCreateSourcingRequest(
  body: CreateSourcingRequestBody,
): Promise<UserSourcingRequestListItem> {
  return apiRequest<UserSourcingRequestListItem>(API_PATHS.me.sourcingRequests, {
    method: 'POST',
    body,
    token: token(),
  });
}

export async function apiGetUserSourcingDetail(
  id: string,
): Promise<UserSourcingRequestDetailDto | null> {
  try {
    return await apiRequest<UserSourcingRequestDetailDto>(
      API_PATHS.me.sourcingRequest(id),
      { token: token() },
    );
  } catch {
    return null;
  }
}

export async function apiGetUserMarketplaceOrders(): Promise<UserMarketplaceOrder[]> {
  const res = await apiRequest<{ data: UserMarketplaceOrder[] }>(
    API_PATHS.me.marketplaceOrders,
    { token: token() },
  );
  return res.data;
}

export async function apiGetUserMarketplaceOrder(
  id: string,
): Promise<UserMarketplaceOrderDetail | null> {
  try {
    return await apiRequest<UserMarketplaceOrderDetail>(API_PATHS.me.marketplaceOrder(id), {
      token: token(),
    });
  } catch {
    return null;
  }
}

// ——— Admin ———

export async function apiGetAdminDashboard(): Promise<{
  kpis: AdminDashboardKpis;
  sourcing_rows: DashboardSourcingRow[];
  logistics: LogisticsPipelineCard[];
}> {
  return apiRequest(API_PATHS.admin.dashboard, { token: token() });
}

export async function apiGetAdminSourcingRequests(query: Record<string, string | number>) {
  return apiRequest<PaginatedResponse<AdminSourcingRequestListItem>>(
    API_PATHS.admin.sourcingRequests,
    { query, token: token() },
  );
}

export async function apiGetAdminSourcingDetail(
  id: string,
): Promise<AdminSourcingRequestDetailDto | null> {
  try {
    return await apiRequest<AdminSourcingRequestDetailDto>(
      API_PATHS.admin.sourcingRequest(id),
      { token: token() },
    );
  } catch {
    return null;
  }
}

export async function apiSaveOfficialQuote(
  requestId: string,
  body: UpsertOfficialQuoteRequest,
): Promise<UpsertOfficialQuoteResponse> {
  return apiRequest<UpsertOfficialQuoteResponse>(
    API_PATHS.admin.sourcingQuote(requestId),
    { method: 'PUT', body, token: token() },
  );
}

export async function apiGetAdminCategories() {
  const res = await apiRequest<{ data: AdminCategoryDto[] }>(API_PATHS.admin.categories, {
    token: token(),
  });
  return res.data;
}

export async function apiGetAdminCategory(id: string): Promise<AdminCategoryDto | null> {
  try {
    return await apiRequest<AdminCategoryDto>(API_PATHS.admin.category(id), {
      token: token(),
    });
  } catch {
    return null;
  }
}

export async function apiSaveAdminCategory(
  input: UpsertCategoryRequest & { id?: string },
): Promise<AdminCategoryDto> {
  if (input.id) {
    return apiRequest<AdminCategoryDto>(API_PATHS.admin.category(input.id), {
      method: 'PUT',
      body: input,
      token: token(),
    });
  }
  return apiRequest<AdminCategoryDto>(API_PATHS.admin.categories, {
    method: 'POST',
    body: input,
    token: token(),
  });
}

export async function apiGetAdminInventoryKpis(): Promise<AdminInventoryKpisDto> {
  return apiRequest<AdminInventoryKpisDto>(API_PATHS.admin.inventoryKpis, {
    token: token(),
  });
}

export async function apiListAdminInventory(query?: Record<string, string | number>) {
  return apiRequest<PaginatedResponse<AdminInventoryListItem>>(
    API_PATHS.admin.inventory,
    { query, token: token() },
  );
}

export async function apiGetAdminInventoryProduct(
  id: string,
): Promise<AdminInventoryProductDetail | null> {
  try {
    return await apiRequest<AdminInventoryProductDetail>(API_PATHS.admin.inventoryProduct(id), {
      token: token(),
    });
  } catch {
    return null;
  }
}

export async function apiCreateInventoryProduct(body: CreateInventoryProductRequest) {
  return apiRequest(API_PATHS.admin.inventoryProducts, {
    method: 'POST',
    body,
    token: token(),
  });
}

export async function apiUpdateInventoryProduct(
  id: string,
  body: Partial<CreateInventoryProductRequest>,
) {
  return apiRequest(API_PATHS.admin.inventoryProduct(id), {
    method: 'PUT',
    body,
    token: token(),
  });
}

export async function apiGetAdminMarketplaceOrders(): Promise<AdminMarketplaceOrderRow[]> {
  const res = await apiRequest<{ data: AdminMarketplaceOrderRow[] }>(API_PATHS.admin.orders, {
    token: token(),
  });
  return res.data;
}

export async function apiUpdateMarketplaceOrderStatus(id: string, status: string) {
  return apiRequest<AdminMarketplaceOrderRow>(API_PATHS.admin.order(id), {
    method: 'PATCH',
    body: { status },
    token: token(),
  });
}

// ——— Shipments ———

export async function apiListShipments(): Promise<Shipment[]> {
  const res = await apiRequest<{ data: Shipment[] }>(API_PATHS.shipments.root, {
    token: token(),
  });
  return res.data;
}

export async function apiGetShipment(trackingId: string): Promise<Shipment | null> {
  const normalized = normalizeTrackingId(trackingId);
  if (!normalized) return null;
  try {
    return await apiRequest<Shipment>(
      API_PATHS.shipments.byTracking(encodeURIComponent(normalized)),
    );
  } catch {
    return null;
  }
}

export async function apiGetMyShipment(trackingId: string): Promise<Shipment | null> {
  const normalized = normalizeTrackingId(trackingId);
  if (!normalized) return null;
  try {
    return await apiRequest<Shipment>(API_PATHS.me.shipmentByTracking(normalized), {
      token: token(),
    });
  } catch {
    return null;
  }
}

// ——— Uploads ———

export async function apiUploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  const accessToken = token();
  const res = await fetch(buildApiUrl(API_PATHS.uploads.image), {
    method: 'POST',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: form,
  });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      clearAuthSessionOnUnauthorized(API_PATHS.uploads.image, !!accessToken);
    }
    throw new Error(json?.error?.message ?? 'Upload failed');
  }
  return json as { url: string };
}
